const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const fs = require('fs');
const authenticateToken = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${sanitizedName}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept CSV, Excel files, and JSON
    const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/json',
        'text/plain'
    ];

    const allowedExtensions = ['.csv', '.xlsx', '.xls', '.json', '.txt'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only CSV, Excel, JSON, and TXT files are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// POST /api/data/upload (Protected Route)
router.post('/upload', authenticateToken, upload.single('dataset'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Generate unique report ID
        const reportId = uuidv4();
        const userId = req.user.id;
        const originalFilename = req.file.originalname;
        const savedFilename = req.file.filename;
        // Absolute path inside backend container (mounted for n8n as /app/uploads)
        const containerFilePath = path.join(__dirname, '../uploads', savedFilename); // resolves to /app/uploads/<file>

        // Insert report record into database
        await db.query(
            'INSERT INTO reports (id, user_id, original_filename, status) VALUES ($1, $2, $3, $4)',
            [reportId, userId, originalFilename, 'processing']
        );

        // Prepare payload for n8n webhook
        const webhookPayload = {
            reportId,
            filename: savedFilename,
            originalFilename,
            // Pass path that exists in both containers (mounted identically)
            filepath: containerFilePath
        };

        // Trigger n8n workflow (fire and forget)
        try {
            await axios.post(process.env.N8N_WEBHOOK_URL, webhookPayload, {
                timeout: 5000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(`n8n workflow triggered for report ${reportId}`);
        } catch (webhookError) {
            console.error('Failed to trigger n8n workflow:', webhookError.message);

            // Update report status to failed
            await db.query(
                'UPDATE reports SET status = $1 WHERE id = $2',
                ['failed', reportId]
            );

            // Insert error result
            await db.query(
                'INSERT INTO report_results (report_id, result_type, content) VALUES ($1, $2, $3)',
                [reportId, 'error', JSON.stringify({ message: 'Failed to start analysis workflow' })]
            );
        }

        res.status(202).json({
            message: 'File is being processed',
            reportId,
            status: 'processing'
        });

    } catch (error) {
        // Clean up uploaded file if database operation fails
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        next(error);
    }
});

// GET /api/data/history (Protected Route)
router.get('/history', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        // Get total count
        const countResult = await db.query(
            'SELECT COUNT(*) FROM reports WHERE user_id = $1',
            [userId]
        );
        const totalReports = parseInt(countResult.rows[0].count);

        // Get reports with pagination
        const result = await db.query(
            `SELECT id as report_id, original_filename, status, created_at 
       FROM reports 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
        );

        res.status(200).json({
            reports: result.rows,
            pagination: {
                page,
                limit,
                total: totalReports,
                totalPages: Math.ceil(totalReports / limit)
            }
        });

    } catch (error) {
        next(error);
    }
});

// GET /api/data/reports/:id (Protected Route)
router.get('/reports/:id', authenticateToken, async (req, res, next) => {
    try {
        const reportId = req.params.id;
        const userId = req.user.id;

        // Verify report belongs to user
        const reportResult = await db.query(
            'SELECT id, original_filename, status, created_at FROM reports WHERE id = $1 AND user_id = $2',
            [reportId, userId]
        );

        if (reportResult.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        const report = reportResult.rows[0];

        // Get all results for this report
        const resultsQuery = await db.query(
            'SELECT result_type, content, created_at FROM report_results WHERE report_id = $1 ORDER BY created_at ASC',
            [reportId]
        );

        // Organize results by type
        const organizedResults = {
            reportId,
            originalFilename: report.original_filename,
            status: report.status,
            createdAt: report.created_at,
            summary: null,
            cleaning: null,
            statistics: null,
            insights: null,
            plots: [],
            errors: []
        };

        resultsQuery.rows.forEach(result => {
            switch (result.result_type) {
                case 'summary':
                    organizedResults.summary = result.content;
                    break;
                case 'cleaning':
                    organizedResults.cleaning = result.content;
                    break;
                case 'statistics':
                    organizedResults.statistics = result.content;
                    break;
                case 'insight':
                    organizedResults.insights = result.content;
                    break;
                case 'plot_path':
                    organizedResults.plots.push(result.content);
                    break;
                case 'error':
                    organizedResults.errors.push(result.content);
                    break;
            }
        });

        res.status(200).json(organizedResults);

    } catch (error) {
        next(error);
    }
});

// GET /api/data/download/:reportId (Protected Route)
router.get('/download/:reportId', authenticateToken, async (req, res, next) => {
    try {
        const reportId = req.params.reportId;
        const userId = req.user.id;

        // Verify report belongs to user
        const reportResult = await db.query(
            'SELECT id FROM reports WHERE id = $1 AND user_id = $2',
            [reportId, userId]
        );

        if (reportResult.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Get cleaning result to find the file path
        const cleaningResult = await db.query(
            "SELECT content FROM report_results WHERE report_id = $1 AND result_type = 'cleaning' LIMIT 1",
            [reportId]
        );

        if (cleaningResult.rows.length === 0 || !cleaningResult.rows[0].content.downloadPath) {
            return res.status(404).json({ error: 'Cleaned file not found' });
        }

        const filename = cleaningResult.rows[0].content.downloadPath;
        const filePath = path.join(__dirname, '../uploads', filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found on server' });
        }

        res.download(filePath, `cleaned_${filename}`);

    } catch (error) {
        next(error);
    }
});

// GET /api/data/download-pdf/:reportId (Protected Route)
router.get('/download-pdf/:reportId', authenticateToken, async (req, res, next) => {
    let browser = null;
    try {
        const reportId = req.params.reportId;
        const userId = req.user.id;

        console.log(`[PDF] Generating PDF for report: ${reportId}`);

        // Verify report belongs to user
        const reportResult = await db.query(
            'SELECT original_filename, created_at, status FROM reports WHERE id = $1 AND user_id = $2',
            [reportId, userId]
        );

        if (reportResult.rows.length === 0) {
            console.log(`[PDF] Report not found: ${reportId}`);
            return res.status(404).json({ error: 'Report not found' });
        }

        const report = reportResult.rows[0];
        console.log(`[PDF] Report found: ${report.original_filename}`);

        // Get all results
        const resultsQuery = await db.query(
            'SELECT result_type, content FROM report_results WHERE report_id = $1 ORDER BY created_at',
            [reportId]
        );

        const organizedResults = {
            summary: null,
            statistics: null,
            insights: null,
            plots: []
        };

        resultsQuery.rows.forEach(result => {
            switch (result.result_type) {
                case 'summary':
                    organizedResults.summary = result.content;
                    break;
                case 'statistics':
                    organizedResults.statistics = result.content;
                    break;
                case 'insight':
                    organizedResults.insights = result.content;
                    break;
                case 'plot_path':
                    organizedResults.plots.push(result.content);
                    break;
            }
        });

        console.log('[PDF] Generating HTML content...');
        // Generate HTML for PDF
        const htmlContent = generatePDFHTML(report, organizedResults);

        console.log('[PDF] Launching Puppeteer...');
        // Generate PDF using puppeteer
        const puppeteer = require('puppeteer');
        browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });
        
        console.log('[PDF] Creating new page...');
        const page = await browser.newPage();
        
        console.log('[PDF] Setting HTML content...');
        await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 60000 });
        
        console.log('[PDF] Generating PDF buffer...');
        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
            printBackground: true
        });

        await browser.close();
        browser = null;

        console.log(`[PDF] PDF generated successfully, size: ${pdfBuffer.length} bytes`);

        // Set proper headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.setHeader('Content-Disposition', `attachment; filename="analysis_report_${report.original_filename}.pdf"`);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        // Send as buffer to avoid any encoding issues
        res.end(pdfBuffer, 'binary');

    } catch (error) {
        console.error('PDF generation error:', error);
        console.error('Error stack:', error.stack);
        
        // Ensure browser is closed
        if (browser) {
            try {
                await browser.close();
            } catch (closeError) {
                console.error('Error closing browser:', closeError);
            }
        }
        
        next(error);
    }
});

function generatePDFHTML(report, results) {
    const formatDate = (date) => new Date(date).toLocaleString();
    
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            h1 { color: #232f3e; border-bottom: 3px solid #ff9900; padding-bottom: 10px; }
            h2 { color: #007185; margin-top: 30px; border-bottom: 2px solid #e6f4f9; padding-bottom: 5px; }
            h3 { color: #232f3e; margin-top: 20px; }
            .header { background: #e6f4f9; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            .section { margin-bottom: 30px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .insights { background: #f9f9f9; padding: 20px; border-left: 4px solid #007185; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #232f3e; color: white; }
            .status { display: inline-block; padding: 5px 10px; border-radius: 15px; font-weight: bold; }
            .status-completed { background: #e6f4f1; color: #067d62; }
            .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
            img { max-width: 100%; height: auto; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>📊 Analysis Report</h1>
            <p><strong>File:</strong> ${report.original_filename}</p>
            <p><strong>Generated:</strong> ${formatDate(report.created_at)}</p>
            <p><strong>Status:</strong> <span class="status status-${report.status}">${report.status}</span></p>
        </div>
    `;

    // AI Insights
    if (results.insights) {
        html += `
        <div class="section insights">
            <h2>✨ AI Insights</h2>
            <div>${results.insights.replace(/\n/g, '<br>')}</div>
        </div>
        `;
    }

    // Summary
    if (results.summary) {
        const summary = typeof results.summary === 'string' ? JSON.parse(results.summary) : results.summary;
        html += `
        <div class="section">
            <h2>📋 Data Summary</h2>
            <table>
                <tr><th>Metric</th><th>Value</th></tr>
                <tr><td>Total Rows</td><td>${summary.rowCount || summary.rows || 'N/A'}</td></tr>
                <tr><td>Total Columns</td><td>${summary.columnCount || (Array.isArray(summary.columns) ? summary.columns.length : 'N/A')}</td></tr>
                <tr><td>Numerical Columns</td><td>${Array.isArray(summary.numericColumns) ? summary.numericColumns.length : (Array.isArray(summary.numerical_columns) ? summary.numerical_columns.length : 'N/A')}</td></tr>
                <tr><td>Categorical Columns</td><td>${Array.isArray(summary.categoricalColumns) ? summary.categoricalColumns.length : (Array.isArray(summary.categorical_columns) ? summary.categorical_columns.length : 'N/A')}</td></tr>
            </table>
        </div>
        `;

        // Statistics
        if (summary.statistics) {
            const stats = summary.statistics;
            const columns = Object.keys(stats);
            if (columns.length > 0) {
                const metrics = Object.keys(stats[columns[0]]);
                html += `
                <div class="section">
                    <h3>📊 Descriptive Statistics</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Metric</th>
                                ${columns.map(col => `<th>${col}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${metrics.map(metric => `
                                <tr>
                                    <td><strong>${metric}</strong></td>
                                    ${columns.map(col => `<td>${stats[col][metric] !== null ? (typeof stats[col][metric] === 'number' ? stats[col][metric].toFixed(2) : stats[col][metric]) : '-'}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                `;
            }
        }
    }

    // Visualizations
    if (results.statistics && results.statistics.visualizations) {
        html += `<div class="section"><h2>📈 Visualizations</h2>`;
        
        const vis = results.statistics.visualizations;
        if (vis.correlation_matrix) {
            html += `<div><h3>Correlation Matrix</h3><img src="${vis.correlation_matrix}" alt="Correlation Matrix" /></div>`;
        }
        if (vis.distributions && Array.isArray(vis.distributions)) {
            vis.distributions.forEach(dist => {
                html += `<div><h3>Distribution: ${dist.name}</h3><img src="${dist.image}" alt="${dist.name}" /></div>`;
            });
        }
        if (vis.categorical && Array.isArray(vis.categorical)) {
            vis.categorical.forEach(cat => {
                html += `<div><h3>Categories: ${cat.name}</h3><img src="${cat.image}" alt="${cat.name}" /></div>`;
            });
        }
        if (vis.clustering) {
            html += `<div><h3>🔍 Cluster Analysis</h3><img src="${vis.clustering}" alt="Clustering" /></div>`;
        }
        
        html += `</div>`;
    }

    html += `
        <div class="footer">
            <p>Generated by AutoEDA Platform • ${new Date().toLocaleDateString()}</p>
        </div>
    </body>
    </html>
    `;

    return html;
}

module.exports = router;