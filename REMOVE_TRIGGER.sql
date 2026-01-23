-- Remove the email trigger if it was accidentally created
-- This trigger is causing the "schema net does not exist" error

-- Drop the trigger
DROP TRIGGER IF EXISTS booking_confirmation_email_trigger ON bookings;

-- Drop the function
DROP FUNCTION IF EXISTS send_booking_confirmation_email();

-- That's it! The error should be gone.
-- Emails will be sent from your Node.js server instead.

