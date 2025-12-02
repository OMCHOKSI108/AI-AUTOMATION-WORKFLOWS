require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const internalRoutes = require('./routes/internal');
const userRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
const resultsDir = path.join(__dirname, 'results');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
}

// Serve static files for results
app.use('/results', express.static(resultsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/internal', internalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'SANS EDA Backend is running' });
});

// API Documentation endpoint
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SANS EDA Backend API</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background-color: #f0f2f5; color: #333; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #3b82f6; text-align: center; }
        h2 { color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
        .endpoint { background: #f9fafb; padding: 10px; margin: 10px 0; border-left: 4px solid #3b82f6; }
        .method { font-weight: bold; color: #3b82f6; }
        code { background: #f3f4f6; padding: 2px 4px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>SANS EDA Backend API</h1>
        <p>Welcome to the SANS EDA Backend API. This API provides endpoints for user authentication, data upload, and analysis report management.</p>
        
        <h2>Base URL</h2>
        <p><code>http://localhost:3000</code></p>
        
        <h2>Authentication</h2>
        <p>Most endpoints require authentication. Include the JWT token in the Authorization header: <code>Bearer &lt;token&gt;</code></p>
        
        <h2>Endpoints</h2>
        
        <div class="endpoint">
            <span class="method">GET</span> <code>/health</code><br>
            Health check endpoint.
        </div>
        
        <div class="endpoint">
            <span class="method">POST</span> <code>/api/auth/signup</code><br>
            User registration. Body: { username, email, password }
        </div>
        
        <div class="endpoint">
            <span class="method">POST</span> <code>/api/auth/login</code><br>
            User login. Body: { emailOrUsername, password }
        </div>
        
        <div class="endpoint">
            <span class="method">POST</span> <code>/api/data/upload</code><br>
            Upload dataset for analysis (requires auth). FormData: dataset file.
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> <code>/api/data/history</code><br>
            Get user's analysis history (requires auth). Query: ?page=1&limit=20
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> <code>/api/data/reports/:id</code><br>
            Get specific analysis report (requires auth).
        </div>
        
        <h2>Frontend</h2>
        <p>The frontend application is available at: <a href="http://localhost:3001" target="_blank">http://localhost:3001</a></p>
        
        <h2>Status</h2>
        <p>✅ Backend is running and connected to database.</p>
    </div>
</body>
</html>
    `);
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`SANS EDA Backend server running on port ${PORT}`);
});

module.exports = app;