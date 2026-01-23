-- URGENT: Fix Supabase Database Schema
-- Run this in Supabase SQL Editor NOW to fix the booking errors

-- Step 1: Check what columns currently exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings'
ORDER BY ordinal_position;

-- Step 2: Add missing columns (if they don't exist)
-- Run each ALTER TABLE command one by one

-- Add been_hiking column (replaces wake_up_time)
DO $$ 
BEGIN
  -- Try to rename wake_up_time to been_hiking
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'wake_up_time'
  ) THEN
    ALTER TABLE bookings RENAME COLUMN wake_up_time TO been_hiking;
    RAISE NOTICE 'Renamed wake_up_time to been_hiking';
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'been_hiking'
  ) THEN
    ALTER TABLE bookings ADD COLUMN been_hiking TEXT;
    RAISE NOTICE 'Added been_hiking column';
  END IF;
END $$;

-- Add gender column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'gender'
  ) THEN
    ALTER TABLE bookings ADD COLUMN gender TEXT;
    RAISE NOTICE 'Added gender column';
  END IF;
END $$;

-- Add age column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'age'
  ) THEN
    ALTER TABLE bookings ADD COLUMN age INTEGER;
    RAISE NOTICE 'Added age column';
  END IF;
END $$;

-- Add hiking_experience column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'hiking_experience'
  ) THEN
    ALTER TABLE bookings ADD COLUMN hiking_experience TEXT;
    RAISE NOTICE 'Added hiking_experience column';
  END IF;
END $$;

-- Remove old columns that are no longer used (if they exist)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'phone'
  ) THEN
    ALTER TABLE bookings DROP COLUMN phone;
    RAISE NOTICE 'Dropped phone column';
  END IF;
END $$;

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'special_requests'
  ) THEN
    ALTER TABLE bookings DROP COLUMN special_requests;
    RAISE NOTICE 'Dropped special_requests column';
  END IF;
END $$;

-- Step 3: Verify the final schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'bookings'
ORDER BY ordinal_position;

-- Step 4: Make sure retreat capacity is set
INSERT INTO retreat_capacity (retreat_name, max_capacity)
VALUES ('Hiking and Yoga Retreat - August', 10)
ON CONFLICT (retreat_name) DO NOTHING;

-- Done! Your database schema is now correct.

