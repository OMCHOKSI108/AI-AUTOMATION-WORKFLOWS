const db = require('../config/database');

const createTables = async () => {
    try {
        // Create users table
        await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Create reports table
        await db.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        original_filename VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'processing' NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Create report_results table
        await db.query(`
      CREATE TABLE IF NOT EXISTS report_results (
        id SERIAL PRIMARY KEY,
        report_id VARCHAR(255) REFERENCES reports(id) ON DELETE CASCADE,
        result_type VARCHAR(50) NOT NULL,
        content JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Create indexes for better performance
        await db.query(`
      CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
      CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
      CREATE INDEX IF NOT EXISTS idx_report_results_report_id ON report_results(report_id);
      CREATE INDEX IF NOT EXISTS idx_report_results_type ON report_results(result_type);
    `);

        console.log('Database tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
};

const dropTables = async () => {
    try {
        await db.query('DROP TABLE IF EXISTS report_results CASCADE');
        await db.query('DROP TABLE IF EXISTS reports CASCADE');
        await db.query('DROP TABLE IF EXISTS users CASCADE');
        console.log('Database tables dropped successfully');
    } catch (error) {
        console.error('Error dropping tables:', error);
        throw error;
    }
};

module.exports = {
    createTables,
    dropTables
};