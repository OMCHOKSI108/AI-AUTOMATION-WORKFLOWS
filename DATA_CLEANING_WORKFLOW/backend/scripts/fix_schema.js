const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'SANS',
    password: String(process.env.DB_PASSWORD || 'sans'),
    port: parseInt(process.env.DB_PORT) || 5432,
});

async function fixSchema() {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();
        console.log('Connected.');

        console.log('Checking reports table for updated_at column...');
        
        const res = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='reports' AND column_name='updated_at';
        `);

        if (res.rows.length === 0) {
            console.log('Adding updated_at column to reports table...');
            await client.query(`
                ALTER TABLE reports 
                ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
            `);
            console.log('✅ Column updated_at added successfully.');
        } else {
            console.log('ℹ️ Column updated_at already exists.');
        }

        console.log('Current columns in reports table:');
        const allCols = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='reports';
        `);
        console.log(allCols.rows.map(r => r.column_name).join(', '));

        // Also check for completed_at just in case
        const resCompleted = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='reports' AND column_name='completed_at';
        `);

        if (resCompleted.rows.length === 0) {
            console.log('Adding completed_at column to reports table...');
            await client.query(`
                ALTER TABLE reports 
                ADD COLUMN completed_at TIMESTAMP;
            `);
            console.log('✅ Column completed_at added successfully.');
        }

         // Also check for error_message just in case
         const resError = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='reports' AND column_name='error_message';
        `);

        if (resError.rows.length === 0) {
            console.log('Adding error_message column to reports table...');
            await client.query(`
                ALTER TABLE reports 
                ADD COLUMN error_message TEXT;
            `);
            console.log('✅ Column error_message added successfully.');
        }

        client.release();
        pool.end();
        console.log('Schema fix completed.');
    } catch (err) {
        console.error('❌ Error fixing schema:', err);
        process.exit(1);
    }
}

fixSchema();
