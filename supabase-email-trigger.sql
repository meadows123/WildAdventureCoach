-- Database Trigger: Send confirmation email when booking is created
-- This automatically calls the Edge Function when a new booking is inserted

-- Create the function that will call the Edge Function
CREATE OR REPLACE FUNCTION send_booking_confirmation_email()
RETURNS TRIGGER AS $$
DECLARE
  booking_json jsonb;
  function_url text;
  service_role_key text;
BEGIN
  -- Only send email for completed payments
  IF NEW.payment_status = 'completed' THEN
    -- Get the Supabase URL and service role key from environment
    -- You'll need to set these as Supabase secrets
    function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-booking-confirmation';
    service_role_key := current_setting('app.settings.service_role_key', true);
    
    -- Prepare booking data as JSON
    booking_json := jsonb_build_object(
      'first_name', NEW.first_name,
      'last_name', NEW.last_name,
      'email', NEW.email,
      'retreat_name', NEW.retreat_name,
      'gender', NEW.gender,
      'age', NEW.age,
      'been_hiking', NEW.been_hiking,
      'hiking_experience', NEW.hiking_experience,
      'amount_paid', NEW.amount_paid,
      'booking_date', NEW.booking_date
    );
    
    -- Call the Edge Function asynchronously using pg_net (Supabase extension)
    PERFORM
      net.http_post(
        url := function_url,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || service_role_key
        ),
        body := booking_json
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS booking_confirmation_email_trigger ON bookings;

CREATE TRIGGER booking_confirmation_email_trigger
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION send_booking_confirmation_email();

-- Note: This requires the pg_net extension to be enabled
-- Run this if not already enabled:
-- CREATE EXTENSION IF NOT EXISTS pg_net;

