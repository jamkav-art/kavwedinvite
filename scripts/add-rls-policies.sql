-- Enable Row Level Security (RLS) on tables if not already enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (optional)
DROP POLICY IF EXISTS "Allow public read for active/paid orders" ON orders;
DROP POLICY IF EXISTS "Allow public read for events" ON events;
DROP POLICY IF EXISTS "Allow public read for media" ON media;
DROP POLICY IF EXISTS "Allow public insert for RSVPs" ON rsvps;
DROP POLICY IF EXISTS "Allow admin read for RSVPs" ON rsvps;

-- Create policy that allows public SELECT on orders where status is 'active' or 'paid'
CREATE POLICY "Allow public read for active/paid orders" ON orders
  FOR SELECT USING (status IN ('active', 'paid'));

-- Create policy that allows public SELECT on events linked to visible orders
CREATE POLICY "Allow public read for events" ON events
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = events.order_id
      AND orders.status IN ('active', 'paid')
  ));

-- Create policy that allows public SELECT on media linked to visible orders
CREATE POLICY "Allow public read for media" ON media
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = media.order_id
      AND orders.status IN ('active', 'paid')
  ));

-- Create policy that allows public INSERT on rsvps for active/paid orders
CREATE POLICY "Allow public insert for RSVPs" ON rsvps
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.invite_id = rsvps.invite_id
        AND orders.status IN ('active', 'paid')
    )
  );

-- Create policy that allows admin read (no public read)
CREATE POLICY "Allow admin read for RSVPs" ON rsvps
  FOR SELECT USING (false);

-- Verify policies were created
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('orders', 'events', 'media', 'rsvps')
ORDER BY tablename, policyname;