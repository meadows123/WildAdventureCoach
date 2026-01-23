-- Migration: Update bookings table with new fields
-- Run this SQL in your Supabase SQL Editor if you already have an existing database
-- This will add the new columns and remove old ones

-- Add new columns
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS wake_up_time TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS hiking_experience TEXT;

-- Remove old columns (if they exist)
ALTER TABLE bookings DROP COLUMN IF EXISTS phone;
ALTER TABLE bookings DROP COLUMN IF EXISTS special_requests;

-- Set default for participants (for single person bookings)
ALTER TABLE bookings ALTER COLUMN participants SET DEFAULT 1;

-- Add capacity for new retreats
INSERT INTO retreat_capacity (retreat_name, max_capacity)
VALUES 
  ('Hiking and Yoga Retreat - June', 12),
  ('Hiking and Yoga Retreat - August', 10)
ON CONFLICT (retreat_name) DO NOTHING;

-- Refresh the retreat_stats view (it should work automatically with the new structure)
COMMENT ON TABLE bookings IS 'Updated: Now stores gender, age, wake_up_time, and hiking_experience instead of phone and special_requests';

