import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️  Missing Supabase credentials. Please add SUPABASE_URL and SUPABASE_SERVICE_KEY to your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database functions for bookings

/**
 * Add a new booking to the database
 */
export async function addBooking(bookingData) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        stripe_session_id: bookingData.stripe_session_id,
        retreat_name: bookingData.retreat_name,
        first_name: bookingData.first_name,
        last_name: bookingData.last_name,
        email: bookingData.email,
        gender: bookingData.gender,
        age: bookingData.age,
        been_hiking: bookingData.been_hiking,
        hiking_experience: bookingData.hiking_experience,
        participants: bookingData.participants,
        amount_paid: bookingData.amount_paid,
        payment_status: bookingData.payment_status
      }
    ])
    .select();

  if (error) {
    console.error('Error adding booking:', error);
    throw error;
  }

  return data[0];
}

/**
 * Get available spots for a retreat
 */
export async function getAvailableSpots(retreatName) {
  // Get the retreat capacity
  const { data: retreat, error: retreatError } = await supabase
    .from('retreat_capacity')
    .select('max_capacity')
    .eq('retreat_name', retreatName)
    .single();

  if (retreatError) {
    console.error('Error fetching retreat:', retreatError);
    return 0;
  }

  // Get total participants booked
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('participants')
    .eq('retreat_name', retreatName)
    .eq('payment_status', 'completed');

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError);
    return retreat.max_capacity;
  }

  const totalBooked = bookings.reduce((sum, booking) => sum + booking.participants, 0);
  return retreat.max_capacity - totalBooked;
}

/**
 * Get all bookings for a retreat
 */
export async function getRetreatBookings(retreatName) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('retreat_name', retreatName)
    .order('booking_date', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }

  return data;
}

/**
 * Get retreat statistics
 */
export async function getRetreatStats(retreatName) {
  const { data: retreat } = await supabase
    .from('retreat_capacity')
    .select('max_capacity')
    .eq('retreat_name', retreatName)
    .single();

  const { data: bookings } = await supabase
    .from('bookings')
    .select('participants, amount_paid')
    .eq('retreat_name', retreatName)
    .eq('payment_status', 'completed');

  const totalParticipants = bookings?.reduce((sum, b) => sum + b.participants, 0) || 0;
  const totalRevenue = bookings?.reduce((sum, b) => sum + b.amount_paid, 0) || 0;

  return {
    maxCapacity: retreat?.max_capacity || 10,
    currentBookings: totalParticipants,
    availableSpots: (retreat?.max_capacity || 10) - totalParticipants,
    totalBookings: bookings?.length || 0,
    totalRevenue: totalRevenue,
    soldOut: totalParticipants >= (retreat?.max_capacity || 10)
  };
}

/**
 * Check if retreat is sold out
 */
export async function isSoldOut(retreatName) {
  const availableSpots = await getAvailableSpots(retreatName);
  return availableSpots <= 0;
}

export default supabase;

