import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from './db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Middleware to verify JWT
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    (req as any).user = user;
    next();
  });
};

// Healthcheck
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Daily overview for dashboard
app.get('/api/dashboard/daily', authenticateToken, async (req: Request, res: Response) => {
  try {
    const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    const summary = await pool.query(
      'SELECT * FROM email_brain.daily_summary WHERE summary_date = $1',
      [date]
    );

    const threads = await pool.query(
      `SELECT t.id, p.name, p.email, t.category, t.status, t.latest_summary, t.created_at
       FROM email_brain.email_threads t
       JOIN email_brain.parties p ON p.id = t.party_id
       WHERE DATE(t.created_at) = $1
       ORDER BY t.created_at DESC`,
      [date]
    );

    res.json({
      date,
      summary: summary.rows[0] || null,
      threads: threads.rows,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Detail view per thread
app.get('/api/threads/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid thread ID' });
    }
    const threadRes = await pool.query(
      `SELECT t.*, p.name as party_name, p.email as party_email, p.company as party_company
       FROM email_brain.email_threads t
       JOIN email_brain.parties p ON p.id = t.party_id
       WHERE t.id = $1`,
      [id]
    );

    if (threadRes.rows.length === 0) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const messagesRes = await pool.query(
      `SELECT *
       FROM email_brain.email_messages
       WHERE thread_id = $1
       ORDER BY sent_at NULLS LAST, created_at`,
      [id]
    );

    const extractionRes = await pool.query(
      `SELECT * FROM email_brain.thread_extractions WHERE thread_id = $1`,
      [id]
    );

    res.json({
      thread: threadRes.rows[0],
      messages: messagesRes.rows,
      extraction: extractionRes.rows[0] || null,
    });
  } catch (err) {
    console.error('Thread error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Basic metrics endpoint for monitoring
app.get('/metrics', authenticateToken, async (req: Request, res: Response) => {
  try {
    const threadsCount = await pool.query('SELECT COUNT(*) as count FROM email_brain.email_threads');
    const messagesCount = await pool.query('SELECT COUNT(*) as count FROM email_brain.email_messages');
    res.json({
      threads: threadsCount.rows[0].count,
      messages: messagesCount.rows[0].count,
      uptime: process.uptime(),
    });
  } catch (err) {
    console.error('Metrics error:', err);
    res.status(500).json({ error: 'Metrics unavailable' });
  }
});

// Login endpoint with JWT
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password required' });
  }
  const validUsernames = ['omchoksi', 'omchoksi99@gmail.com'];
  const hashedPassword = '$2a$10$fLup1I5p5xVakWziEy7rG.xt1HWTumug0OrnNPQ0nsJzTM0G5jjC2'; // Pre-hashed for demo
  if (validUsernames.includes(username) && await bcrypt.compare(password, hashedPassword)) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ success: true, token });
  }
  return res.status(401).json({ success: false, error: 'Invalid credentials' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
