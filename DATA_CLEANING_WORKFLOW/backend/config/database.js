const { Pool } = require('pg');

// Create connection pool with better error handling
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'sans_eda',
    password: String(process.env.DB_PASSWORD || 'sans'),
    port: parseInt(process.env.DB_PORT) || 5432,
    // Add connection timeout and retry logic
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    max: 10
});

// Test the connection with better error handling
pool.on('connect', (client) => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('⚠️ Database connection error:', err.message);
    // Don't exit the process, let the app continue without DB
});

// Add a function to test database connectivity
const testConnection = async () => {
    try {
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        console.log('✅ Database connection test successful');
        return true;
    } catch (err) {
        console.error('❌ Database connection test failed:', err.message);
        console.log('💡 App will continue without database functionality');
        return false;
    }
};

// Test connection on startup
testConnection();

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
    testConnection
};