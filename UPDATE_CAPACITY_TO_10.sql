-- Update retreat capacity to 10 participants for safety
-- Run this SQL in your Supabase SQL Editor

-- Update the August retreat capacity to 10 (safety first!)
UPDATE retreat_capacity 
SET max_capacity = 10 
WHERE retreat_name = 'Hiking and Yoga Retreat - August';

-- Also update any other retreats to 10 for consistency
UPDATE retreat_capacity 
SET max_capacity = 10 
WHERE retreat_name = 'Mountain Summit Experience';

-- Verify the changes
SELECT retreat_name, max_capacity 
FROM retreat_capacity 
ORDER BY retreat_name;

-- Check current booking status
SELECT 
  rc.retreat_name,
  rc.max_capacity,
  COALESCE(SUM(b.participants) FILTER (WHERE b.payment_status = 'completed'), 0) as current_bookings,
  rc.max_capacity - COALESCE(SUM(b.participants) FILTER (WHERE b.payment_status = 'completed'), 0) as available_spots
FROM retreat_capacity rc
LEFT JOIN bookings b ON b.retreat_name = rc.retreat_name
GROUP BY rc.retreat_name, rc.max_capacity
ORDER BY rc.retreat_name;
