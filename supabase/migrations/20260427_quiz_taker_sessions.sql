-- ── Soul-Sync Quiz Engine: quiz_taker_sessions table ──
-- Stores quiz-taker responses for scoring and certificate generation

CREATE TABLE IF NOT EXISTS quiz_taker_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  taker_name TEXT NOT NULL DEFAULT 'Anonymous',
  answers JSONB NOT NULL,                   -- [{ "question_index": 0, "selected_idx": 1 }, ...]
  scores JSONB NOT NULL,                    -- { "nostalgia": 80, "playful": 66, ... }
  soul_percentage NUMERIC(5,2) NOT NULL,
  soul_tier TEXT NOT NULL CHECK (soul_tier IN ('beautiful-strangers', 'twin-flames', 'architects', 'unified-soul')),
  is_challenge BOOLEAN DEFAULT FALSE,
  challenge_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fetching all takers for a quiz
CREATE INDEX IF NOT EXISTS idx_quiz_taker_sessions_quiz_id ON quiz_taker_sessions (quiz_id);

-- Enable Row Level Security
ALTER TABLE quiz_taker_sessions ENABLE ROW LEVEL SECURITY;

-- Allow public read (certificate page needs scores)
CREATE POLICY "Allow public read quiz_taker_sessions"
  ON quiz_taker_sessions
  FOR SELECT
  USING (true);

-- Allow public insert (any quiz-taker can submit)
CREATE POLICY "Allow public insert quiz_taker_sessions"
  ON quiz_taker_sessions
  FOR INSERT
  WITH CHECK (true);
