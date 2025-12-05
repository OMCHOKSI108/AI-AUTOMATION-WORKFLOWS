const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/dashboard/daily', async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const summaryResult = await pool.query(
      'SELECT * FROM email_brain.daily_summary WHERE summary_date = $1',
      [date]
    );
    const threadsResult = await pool.query(
      `SELECT t.id, p.name, p.email, t.category, t.status, t.latest_summary, t.created_at
       FROM email_brain.email_threads t
       JOIN email_brain.parties p ON p.id = t.party_id
       WHERE DATE(t.created_at) = $1
       ORDER BY t.created_at DESC`,
      [date]
    );
    res.json({
      date,
      summary: summaryResult.rows[0] || null,
      threads: threadsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/threads/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const threadResult = await pool.query(
      `SELECT t.*, p.name as party_name, p.email as party_email, p.company as party_company
       FROM email_brain.email_threads t
       JOIN email_brain.parties p ON p.id = t.party_id
       WHERE t.id = $1`,
      [id]
    );
    if (threadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    const messagesResult = await pool.query(
      `SELECT *
       FROM email_brain.email_messages
       WHERE thread_id = $1
       ORDER BY sent_at NULLS LAST, created_at`,
      [id]
    );
    const extractionResult = await pool.query(
      `SELECT * FROM email_brain.thread_extractions WHERE thread_id = $1`,
      [id]
    );
    res.json({
      thread: threadResult.rows[0],
      messages: messagesResult.rows,
      extraction: extractionResult.rows[0] || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Simple login endpoint using predefined credentials
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const validUsernames = ['omchoksi', 'omchoksi99@gmail.com'];
  if (validUsernames.includes(username) && password === 'omchoksi') {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, error: 'Invalid credentials' });
});

app.listen(PORT, () => {
  console.log(`Mail handler server listening on port ${PORT}`);
});
