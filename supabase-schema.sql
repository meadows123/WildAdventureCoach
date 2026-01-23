-- Supabase Database Schema for Wild Adventure Coach
-- Run this SQL in your Supabase SQL Editor

-- Table: bookings
-- Stores all retreat bookings
CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  stripe_session_id TEXT UNIQUE NOT NULL,
  retreat_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  gender TEXT,
  age INTEGER,
  wake_up_time TEXT,
  hiking_experience TEXT,
  participants INTEGER NOT NULL DEFAULT 1,
  amount_paid INTEGER NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  booking_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: retreat_capacity
-- Manages maximum capacity for each retreat
CREATE TABLE IF NOT EXISTS retreat_capacity (
  id BIGSERIAL PRIMARY KEY,
  retreat_name TEXT UNIQUE NOT NULL,
  max_capacity INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial retreat capacity
INSERT INTO retreat_capacity (retreat_name, max_capacity)
VALUES 
  ('Mountain Summit Experience', 12),
  ('Hiking and Yoga Retreat - June', 12),
  ('Hiking and Yoga Retreat - August', 10)
ON CONFLICT (retreat_name) DO NOTHING;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_retreat ON bookings(retreat_name);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session ON bookings(stripe_session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE retreat_capacity ENABLE ROW LEVEL SECURITY;

-- Policies for bookings (allow service role to do everything)
CREATE POLICY "Enable all access for service role" ON bookings
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON bookings
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policies for retreat_capacity (public read, service write)
CREATE POLICY "Enable read access for all" ON retreat_capacity
  FOR SELECT
  USING (true);

CREATE POLICY "Enable all access for service role" ON retreat_capacity
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- View: retreat_stats
-- Convenient view for checking capacity status
CREATE OR REPLACE VIEW retreat_stats AS
SELECT 
  rc.retreat_name,
  rc.max_capacity,
  COALESCE(SUM(b.participants) FILTER (WHERE b.payment_status = 'completed'), 0) as current_bookings,
  rc.max_capacity - COALESCE(SUM(b.participants) FILTER (WHERE b.payment_status = 'completed'), 0) as available_spots,
  COUNT(b.id) FILTER (WHERE b.payment_status = 'completed') as total_bookings,
  COALESCE(SUM(b.amount_paid) FILTER (WHERE b.payment_status = 'completed'), 0) as total_revenue
FROM retreat_capacity rc
LEFT JOIN bookings b ON b.retreat_name = rc.retreat_name
GROUP BY rc.retreat_name, rc.max_capacity;

-- Function: check_capacity
-- Returns true if booking would exceed capacity
CREATE OR REPLACE FUNCTION check_capacity(
  p_retreat_name TEXT,
  p_participants INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_available_spots INTEGER;
BEGIN
  SELECT available_spots INTO v_available_spots
  FROM retreat_stats
  WHERE retreat_name = p_retreat_name;
  
  RETURN COALESCE(v_available_spots, 0) >= p_participants;
END;
$$;

-- Comments for documentation
COMMENT ON TABLE bookings IS 'Stores all retreat bookings with payment information';
COMMENT ON TABLE retreat_capacity IS 'Manages maximum capacity limits for each retreat';
COMMENT ON VIEW retreat_stats IS 'Real-time statistics for retreat bookings and capacity';

