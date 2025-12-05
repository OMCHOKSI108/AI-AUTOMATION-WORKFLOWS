-- Optional: precreate a dedicated schema/table for chat memory if you want control.
CREATE SCHEMA IF NOT EXISTS email_brain;

-- Parties / contacts (suppliers, traders, investors, etc.)
CREATE TABLE IF NOT EXISTS email_brain.parties (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  type TEXT, -- supplier, trader, investor, client, other
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_parties_email ON email_brain.parties(email);

-- Email threads (logical conversations / projects)
CREATE TABLE IF NOT EXISTS email_brain.email_threads (
  id BIGSERIAL PRIMARY KEY,
  party_id BIGINT NOT NULL REFERENCES email_brain.parties(id) ON DELETE CASCADE,
  subject TEXT,
  category TEXT NOT NULL, -- WORK_INQUIRY, GENERAL_QUERY, ANNOUNCEMENT, SPAM
  status TEXT NOT NULL,   -- NEW, CLARIFICATION_PENDING, WAITING_FOR_REPLY, WORK_CLEAR, CLOSED
  latest_summary TEXT,
  confidence NUMERIC(5,2), -- 0-100 classification confidence
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_threads_created_at ON email_brain.email_threads(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON email_brain.email_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON email_brain.email_messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_extractions_thread_id ON email_brain.thread_extractions(thread_id);

-- Structured extraction for a thread (latest snapshot)
CREATE TABLE IF NOT EXISTS email_brain.thread_extractions (
  id BIGSERIAL PRIMARY KEY,
  thread_id BIGINT NOT NULL UNIQUE REFERENCES email_brain.email_threads(id) ON DELETE CASCADE,
  work_type TEXT,
  budget TEXT,
  timeline TEXT,
  priority TEXT,
  language TEXT,
  final_request TEXT, -- final clarified description
  is_work_clear BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI decision & prompt log for traceability
CREATE TABLE IF NOT EXISTS email_brain.ai_logs (
  id BIGSERIAL PRIMARY KEY,
  thread_id BIGINT REFERENCES email_brain.email_threads(id) ON DELETE SET NULL,
  message_id BIGINT REFERENCES email_brain.email_messages(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- CLASSIFY, EXTRACT, GENERATE_REPLY, ERROR, RETRY
  model TEXT,
  prompt TEXT,
  raw_response TEXT,
  success BOOLEAN NOT NULL DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_logs_thread ON email_brain.ai_logs(thread_id);

-- Simple daily reporting rollup (optional, can be filled by n8n or cron)
CREATE TABLE IF NOT EXISTS email_brain.daily_summary (
  id BIGSERIAL PRIMARY KEY,
  summary_date DATE NOT NULL,
  total_emails INT NOT NULL DEFAULT 0,
  work_inquiries INT NOT NULL DEFAULT 0,
  general_queries INT NOT NULL DEFAULT 0,
  announcements INT NOT NULL DEFAULT 0,
  spam INT NOT NULL DEFAULT 0,
  work_clear INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(summary_date)
);
