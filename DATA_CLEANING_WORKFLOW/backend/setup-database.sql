-- Database Setup Script for SANS EDA
-- Run this in PostgreSQL to set up the database

-- Create database if it doesn't exist
CREATE DATABASE sans_eda;

-- Connect to the database
\c sans_eda;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create analysis_history table
CREATE TABLE IF NOT EXISTS analysis_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_size INTEGER,
    analysis_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    results JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_id ON analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_status ON analysis_history(status);

-- Insert sample user for testing (password: test123)
INSERT INTO users (username, email, password_hash) 
VALUES ('testuser', 'test@example.com', '$2b$10$rQN5XZ4bYr2mKzKJmKzKJm.fQN5XZ4bYr2mKzKJmKzKJmfQN5XZ4bY')
ON CONFLICT (email) DO NOTHING;

GRANT ALL PRIVILEGES ON DATABASE sans_eda TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Show tables
\dt