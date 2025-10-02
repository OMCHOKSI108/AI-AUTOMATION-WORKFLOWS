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
        const filepath = `/uploads/${savedFilename}`;

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
            filepath: path.join(__dirname, '../uploads', savedFilename)
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
            insights: null,
            plots: [],
            errors: []
        };

        resultsQuery.rows.forEach(result => {
            switch (result.result_type) {
                case 'summary':
                    organizedResults.summary = result.content;
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

module.exports = router;