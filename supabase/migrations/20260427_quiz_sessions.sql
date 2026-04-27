-- ── Soul-Sync Quiz Engine: quiz_sessions table ──
-- Stores quiz sessions created by users after payment

CREATE TABLE IF NOT EXISTS quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_id TEXT UNIQUE NOT NULL,         -- nanoid for URL: wedinvite.in/quiz/[invite_id]
  couple_name_1 TEXT NOT NULL,
  couple_name_2 TEXT NOT NULL,
  config JSONB NOT NULL,                   -- [{ "q_id": "uuid-1", "correct_idx": 0 }, ...]
  couple_photo_url TEXT,
  love_note TEXT,
  floral_theme TEXT DEFAULT 'rose',
  color_mood TEXT DEFAULT 'romantic-pink',
  background_music TEXT,
  payment_id TEXT,
  paid BOOLEAN DEFAULT FALSE,
  challenger_quiz_id UUID REFERENCES quiz_sessions(id),  -- Viral loop FK
  combined_score NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Index for quick URL lookups
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_invite_id ON quiz_sessions (invite_id);

-- Index for checking if a quiz has challengers
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_challenger ON quiz_sessions (challenger_quiz_id);

-- Enable Row Level Security
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Allow public read for any quiz session (so quiz-takers can view)
CREATE POLICY "Allow public read quiz_sessions"
  ON quiz_sessions
  FOR SELECT
  USING (true);

-- Allow authenticated insert (after payment)
CREATE POLICY "Allow authenticated insert quiz_sessions"
  ON quiz_sessions
  FOR INSERT
  WITH CHECK (true);

-- Allow service_role update (for payment confirmation, challenge linking)
CREATE POLICY "Allow service_role update quiz_sessions"
  ON quiz_sessions
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'service_role');
