import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { addBooking, getAvailableSpots, generateBookingReference, saveLead } from './supabase.js';
import { sendBookingConfirmationEmail, sendAdminNotification, sendContactEmail } from './sendEmail.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure CORS to allow requests from frontend
// In development, allow common localhost ports
const allowedOrigins = process.env.CLIENT_URL 
  ? [
      process.env.CLIENT_URL,
      'https://www.wildadventurecoach.com',
      'https://wildadventurecoach.com',
      'https://wildadventurecoach.onrender.com'
    ]
  : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    if (allowedOrigins.some(allowed => origin === allowed || origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      // Log the blocked origin for debugging
      console.log('🚫 CORS blocked origin:', origin);
      console.log('✅ Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Define retreat prices (in pence for GBP)
const retreatPrices = {
  'Hiking and Yoga Retreat - August': 149900, // £1,499.00 (149900 pence)
  'Hiking and Yoga Retreat - July': 125000, // £1,250.00 (125000 pence)
  'Hiking and Yoga Retreat - July - Standard Accommodation': 125000, // £1,250.00
  'Hiking and Yoga Retreat - July - Premium Quarters': 143000, // £1,430.00 (143000 pence)
  'Hiking & Yoga Retreat Chamonix': 125000, // £1,250.00 (125000 pence) - default/fallback
  'Hiking & Yoga Retreat Chamonix - Basic Single': 125000, // £1,250.00 (125000 pence)
  'Hiking & Yoga Retreat Chamonix - Economy Single': 145000, // £1,450.00 (145000 pence)
  'Hiking & Yoga Retreat Chamonix - Double': 170000 // £1,700.00 (170000 pence)
};

// Define retreat deposit prices (in pence for GBP)
const retreatDeposits = {
  'Hiking and Yoga Retreat - August': 25000, // £250.00 (25000 pence)
  'Hiking and Yoga Retreat - July': 37500, // £375.00 (37500 pence)
  'Hiking and Yoga Retreat - July - Standard Accommodation': 37500, // £375.00
  'Hiking and Yoga Retreat - July - Premium Quarters': 37500, // £375.00
  'Hiking & Yoga Retreat Chamonix': 25000, // £250.00 (25000 pence) - default/fallback
  'Hiking & Yoga Retreat Chamonix - Basic Single': 25000, // £250.00 (25000 pence)
  'Hiking & Yoga Retreat Chamonix - Economy Single': 25000, // £250.00 (25000 pence)
  'Hiking & Yoga Retreat Chamonix - Double': 25000 // £250.00 (25000 pence)
};

// Create a booking that will be paid by bank transfer
app.post('/create-booking', async (req, res) => {
  console.log('📝 Creating booking for:', req.body.email);
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  const { retreat, accommodationType, email, firstName, lastName, gender, age, beenHiking, hikingExperience } = req.body;

  // Check required fields - treat empty strings as missing
  const hasRetreat = retreat && retreat.trim() !== '';
  const hasEmail = email && email.trim() !== '';
  const hasFirstName = firstName && firstName.trim() !== '';
  const hasLastName = lastName && lastName.trim() !== '';
  const hasGender = gender && gender.trim() !== '';
  const hasAge = age && String(age).trim() !== '';
  const hasBeenHiking = beenHiking && String(beenHiking).trim() !== '';
  const hasHikingExperience = hikingExperience && hikingExperience.trim() !== '';
  
  if (!hasRetreat || !hasEmail || !hasFirstName || !hasLastName || !hasGender || !hasAge || !hasBeenHiking || !hasHikingExperience) {
    console.log('❌ Missing required fields:', { 
      retreat: hasRetreat, 
      email: hasEmail, 
      firstName: hasFirstName, 
      lastName: hasLastName, 
      gender: hasGender, 
      age: hasAge, 
      beenHiking: hasBeenHiking, 
      hikingExperience: hasHikingExperience,
      receivedValues: { retreat, email, firstName, lastName, gender, age, beenHiking, hikingExperience }
    });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // For Chamonix retreat, check if accommodation is required
  if (retreat === 'Hiking & Yoga Retreat Chamonix' && (!accommodationType || accommodationType.trim() === '')) {
    console.log('❌ Chamonix retreat requires accommodation selection');
    return res.status(400).json({ error: 'Please select an accommodation option' });
  }

  // Map display names to database pricing keys
  const retreatPricingMapping = {
    'Hiking & Yoga Retreat - Tour du Mont Blanc': 'Hiking and Yoga Retreat - August',
    'Hiking and Yoga Retreat - August': 'Hiking and Yoga Retreat - August',
    'Hiking and Yoga Retreat in Chamonix': 'Hiking & Yoga Retreat Chamonix',
    'Hiking & Yoga Retreat Chamonix': 'Hiking & Yoga Retreat Chamonix'
  };
  
  // Get the pricing key (database name for pricing lookup)
  const pricingRetreatName = retreatPricingMapping[retreat] || retreat;
  const pricingRetreatKey = (accommodationType && accommodationType.trim() !== '') 
    ? `${pricingRetreatName} - ${accommodationType}` 
    : pricingRetreatName;
  
  const depositAmount = retreatDeposits[pricingRetreatKey] || retreatDeposits[pricingRetreatName];
  const fullPriceAmount = retreatPrices[pricingRetreatKey] || retreatPrices[pricingRetreatName];
  
  console.log('💰 Pricing lookup:', { 
    retreat, 
    pricingRetreatName, 
    pricingRetreatKey, 
    depositAmount, 
    fullPriceAmount 
  });
  
  if (!depositAmount || !fullPriceAmount) {
    console.log('❌ Invalid pricing:', { retreat, pricingRetreatName, pricingRetreatKey, depositAmount, fullPriceAmount });
    return res.status(400).json({ error: 'Invalid retreat selection' });
  }

  // CHECK CAPACITY BEFORE ALLOWING BOOKING (single person booking)
  try {
    console.log('🔍 Checking capacity for retreat:', retreat);
    const availableSpots = await getAvailableSpots(retreat);
    console.log('📊 Available spots:', availableSpots);

    if (availableSpots < 1) {
      console.log('❌ Retreat is sold out');
      return res.status(400).json({
        error: 'Sorry, this retreat is sold out!'
      });
    }
  } catch (capacityError) {
    console.error('❌ Capacity check error:', capacityError);
    // Continue anyway if capacity check fails (better to allow booking than block)
  }

  // Booking reference the guest quotes on their bank transfer, so it can be matched to this booking
  const bookingReference = await generateBookingReference(firstName, lastName);

  try {
    const bookingData = {
      stripe_session_id: bookingReference,
      retreat_name: pricingRetreatName,
      first_name: firstName,
      last_name: lastName,
      email,
      gender,
      age: parseInt(age),
      been_hiking: beenHiking,
      hiking_experience: hikingExperience,
      accommodation_type: accommodationType || null,
      participants: 1,
      amount_paid: depositAmount,
      payment_status: 'pending_transfer'
    };

    const savedBooking = await addBooking(bookingData);
    console.log('✅ Booking saved to Supabase:', bookingReference);

    try {
      console.log('📧 Attempting to send confirmation email to:', savedBooking.email);
      const emailResult = await sendBookingConfirmationEmail(savedBooking);
      if (emailResult.success) {
        console.log('✅ Confirmation email sent successfully');
      } else {
        console.error('❌ Failed to send confirmation email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('❌ Error sending confirmation email:', emailError);
    }

    try {
      console.log('📧 Attempting to send retreat-owner notification');
      const ownerEmailResult = await sendAdminNotification(savedBooking);
      if (ownerEmailResult.success) {
        console.log('✅ Retreat-owner notification sent successfully');
      } else {
        console.error('❌ Failed to send retreat-owner notification:', ownerEmailResult.error);
      }
    } catch (ownerEmailError) {
      console.error('❌ Error sending retreat-owner notification:', ownerEmailError);
    }

    res.json({ success: true, booking: savedBooking });
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    res.status(500).json({ error: error.message || 'Failed to create booking' });
  }
});

const LAKE_DISTRICT_RETREAT_NAME = 'Lake District Retreat';
const LAKE_DISTRICT_DEPOSIT = 5000; // £50.00 in pence

// Register for the Lake District retreat (holds a spot; deposit is collected later by bank transfer)
app.post('/register-lake-district', async (req, res) => {
  console.log('📝 Creating Lake District registration for:', req.body.email);
  const { firstName, lastName, email, phone, gender, age, room, dietary, hikingExperience, medical } = req.body;

  if (!firstName || !firstName.trim() || !lastName || !lastName.trim() || !email || !email.trim() ||
      !phone || !phone.trim() || !gender || !String(gender).trim() || !age || !String(age).trim() ||
      !room || !room.trim()) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const availableSpots = await getAvailableSpots(LAKE_DISTRICT_RETREAT_NAME);
    console.log('📊 Lake District available spots:', availableSpots);
    if (availableSpots < 1) {
      return res.status(400).json({ error: 'Sorry, this retreat is sold out!' });
    }
  } catch (capacityError) {
    console.error('❌ Capacity check error:', capacityError);
    // Continue anyway if capacity check fails (better to allow registration than block)
  }

  const bookingReference = await generateBookingReference(firstName, lastName);

  try {
    const savedBooking = await addBooking({
      stripe_session_id: bookingReference,
      retreat_name: LAKE_DISTRICT_RETREAT_NAME,
      first_name: firstName,
      last_name: lastName,
      email,
      gender,
      age: parseInt(age),
      been_hiking: null,
      hiking_experience: hikingExperience || null,
      accommodation_type: room,
      participants: 1,
      amount_paid: LAKE_DISTRICT_DEPOSIT,
      payment_status: 'pending_transfer'
    });
    console.log('✅ Lake District registration saved to Supabase:', bookingReference);

    try {
      console.log('📧 Attempting to send confirmation email to:', savedBooking.email);
      const emailResult = await sendBookingConfirmationEmail(savedBooking);
      if (emailResult.success) {
        console.log('✅ Lake District confirmation email sent successfully');
      } else {
        console.error('❌ Failed to send Lake District confirmation email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('❌ Error sending Lake District confirmation email:', emailError);
    }

    try {
      // Fold the fields this form collects (that the booking record has no columns for)
      // into hiking_experience so they still reach the owner via the admin template.
      const extraDetails = [
        `Phone: ${phone}`,
        `Dietary: ${dietary || 'None provided'}`,
        `Medical: ${medical || 'None provided'}`
      ].join(' | ');

      const ownerEmailResult = await sendAdminNotification({
        ...savedBooking,
        hiking_experience: [savedBooking.hiking_experience, extraDetails].filter(Boolean).join(' — ')
      });
      if (ownerEmailResult.success) {
        console.log('✅ Lake District retreat-owner notification sent successfully');
      } else {
        console.error('❌ Failed to send Lake District retreat-owner notification:', ownerEmailResult.error);
      }
    } catch (emailError) {
      console.error('❌ Error sending Lake District retreat-owner notification:', emailError);
    }

    res.json({ success: true, booking: savedBooking });
  } catch (error) {
    console.error('❌ Error creating Lake District registration:', error);
    res.status(500).json({ error: error.message || 'Failed to register' });
  }
});

// Get retreat capacity and available spots
app.get('/retreat-capacity/:retreatName', async (req, res) => {
  try {
    console.log('📊 Fetching capacity for:', req.params.retreatName);
    // Import fresh to avoid module caching
    const supabaseModule = await import('./supabase.js?' + Date.now());
    const stats = await supabaseModule.getRetreatStats(req.params.retreatName);
    console.log('📊 Stats returned:', stats);
    res.json(stats);
  } catch (error) {
    console.error('❌ Error fetching capacity:', error);
    res.status(500).json({ error: error.message });
  }
});

// Waitlist endpoint
app.post('/waitlist', async (req, res) => {
  const { email, retreat } = req.body;
  
  if (!email || !retreat) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Here you would typically save to a database
    // For now, just log it and return success
    console.log('✅ Waitlist signup:', { email, retreat, timestamp: new Date().toISOString() });
    
    // TODO: Save to waitlist table in Supabase
    // You could create a 'waitlist' table with columns: email, retreat_name, created_at
    
    res.json({ success: true, message: 'Successfully joined waitlist' });
  } catch (error) {
    console.error('❌ Error joining waitlist:', error);
    res.status(500).json({ error: error.message });
  }
});

// Contact form endpoint
app.post('/send-contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Log the contact form submission
    console.log('📧 New Contact Form Submission:');
    console.log('─────────────────────────────────');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    console.log('Timestamp:', new Date().toLocaleString());
    console.log('─────────────────────────────────\n');

    // Send email to wildadventurecoach@gmail.com
    const emailResult = await sendContactEmail({ name, email, message });
    
    if (!emailResult.success) {
      console.error('❌ Failed to send contact email:', emailResult.error);
      // Still return success to user, but log the error
    }
    
    res.json({ 
      success: true, 
      message: 'Thank you for contacting us! We\'ll get back to you soon.' 
    });
  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({ error: 'Failed to process contact form' });
  }
});

// Register interest endpoint — saves lead to Supabase and notifies owner by email
app.post('/register-interest', async (req, res) => {
  const { email, interest = '2027 Spring & Summer', source = 'retreats-page' } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    // Save to Supabase leads table
    await saveLead({ email: email.trim().toLowerCase(), interest, source });
    console.log('✅ Lead saved:', { email: email.trim(), interest, source });

    // Notify owner by reusing the contact email helper
    try {
      await sendContactEmail({
        name: 'New 2027 Interest Lead',
        email: email.trim(),
        message: `A visitor registered interest in: ${interest}\n\nSource: ${source}\nTimestamp: ${new Date().toLocaleString()}`,
      });
    } catch (emailErr) {
      console.error('⚠️  Lead saved but owner notification failed:', emailErr);
      // Non-fatal — lead is already stored in the database
    }

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error registering interest:', error);
    res.status(500).json({ error: 'Failed to register interest. Please try again.' });
  }
});

// Serve static files from the React app build directory
const buildPath = path.join(__dirname, '..', 'build');

// Add error handling middleware for static files
app.use(express.static(buildPath, {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : 0, // Cache in production, no cache in dev
  etag: true,
  setHeaders: (res, filePath) => {
    // Add cache control headers
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// Catch-all handler: send back React's index.html for any request that doesn't match an API route
// Note: Express 5.x requires regex pattern for catch-all routes
app.get(/.*/, (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/') ||
      req.path.startsWith('/create-booking') ||
      req.path.startsWith('/register-lake-district') ||
      req.path.startsWith('/retreat-capacity') ||
      req.path.startsWith('/send-contact') ||
      req.path.startsWith('/register-interest') ||
      req.path.startsWith('/waitlist')) {
    return next();
  }
  
  // For all other routes, serve index.html (SPA routing)
  const indexPath = path.join(buildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('❌ Error serving index.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

const PORT = process.env.PORT || 4242;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Endpoint: http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving static files from: ${buildPath}`);
  console.log(`🔑 Environment check:`);
  console.log(`   - CLIENT_URL: ${process.env.CLIENT_URL || '❌ Missing'}`);
  console.log(`   - SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   - SUPABASE_SERVICE_KEY: ${process.env.SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing'}`);
});

