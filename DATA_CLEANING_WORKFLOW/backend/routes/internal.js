const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const db = require('../config/database');

const router = express.Router();

// POST /api/internal/analyze
// Executes Python analysis script
router.post('/analyze', async (req, res, next) => {
    try {
        const { filePath, reportId } = req.body;

        if (!filePath || !reportId) {
            return res.status(400).json({ error: 'filePath and reportId are required' });
        }

        const scriptPath = path.join(__dirname, '../scripts/analyze_data.py');
        const statsScriptPath = path.join(__dirname, '../scripts/generate_statistics.py');
        const outputDir = path.join(__dirname, '../results');

        // First run analyze_data.py
        const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
        const analyzeProcess = spawn(pythonCommand, [scriptPath, filePath, reportId, outputDir]);

        let analyzeDataString = '';
        let analyzeErrorString = '';

        analyzeProcess.stdout.on('data', (data) => {
            analyzeDataString += data.toString();
        });

        analyzeProcess.stderr.on('data', (data) => {
            analyzeErrorString += data.toString();
        });

        analyzeProcess.on('close', (analyzeCode) => {
            if (analyzeCode !== 0) {
                console.error(`Analyze script exited with code ${analyzeCode}`);
                console.error(`Error: ${analyzeErrorString}`);
                return res.status(500).json({ error: 'Analysis failed', details: analyzeErrorString });
            }

            try {
                const analyzeResult = JSON.parse(analyzeDataString);
                
                // Now run generate_statistics.py
                const statsProcess = spawn(pythonCommand, [statsScriptPath, filePath, reportId]);

                let statsDataString = '';
                let statsErrorString = '';

                statsProcess.stdout.on('data', (data) => {
                    statsDataString += data.toString();
                });

                statsProcess.stderr.on('data', (data) => {
                    statsErrorString += data.toString();
                });

                statsProcess.on('close', (statsCode) => {
                    if (statsCode !== 0) {
                        console.error(`Stats script exited with code ${statsCode}`);
                        console.error(`Error: ${statsErrorString}`);
                        // Still return analyze result even if stats fail
                        return res.status(200).json(analyzeResult);
                    }

                    try {
                        const statsResult = JSON.parse(statsDataString);
                        
                        // Merge results
                        const combinedResult = {
                            ...analyzeResult,
                            statistics: statsResult
                        };
                        
                        res.status(200).json(combinedResult);
                    } catch (statsParseError) {
                        console.error('Failed to parse stats output:', statsParseError);
                        // Return analyze result
                        res.status(200).json(analyzeResult);
                    }
                });

            } catch (analyzeParseError) {
                console.error('Failed to parse analyze output:', analyzeParseError);
                res.status(500).json({ error: 'Invalid output from analysis script', raw: analyzeDataString });
            }
        });

    } catch (error) {
        next(error);
    }
});

// Internal endpoint for n8n to update report results
// POST /api/internal/update-report
// Enhanced version supporting multiple result formats
router.post('/update-report', async (req, res, next) => {
    try {
        const { reportId, status, resultType, content, error } = req.body;

        // Validation
        if (!reportId) {
            return res.status(400).json({ error: 'reportId is required' });
        }

        // Check if report exists
        const reportExists = await db.query(
            'SELECT id, status FROM reports WHERE id = $1',
            [reportId]
        );

        if (reportExists.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Begin transaction
        await db.query('BEGIN');

        try {
            // Update report status if provided
            if (status) {
                if (!['completed', 'failed', 'processing', 'cancelled'].includes(status)) {
                    throw new Error('Invalid status value');
                }

                const updateFields = ['status = $1'];
                const updateValues = [status, reportId];
                let paramIndex = 2;

                // Add completed_at timestamp if status is completed
                if (status === 'completed') {
                    updateFields.push(`completed_at = CURRENT_TIMESTAMP`);
                }

                // Add error message if status is failed
                if (status === 'failed' && error) {
                    updateFields.push(`error_message = $${paramIndex++}`);
                    updateValues.splice(updateValues.length - 1, 0, error);
                }

                await db.query(
                    `UPDATE reports SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex}`,
                    updateValues
                );
            }

            // Insert result if provided
            if (resultType && content) {
                const validTypes = ['summary', 'statistics', 'cleaning', 'insight', 'plot_path', 'correlation', 'missing_values', 'outliers', 'error'];
                
                if (!validTypes.includes(resultType)) {
                    console.warn(`Unknown result type: ${resultType}`);
                }

                // Convert content to JSONB if it's an object
                // Always stringify content to ensure valid JSONB format for Postgres
                // If content is a string (like insights), it becomes a JSON string "..."
                // If content is an object (like stats), it becomes a JSON object string "{...}"
                const contentToStore = JSON.stringify(content);

                await db.query(
                    'INSERT INTO report_results (report_id, result_type, content) VALUES ($1, $2, $3::jsonb)',
                    [reportId, resultType, contentToStore]
                );

                console.log(`Saved ${resultType} result for report ${reportId}`);
            }

            // Commit transaction
            await db.query('COMMIT');

            console.log(`Report ${reportId} updated successfully`);

            res.status(200).json({
                success: true,
                message: 'Report updated successfully',
                reportId,
                status: status || reportExists.rows[0].status
            });

        } catch (error) {
            // Rollback transaction
            await db.query('ROLLBACK');
            throw error;
        }

    } catch (error) {
        next(error);
    }
});

// Health check for internal services
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Internal API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;