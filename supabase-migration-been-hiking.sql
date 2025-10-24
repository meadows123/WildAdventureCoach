-- Migration: Rename wake_up_time to been_hiking
-- This updates the booking field to match the new form question

-- Rename the column
ALTER TABLE bookings RENAME COLUMN wake_up_time TO been_hiking;

-- Update the column comment for documentation
COMMENT ON COLUMN bookings.been_hiking IS 'Whether the participant has been hiking before (Yes/No)';

