-- ============================================================================
-- FIX: get_next_single_queue_item — resolves FOR UPDATE + LEFT JOIN conflict
-- ============================================================================
-- Uses CTE to first lock the row, then join with lookup tables.
-- This avoids FOR UPDATE on nullable join sides.
-- ============================================================================

-- Drop the old function
DROP FUNCTION IF EXISTS get_next_single_queue_item();

-- Recreate using CTE pattern (lock first, join later)
CREATE OR REPLACE FUNCTION get_next_single_queue_item()
RETURNS TABLE (
  queue_id INTEGER,
  location_name TEXT,
  location_slug TEXT,
  topic_name TEXT,
  topic_slug TEXT,
  subtopic_name TEXT,
  subtopic_slug TEXT,
  target_keyword TEXT,
  url_slug TEXT,
  priority_score INTEGER,
  cultural_context TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH locked AS (
    SELECT cq.id
    FROM content_queue cq
    WHERE cq.status = 'pending'
    ORDER BY cq.priority_score DESC, cq.id ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  SELECT
    cq.id::INTEGER,
    wl.name,
    wl.slug,
    wt.name,
    wt.slug,
    ws.name,
    ws.slug,
    cq.target_keyword,
    cq.url_slug,
    cq.priority_score,
    COALESCE(ws.cultural_context, 'general')
  FROM content_queue cq
  INNER JOIN locked l ON cq.id = l.id
  INNER JOIN wedding_locations wl ON cq.location_id = wl.id
  INNER JOIN wedding_topics wt ON cq.topic_id = wt.id
  LEFT JOIN wedding_subtopics ws ON cq.subtopic_id = ws.id;
END;
$$;
