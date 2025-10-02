const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Internal endpoint for n8n to update report results
// POST /api/internal/update-report
router.post('/update-report', async (req, res, next) => {
    try {
        const { reportId, status, results } = req.body;

        // Validation
        if (!reportId || !status) {
            return res.status(400).json({ error: 'reportId and status are required' });
        }

        if (!['completed', 'failed', 'processing'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Check if report exists
        const reportExists = await db.query(
            'SELECT id FROM reports WHERE id = $1',
            [reportId]
        );

        if (reportExists.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Begin transaction
        await db.query('BEGIN');

        try {
            // Update report status
            await db.query(
                'UPDATE reports SET status = $1 WHERE id = $2',
                [status, reportId]
            );

            // Insert results if provided
            if (results && Array.isArray(results)) {
                for (const result of results) {
                    if (!result.type || !result.data) {
                        continue; // Skip invalid results
                    }

                    await db.query(
                        'INSERT INTO report_results (report_id, result_type, content) VALUES ($1, $2, $3)',
                        [reportId, result.type, JSON.stringify(result.data)]
                    );
                }
            }

            // Commit transaction
            await db.query('COMMIT');

            console.log(`Report ${reportId} updated with status: ${status}`);

            res.status(200).json({
                message: 'Report updated successfully',
                reportId,
                status
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