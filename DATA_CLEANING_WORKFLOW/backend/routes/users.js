const express = require('express');
const db = require('../config/database');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// GET /api/users/profile
router.get('/profile', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;

        const result = await db.query(
            'SELECT id, username, email, role, avatar_url, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// PUT /api/users/profile
router.put('/profile', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { avatar_url } = req.body;

        // Only allow updating avatar_url for now. 
        // Username/email updates might require more validation/verification.
        
        const result = await db.query(
            'UPDATE users SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, email, role, avatar_url',
            [avatar_url, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// GET /api/users/preferences
router.get('/preferences', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;

        const result = await db.query(
            'SELECT * FROM user_preferences WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            // Return defaults if no preferences set
            return res.status(200).json({
                theme: 'light',
                default_visualization_type: 'bar',
                notifications_enabled: true
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// PUT /api/users/preferences
router.put('/preferences', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { theme, default_visualization_type, notifications_enabled } = req.body;

        // Upsert preferences
        const query = `
            INSERT INTO user_preferences (user_id, theme, default_visualization_type, notifications_enabled, updated_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                theme = EXCLUDED.theme,
                default_visualization_type = EXCLUDED.default_visualization_type,
                notifications_enabled = EXCLUDED.notifications_enabled,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `;

        const result = await db.query(query, [
            userId, 
            theme || 'light', 
            default_visualization_type || 'bar', 
            notifications_enabled !== undefined ? notifications_enabled : true
        ]);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
