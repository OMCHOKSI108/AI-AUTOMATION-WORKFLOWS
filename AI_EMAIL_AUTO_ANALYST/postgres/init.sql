-- Optional: precreate a dedicated schema/table for chat memory if you want control.
CREATE SCHEMA IF NOT EXISTS email_brain;

CREATE TABLE IF NOT EXISTS email_brain.chat_memory (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('system','user','assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_memory_session ON email_brain.chat_memory(session_id);
