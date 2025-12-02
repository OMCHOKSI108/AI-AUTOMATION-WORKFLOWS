-- Database Setup Script for SANS EDA
-- Run this in PostgreSQL to set up the database

-- Database Setup Script for SANS EDA
-- Enhanced schema with updated columns and indexes

-- Create database if it doesn't exist
-- Note: This line might need to be run separately if not connected
-- CREATE DATABASE SANS;

-- Connect to the database
\c SANS;

-- Drop existing tables if you want a fresh start (CAUTION: This deletes all data!)
-- DROP TABLE IF EXISTS report_results CASCADE;
-- DROP TABLE IF EXISTS reports CASCADE;
-- DROP TABLE IF EXISTS user_preferences CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- Create users table with enhanced fields
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(20) DEFAULT 'user',
    avatar_url TEXT,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Create user_preferences table with more options
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    default_visualization_type VARCHAR(50) DEFAULT 'bar',
    notifications_enabled BOOLEAN DEFAULT true,
    email_reports BOOLEAN DEFAULT false,
    auto_clean_data BOOLEAN DEFAULT true,
    preferred_file_format VARCHAR(10) DEFAULT 'csv',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table with enhanced tracking
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    original_filename VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT,
    file_type VARCHAR(10),
    status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    processing_time_seconds INTEGER,
    error_message TEXT
);

-- Create report_results table with enhanced metadata
CREATE TABLE IF NOT EXISTS report_results (
    id SERIAL PRIMARY KEY,
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    result_type VARCHAR(50) NOT NULL CHECK (result_type IN ('summary', 'statistics', 'cleaning', 'insight', 'plot_path', 'correlation', 'missing_values', 'outliers', 'error')),
    content JSONB,
    file_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_report_results_report_id ON report_results(report_id);
CREATE INDEX IF NOT EXISTS idx_report_results_type ON report_results(result_type);

-- Create JSONB indexes for faster queries on report results
CREATE INDEX IF NOT EXISTS idx_report_results_content_gin ON report_results USING GIN (content);

-- Create function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reports_updated_at ON reports;
CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample user for testing (password: test123)
INSERT INTO users (username, email, password_hash) 
VALUES ('testuser', 'test@example.com', '$2b$10$rQN5XZ4bYr2mKzKJmKzKJm.fQN5XZ4bYr2mKzKJmKzKJmfQN5XZ4bY')
ON CONFLICT (email) DO NOTHING;

GRANT ALL PRIVILEGES ON DATABASE SANS TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Show tables
\dt