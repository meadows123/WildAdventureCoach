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
        accommodation_type: bookingData.accommodation_type,
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
  console.log('🔍 getAvailableSpots called for:', retreatName);
  
  // Map display names to database names for retreat capacity lookup
  // Database has: "Hiking & Yoga Retreat Chamonix" and "Hiking and Yoga Retreat - August"
  const retreatNameMapping = {
    'Hiking and Yoga Retreat in Chamonix': 'Hiking & Yoga Retreat Chamonix',
    'Hiking & Yoga Retreat Chamonix': 'Hiking & Yoga Retreat Chamonix',
    'Hiking and Yoga Retreat - August': 'Hiking and Yoga Retreat - August'
  };
  
  // Get the database name for capacity lookup
  const capacityRetreatName = retreatNameMapping[retreatName] || retreatName;
  
  // Get all possible booking names that could match this retreat
  // Include both the mapped name and all variations that map to the same capacity name
  const bookingRetreatNames = [
    retreatName, // Original name requested
    capacityRetreatName, // Mapped capacity name (database format)
    'Hiking & Yoga Retreat Chamonix', // Database name for June retreat
    'Hiking and Yoga Retreat in Chamonix' // Display name variation
  ].filter((name, index, self) => self.indexOf(name) === index); // Remove duplicates
  
  // Get the retreat capacity
  const { data: retreat, error: retreatError } = await supabase
    .from('retreat_capacity')
    .select('max_capacity')
    .eq('retreat_name', capacityRetreatName)
    .single();

  if (retreatError) {
    console.error('❌ Error fetching retreat capacity:', retreatError);
    console.log('⚠️ Retreat not found in database, defaulting to 9 available spots');
    return 9; // Default to 9 spots if retreat not found
  }
  
  console.log('✅ Retreat found with capacity:', retreat.max_capacity);

  // Get total participants booked (check all possible retreat name variations)
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('participants')
    .in('retreat_name', bookingRetreatNames)
    .eq('payment_status', 'completed');

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError);
    return retreat.max_capacity;
  }

  const totalBooked = bookings.reduce((sum, booking) => sum + booking.participants, 0);
  const availableSpots = retreat.max_capacity - totalBooked;
  console.log('📊 Total booked:', totalBooked, 'Available:', availableSpots, 'Booking names checked:', bookingRetreatNames);
  return availableSpots;
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
  // Map display names to database names for retreat capacity lookup
  // Database has: "Hiking & Yoga Retreat Chamonix" and "Hiking and Yoga Retreat - August"
  const retreatNameMapping = {
    'Hiking and Yoga Retreat in Chamonix': 'Hiking & Yoga Retreat Chamonix',
    'Hiking & Yoga Retreat Chamonix': 'Hiking & Yoga Retreat Chamonix',
    'Hiking and Yoga Retreat - August': 'Hiking and Yoga Retreat - August'
  };
  
  // Get the database name for capacity lookup
  const capacityRetreatName = retreatNameMapping[retreatName] || retreatName;
  
  // Get all possible booking names that could match this retreat
  // Include both the mapped name and all variations that map to the same capacity name
  const bookingRetreatNames = [
    retreatName, // Original name requested
    capacityRetreatName, // Mapped capacity name (database format)
    'Hiking & Yoga Retreat Chamonix', // Database name for June retreat
    'Hiking and Yoga Retreat in Chamonix' // Display name variation
  ].filter((name, index, self) => self.indexOf(name) === index); // Remove duplicates

  const { data: retreat } = await supabase
    .from('retreat_capacity')
    .select('max_capacity')
    .eq('retreat_name', capacityRetreatName)
    .single();

  // Query bookings with all possible retreat name variations
  const { data: bookings } = await supabase
    .from('bookings')
    .select('participants, amount_paid, retreat_name')
    .in('retreat_name', bookingRetreatNames)
    .eq('payment_status', 'completed');

  const totalParticipants = bookings?.reduce((sum, b) => sum + b.participants, 0) || 0;
  const totalRevenue = bookings?.reduce((sum, b) => sum + b.amount_paid, 0) || 0;

  console.log('📊 Capacity lookup:', {
    requestedName: retreatName,
    capacityName: capacityRetreatName,
    bookingNamesChecked: bookingRetreatNames,
    bookingsFound: bookings?.length || 0,
    bookingDetails: bookings?.map(b => ({ name: b.retreat_name, participants: b.participants })),
    totalParticipants,
    availableSpots: (retreat?.max_capacity || 9) - totalParticipants
  });

  return {
    maxCapacity: retreat?.max_capacity || 9,
    currentBookings: totalParticipants,
    availableSpots: (retreat?.max_capacity || 9) - totalParticipants,
    totalBookings: bookings?.length || 0,
    totalRevenue: totalRevenue,
    soldOut: totalParticipants >= (retreat?.max_capacity || 9)
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

