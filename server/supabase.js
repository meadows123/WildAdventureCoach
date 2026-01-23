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
    'Hiking and Yoga Retreat - August': 'Hiking and Yoga Retreat - August',
    'Hiking & Yoga Retreat - Tour du Mont Blanc': 'Hiking and Yoga Retreat - August'
  };
  
  // Get the database name for capacity lookup
  const capacityRetreatName = retreatNameMapping[retreatName] || retreatName;
  
  // Define name variations for each specific retreat (only include variations for the SAME retreat)
  // IMPORTANT: Each retreat ONLY checks its own exact names, never other retreats
  const retreatNameVariations = {
    'Hiking & Yoga Retreat Chamonix': [
      'Hiking & Yoga Retreat Chamonix'  // Only exact match for Chamonix
    ],
    'Hiking and Yoga Retreat - August': [
      'Hiking and Yoga Retreat - August'  // Only exact match, no variations
    ]
  };
  
  // Get all possible booking names that could match THIS specific retreat only
  // Only include variations that belong to the same retreat, not other retreats
  let bookingRetreatNames = retreatNameVariations[capacityRetreatName];
  
  // If no variations found, use just the capacity name
  if (!bookingRetreatNames || bookingRetreatNames.length === 0) {
    bookingRetreatNames = [capacityRetreatName];
  }
  
  // Remove duplicates
  let uniqueBookingNames = [...new Set(bookingRetreatNames)];
  
  // CRITICAL: Force correct names based on capacityRetreatName - override anything else
  if (capacityRetreatName === 'Hiking & Yoga Retreat Chamonix') {
    // Chamonix should ONLY check Chamonix names - force it
    uniqueBookingNames = ['Hiking & Yoga Retreat Chamonix'];
    console.log('🔒 Forced Chamonix-only query:', uniqueBookingNames);
  } else if (capacityRetreatName === 'Hiking and Yoga Retreat - August') {
    // August should ONLY check August names - force it
    uniqueBookingNames = ['Hiking and Yoga Retreat - August', 'Hiking & Yoga Retreat - Tour du Mont Blanc'];
    console.log('🔒 Forced August-only query:', uniqueBookingNames);
  } else {
    // Unknown retreat - use what we have but log a warning
    console.warn('⚠️ Unknown retreat name:', capacityRetreatName, 'Using:', uniqueBookingNames);
  }
  
  // Final safety check - remove any cross-contamination
  if (capacityRetreatName === 'Hiking and Yoga Retreat - August') {
    uniqueBookingNames = uniqueBookingNames.filter(name => 
      name.includes('August') || name.includes('Tour du Mont Blanc')
    );
    if (uniqueBookingNames.length === 0) {
      uniqueBookingNames = ['Hiking and Yoga Retreat - August', 'Hiking & Yoga Retreat - Tour du Mont Blanc'];
    }
  } else if (capacityRetreatName === 'Hiking & Yoga Retreat Chamonix') {
    uniqueBookingNames = uniqueBookingNames.filter(name => 
      name.includes('Chamonix') && !name.includes('August')
    );
    if (uniqueBookingNames.length === 0) {
      uniqueBookingNames = ['Hiking & Yoga Retreat Chamonix'];
    }
  }
  
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

  // FINAL SAFETY CHECK: Force correct names right before query
  if (capacityRetreatName === 'Hiking and Yoga Retreat - August') {
    // Check ONLY the exact August name, no variations
    uniqueBookingNames = ['Hiking and Yoga Retreat - August'];
    console.log('🔒🔒 FINAL FORCE: August retreat - using ONLY:', uniqueBookingNames);
  } else if (capacityRetreatName === 'Hiking & Yoga Retreat Chamonix') {
    uniqueBookingNames = ['Hiking & Yoga Retreat Chamonix'];
    console.log('🔒🔒 FINAL FORCE: Chamonix retreat - using ONLY:', uniqueBookingNames);
  }

  // Get total participants booked (check all possible retreat name variations for THIS retreat only)
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('participants')
    .in('retreat_name', uniqueBookingNames)
    .eq('payment_status', 'completed');

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError);
    return retreat.max_capacity;
  }

  const totalBooked = bookings.reduce((sum, booking) => sum + booking.participants, 0);
  const availableSpots = retreat.max_capacity - totalBooked;
  console.log('📊 Total booked:', totalBooked, 'Available:', availableSpots, 'Booking names checked:', uniqueBookingNames);
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
 * Get August retreat statistics - ONLY checks August bookings
 */
export async function getAugustRetreatStats() {
  const capacityRetreatName = 'Hiking and Yoga Retreat - August';
  const uniqueBookingNames = ['Hiking and Yoga Retreat - August']; // ONLY August, nothing else
  
  console.log('🔒 August retreat - checking ONLY:', uniqueBookingNames);
  
  const { data: retreat } = await supabase
    .from('retreat_capacity')
    .select('max_capacity')
    .eq('retreat_name', capacityRetreatName)
    .single();

  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('participants, amount_paid, retreat_name, payment_status')
    .in('retreat_name', uniqueBookingNames)
    .eq('payment_status', 'completed');

  if (bookingsError) {
    console.error('❌ Error querying bookings:', bookingsError);
  }

  const totalParticipants = bookings?.reduce((sum, b) => sum + b.participants, 0) || 0;
  const totalRevenue = bookings?.reduce((sum, b) => sum + b.amount_paid, 0) || 0;

  console.log('📊 August Capacity lookup:', {
    bookingNamesChecked: uniqueBookingNames,
    bookingsFound: bookings?.length || 0,
    bookingDetails: bookings?.map(b => ({ name: b.retreat_name, participants: b.participants })),
    totalParticipants,
    maxCapacity: retreat?.max_capacity || 10,
    availableSpots: (retreat?.max_capacity || 10) - totalParticipants
  });

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
 * Get Chamonix retreat statistics - ONLY checks Chamonix bookings
 */
export async function getChamonixRetreatStats() {
  const capacityRetreatName = 'Hiking & Yoga Retreat Chamonix';
  const uniqueBookingNames = ['Hiking & Yoga Retreat Chamonix']; // ONLY Chamonix, nothing else
  
  console.log('🔒 Chamonix retreat - checking ONLY:', uniqueBookingNames);
  
  const { data: retreat } = await supabase
    .from('retreat_capacity')
    .select('max_capacity')
    .eq('retreat_name', capacityRetreatName)
    .single();

  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('participants, amount_paid, retreat_name, payment_status')
    .in('retreat_name', uniqueBookingNames)
    .eq('payment_status', 'completed');

  if (bookingsError) {
    console.error('❌ Error querying bookings:', bookingsError);
  }

  const totalParticipants = bookings?.reduce((sum, b) => sum + b.participants, 0) || 0;
  const totalRevenue = bookings?.reduce((sum, b) => sum + b.amount_paid, 0) || 0;

  console.log('📊 Chamonix Capacity lookup:', {
    bookingNamesChecked: uniqueBookingNames,
    bookingsFound: bookings?.length || 0,
    bookingDetails: bookings?.map(b => ({ name: b.retreat_name, participants: b.participants })),
    totalParticipants,
    maxCapacity: retreat?.max_capacity || 9,
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
 * Get retreat statistics (legacy function - routes to specific functions)
 */
export async function getRetreatStats(retreatName) {
  console.log('🚀🚀🚀 getRetreatStats called with:', retreatName);
  console.log('🚀🚀🚀 NEW CODE VERSION - Using separate functions!');
  
  // Route to specific functions based on retreat name - this ensures complete separation
  const retreatNameMapping = {
    'Hiking and Yoga Retreat in Chamonix': 'chamonix',
    'Hiking & Yoga Retreat Chamonix': 'chamonix',
    'Hiking and Yoga Retreat - August': 'august',
    'Hiking & Yoga Retreat - Tour du Mont Blanc': 'august'
  };
  
  const retreatType = retreatNameMapping[retreatName] || retreatName.toLowerCase();
  console.log('🚀🚀🚀 Retreat type determined:', retreatType);
  
  // Route to the correct dedicated function
  if (retreatType === 'august' || retreatName.includes('August') || retreatName.includes('Tour du Mont Blanc')) {
    console.log('📍📍📍 Routing to August-specific function - NO CHAMONIX NAMES WILL BE CHECKED!');
    return await getAugustRetreatStats();
  } else if (retreatType === 'chamonix' || retreatName.includes('Chamonix')) {
    console.log('📍📍📍 Routing to Chamonix-specific function - NO AUGUST NAMES WILL BE CHECKED!');
    return await getChamonixRetreatStats();
  }
  
  // Fallback for unknown retreats - should not happen, but route to August as default
  console.warn('⚠️ Unknown retreat name, defaulting to August:', retreatName);
  return await getAugustRetreatStats();
}

/**
 * Check if retreat is sold out
 */
export async function isSoldOut(retreatName) {
  const availableSpots = await getAvailableSpots(retreatName);
  return availableSpots <= 0;
}

export default supabase;
