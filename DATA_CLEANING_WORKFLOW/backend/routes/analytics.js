const express = require('express');
const authenticateToken = require('../middleware/auth');
const db = require('../config/database');
const router = express.Router();

/**
 * GET /api/analytics/dashboard-stats
 * Get dashboard statistics for the authenticated user
 */
router.get('/dashboard-stats', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get total reports count
        const totalResult = await db.query(
            'SELECT COUNT(*) as total FROM reports WHERE user_id = $1',
            [userId]
        );

        // Get status breakdown
        const statusResult = await db.query(
            `SELECT status, COUNT(*) as count 
             FROM reports 
             WHERE user_id = $1 
             GROUP BY status`,
            [userId]
        );

        // Get recent activity (last 7 days)
        const recentResult = await db.query(
            `SELECT DATE(created_at) as date, COUNT(*) as count 
             FROM reports 
             WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days'
             GROUP BY DATE(created_at)
             ORDER BY date DESC`,
            [userId]
        );

        // Calculate average processing time for completed reports
        const avgTimeResult = await db.query(
            `SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_seconds
             FROM reports
             WHERE user_id = $1 AND status = 'completed'`,
            [userId]
        );

        const stats = {
            total: parseInt(totalResult.rows[0].total) || 0,
            byStatus: statusResult.rows.reduce((acc, row) => {
                acc[row.status] = parseInt(row.count);
                return acc;
            }, {}),
            recentActivity: recentResult.rows,
            averageProcessingTime: avgTimeResult.rows[0].avg_seconds 
                ? Math.round(avgTimeResult.rows[0].avg_seconds) 
                : null
        };

        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/analytics/report-summary/:id
 * Get detailed summary for a specific report
 */
router.get('/report-summary/:id', authenticateToken, async (req, res, next) => {
    try {
        const reportId = req.params.id;
        const userId = req.user.id;

        // Verify report belongs to user
        const reportResult = await db.query(
            'SELECT * FROM reports WHERE id = $1 AND user_id = $2',
            [reportId, userId]
        );

        if (reportResult.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        const report = reportResult.rows[0];

        // Get all results
        const resultsResult = await db.query(
            'SELECT * FROM report_results WHERE report_id = $1 ORDER BY created_at ASC',
            [reportId]
        );

        // Organize results
        const summary = {
            reportId,
            fileName: report.original_filename,
            status: report.status,
            createdAt: report.created_at,
            updatedAt: report.updated_at,
            results: {
                summary: null,
                insights: null,
                plots: [],
                statistics: null,
                correlations: null,
                missingValues: null,
                outliers: null,
                errors: []
            }
        };

        resultsResult.rows.forEach(result => {
            try {
                const content = typeof result.content === 'string' 
                    ? JSON.parse(result.content) 
                    : result.content;

                switch (result.result_type) {
                    case 'summary':
                        summary.results.summary = content;
                        break;
                    case 'insight':
                        summary.results.insights = content;
                        break;
                    case 'plot_path':
                        summary.results.plots.push(content);
                        break;
                    case 'statistics':
                        summary.results.statistics = content;
                        break;
                    case 'correlations':
                        summary.results.correlations = content;
                        break;
                    case 'missing_values':
                        summary.results.missingValues = content;
                        break;
                    case 'outliers':
                        summary.results.outliers = content;
                        break;
                    case 'error':
                        summary.results.errors.push(content);
                        break;
                }
            } catch (parseError) {
                console.error('Error parsing result content:', parseError);
            }
        });

        res.status(200).json(summary);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/analytics/user-insights
 * Get aggregated insights across all user reports
 */
router.get('/user-insights', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get most common file types
        const fileTypesResult = await db.query(
            `SELECT 
                CASE 
                    WHEN original_filename LIKE '%.csv' THEN 'CSV'
                    WHEN original_filename LIKE '%.xlsx' OR original_filename LIKE '%.xls' THEN 'Excel'
                    WHEN original_filename LIKE '%.json' THEN 'JSON'
                    WHEN original_filename LIKE '%.txt' THEN 'Text'
                    ELSE 'Other'
                END as file_type,
                COUNT(*) as count
            FROM reports
            WHERE user_id = $1
            GROUP BY file_type
            ORDER BY count DESC`,
            [userId]
        );

        // Get upload frequency by day of week
        const uploadFrequencyResult = await db.query(
            `SELECT 
                TO_CHAR(created_at, 'Day') as day_name,
                EXTRACT(DOW FROM created_at) as day_num,
                COUNT(*) as count
            FROM reports
            WHERE user_id = $1
            GROUP BY day_name, day_num
            ORDER BY day_num`,
            [userId]
        );

        // Get success rate over time (last 30 days)
        const successRateResult = await db.query(
            `SELECT 
                DATE(created_at) as date,
                COUNT(*) as total,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
            FROM reports
            WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY date DESC`,
            [userId]
        );

        const insights = {
            fileTypes: fileTypesResult.rows,
            uploadFrequency: uploadFrequencyResult.rows,
            successRateTrend: successRateResult.rows.map(row => ({
                date: row.date,
                total: parseInt(row.total),
                completed: parseInt(row.completed),
                successRate: row.total > 0 ? ((row.completed / row.total) * 100).toFixed(1) : 0
            }))
        };

        res.status(200).json(insights);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/analytics/generate-insights
 * Generate AI insights for a specific report (called after analysis is complete)
 */
router.post('/generate-insights/:reportId', authenticateToken, async (req, res, next) => {
    try {
        const reportId = req.params.reportId;
        const userId = req.user.id;
        const { summaryData } = req.body;

        // Verify report belongs to user
        const reportResult = await db.query(
            'SELECT * FROM reports WHERE id = $1 AND user_id = $2',
            [reportId, userId]
        );

        if (reportResult.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // This would typically call an AI service (Gemini, OpenAI, etc.)
        // For now, generate basic insights from the summary data
        const insights = {
            dataQuality: generateDataQualityInsights(summaryData),
            recommendations: generateRecommendations(summaryData),
            keyFindings: generateKeyFindings(summaryData)
        };

        // Store insights
        await db.query(
            'INSERT INTO report_results (report_id, result_type, content) VALUES ($1, $2, $3)',
            [reportId, 'insight', JSON.stringify(insights)]
        );

        res.status(200).json(insights);
    } catch (error) {
        next(error);
    }
});

// Helper functions for generating insights
function generateDataQualityInsights(data) {
    if (!data) return 'No data available for quality assessment';
    
    const insights = [];
    
    if (data.missingValues) {
        const totalMissing = Object.values(data.missingValues).reduce((a, b) => a + b, 0);
        if (totalMissing > 0) {
            insights.push(`Dataset contains ${totalMissing} missing values that may need attention.`);
        } else {
            insights.push('Dataset is complete with no missing values.');
        }
    }
    
    if (data.rowCount && data.columnCount) {
        insights.push(`Dataset has ${data.rowCount} rows and ${data.columnCount} columns.`);
    }
    
    return insights.join(' ');
}

function generateRecommendations(data) {
    const recommendations = [];
    
    if (data.missingValues) {
        const columns = Object.keys(data.missingValues);
        const columnsWithMissing = columns.filter(col => data.missingValues[col] > 0);
        
        if (columnsWithMissing.length > 0) {
            recommendations.push(`Consider handling missing values in: ${columnsWithMissing.join(', ')}`);
        }
    }
    
    if (data.outliers && data.outliers.length > 0) {
        recommendations.push('Review identified outliers to determine if they are errors or valid extreme values');
    }
    
    recommendations.push('Consider normalizing/standardizing numeric features before modeling');
    
    return recommendations;
}

function generateKeyFindings(data) {
    const findings = [];
    
    if (data.correlations) {
        findings.push('Correlation analysis completed - check heatmap for relationships');
    }
    
    if (data.numericColumns && data.numericColumns.length > 0) {
        findings.push(`Identified ${data.numericColumns.length} numeric columns for analysis`);
    }
    
    if (data.categoricalColumns && data.categoricalColumns.length > 0) {
        findings.push(`Identified ${data.categoricalColumns.length} categorical columns`);
    }
    
    return findings;
}

module.exports = router;
