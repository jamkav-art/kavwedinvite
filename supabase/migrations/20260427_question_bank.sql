-- ── Soul-Sync Quiz Engine: question_bank table ──
-- Stores the master bank of 50 pre-defined questions across 5 patterns

CREATE TABLE IF NOT EXISTS question_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('nostalgia', 'playful', 'soul', 'discovery', 'future')),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,  -- Array of exactly 3 strings: ["Sincere", "Funny", "Absurd"]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast random queries by category
CREATE INDEX IF NOT EXISTS idx_question_bank_category ON question_bank (category);

-- Enable Row Level Security
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can fetch questions)
CREATE POLICY "Allow public read access"
  ON question_bank
  FOR SELECT
  USING (true);

-- Only service_role can insert/update/delete (seeded via migration or admin)
CREATE POLICY "Allow service_role insert"
  ON question_bank
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service_role update"
  ON question_bank
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service_role delete"
  ON question_bank
  FOR DELETE
  USING (auth.jwt() ->> 'role' = 'service_role');
