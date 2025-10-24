-- Fix: Supabase Schema Cache Issue
-- The columns exist but Supabase API doesn't know about them yet

-- Step 1: Verify columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings'
ORDER BY ordinal_position;

-- Step 2: Reload the schema cache
-- This forces Supabase to recognize the new columns
NOTIFY pgrst, 'reload schema';

-- Alternative: You can also do this from the Supabase Dashboard
-- Go to: Settings → API → Click "Reload schema"

