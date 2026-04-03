import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { addBooking, getAvailableSpots, getRetreatStats, supabase, saveLead } from './supabase.js';
import { sendBookingConfirmationEmail, sendAdminNotification, sendContactEmail } from './sendEmail.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

// Define retreat currencies
const retreatCurrencies = {
  'Hiking and Yoga Retreat - August': 'gbp',
  'Hiking and Yoga Retreat - July': 'gbp',
  'Hiking & Yoga Retreat Chamonix': 'gbp'
};

// Create Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  console.log('💳 Creating checkout session for:', req.body.email);
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  console.log('🌐 Request origin:', req.headers.origin);
  console.log('🔑 Stripe key configured:', !!process.env.STRIPE_SECRET_KEY);
  const { retreat, accommodationType, email, firstName, lastName, gender, age, beenHiking, hikingExperience } = req.body;
  
  // Build the full retreat key with accommodation if provided (and not empty string)
  const retreatKey = (accommodationType && accommodationType.trim() !== '') ? `${retreat} - ${accommodationType}` : retreat;
  
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

  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY is not set in environment variables');
    return res.status(500).json({ error: 'Payment system not configured. Please contact support.' });
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

  try {
    const currency = retreatCurrencies[pricingRetreatName] || retreatCurrencies[retreat] || 'usd';
    const transactionFee = 495; // £4.95 in pence
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
            name: retreat,
            description: accommodationType 
              ? `Deposit for ${retreat} - ${accommodationType} - Balance of £${(fullPriceAmount - depositAmount) / 100} due closer to retreat date`
              : `Deposit for ${retreat} - Balance of £${(fullPriceAmount - depositAmount) / 100} due closer to retreat date`,
            images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4'],
          },
          unit_amount: depositAmount,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'Transaction Fee',
              description: 'Payment processing fee',
            },
            unit_amount: transactionFee,
          },
          quantity: 1,
        },
      ],
      metadata: {
        retreat: pricingRetreatName, // Use database name for consistency (saves as "Hiking and Yoga Retreat - August" not "Tour du Mont Blanc")
        originalRetreatName: retreat, // Keep original for display purposes
        accommodationType: accommodationType || '',
        firstName,
        lastName,
        gender,
        age,
        beenHiking,
        hikingExperience,
        fullPrice: fullPriceAmount,
        depositAmount: depositAmount,
        remainingBalance: (fullPriceAmount - depositAmount)
      },
      success_url: `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/booking?canceled=true`,
    });

    console.log('✅ Checkout session created successfully:', session.id);
    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('❌ Stripe checkout session error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Retrieve session details (for success page)
app.get('/checkout-session/:sessionId', async (req, res) => {
  console.log('🔍 Success page requested session:', req.params.sessionId);
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    console.log('✅ Stripe session retrieved successfully:', {
      id: session.id,
      payment_status: session.payment_status,
      customer_email: session.customer_email
    });
    
    // BACKUP: Save booking if webhook hasn't fired yet (for local development)
    if (session.payment_status === 'paid') {
      try {
        const bookingData = {
          stripe_session_id: session.id,
          retreat_name: session.metadata.retreat,
          first_name: session.metadata.firstName,
          last_name: session.metadata.lastName,
          email: session.customer_email,
          gender: session.metadata.gender || null,
          age: parseInt(session.metadata.age),
          been_hiking: session.metadata.beenHiking || null,
          hiking_experience: session.metadata.hikingExperience || null,
          accommodation_type: session.metadata.accommodationType || null,
          participants: 1,
          amount_paid: session.amount_total,
          payment_status: 'completed'
        };
        
        // Check if booking already exists before trying to add
        const { data: existingCheck } = await supabase
          .from('bookings')
          .select('*')
          .eq('stripe_session_id', session.id)
          .single();
        
        const isNewBooking = !existingCheck;
        const savedBooking = await addBooking(bookingData);
        
        if (isNewBooking) {
          console.log('✅ Booking saved via success page (backup method)');
          console.log(`📊 Spot booked for ${bookingData.retreat_name}: ${bookingData.first_name} ${bookingData.last_name}`);
          console.log('📦 Saved booking data:', JSON.stringify(savedBooking, null, 2));
          
          // Send emails only if this is a new booking (webhook didn't fire yet)
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
        } else {
          console.log('ℹ️  Booking already exists (saved by webhook) - emails were already sent');
        }
      } catch (dbError) {
        // Might already exist from webhook - that's okay, just fetch it
        if (dbError.code === '23505') {
          console.log('ℹ️  Booking already exists (likely saved by webhook) - fetching existing booking');
          console.log('🔍 Duplicate error details:', dbError.details || 'No details');
          console.log('🔍 Searching for booking with session_id:', session.id);
          
          try {
            // Try fetching by stripe_session_id first
            let existingBooking = null;
            const { data: bookingBySession, error: sessionError } = await supabase
              .from('bookings')
              .select('*')
              .eq('stripe_session_id', session.id)
              .maybeSingle();
            
            if (bookingBySession) {
              existingBooking = bookingBySession;
              console.log('✅ Found existing booking by stripe_session_id');
            } else {
              // Fallback: try fetching by email + retreat_name + amount (in case session_id differs)
              console.log('🔍 Not found by session_id, trying email + retreat + amount...');
              const { data: bookingByDetails, error: detailsError } = await supabase
                .from('bookings')
                .select('*')
                .eq('email', session.customer_email)
                .eq('retreat_name', session.metadata?.retreat || bookingData.retreat_name)
                .eq('amount_paid', session.amount_total)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();
              
              if (bookingByDetails) {
                existingBooking = bookingByDetails;
                console.log('✅ Found existing booking by email + retreat + amount');
              } else {
                console.log('⚠️  Could not find existing booking by any method');
                if (sessionError) console.log('Session query error:', sessionError);
                if (detailsError) console.log('Details query error:', detailsError);
              }
            }
            
            if (existingBooking) {
              console.log('✅ Found existing booking, checking if emails need to be sent...');
              console.log('📦 Existing booking ID:', existingBooking.id, 'Session ID:', existingBooking.stripe_session_id);
              // Send emails for the existing booking (webhook might have failed to send them)
              try {
                console.log('📧 Attempting to send confirmation email to:', existingBooking.email);
                const emailResult = await sendBookingConfirmationEmail(existingBooking);
                if (emailResult.success) {
                  console.log('✅ Confirmation email sent successfully (existing booking)');
                } else {
                  console.log('ℹ️  Confirmation email result:', emailResult.error);
                }
              } catch (emailErr) {
                console.error('❌ Error sending confirmation email for existing booking:', emailErr);
              }
              
              try {
                console.log('📧 Attempting to send retreat-owner notification (existing booking)');
                const ownerResult = await sendAdminNotification(existingBooking);
                if (ownerResult.success) {
                  console.log('✅ Retreat-owner notification sent successfully (existing booking)');
                } else {
                  console.log('ℹ️  Retreat-owner notification result:', ownerResult.error);
                }
              } catch (ownerErr) {
                console.error('❌ Error sending retreat-owner notification for existing booking:', ownerErr);
              }
            } else {
              console.log('⚠️  Could not find existing booking to send emails - booking may have been created with different details');
            }
          } catch (fetchErr) {
            console.error('❌ Error fetching existing booking:', fetchErr);
          }
        } else {
          console.error('❌ Error saving booking via success page:', dbError);
        }
      }
    }
    
    console.log('📤 Sending session data to frontend');
    res.json(session);
  } catch (error) {
    console.error('❌ Error retrieving Stripe session:', error);
    res.status(500).json({ error: error.message });
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

// Webhook endpoint for Stripe events (optional but recommended for production)
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.log('⚠️ Webhook secret not configured - skipping webhook processing');
    return res.status(200).send('Webhook secret not configured');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('✅ Payment successful:', session.id);
      
      // Save minimal booking info to Supabase
      try {
        const bookingData = {
          stripe_session_id: session.id,
          retreat_name: session.metadata.retreat,
          first_name: session.metadata.firstName,
          last_name: session.metadata.lastName,
          email: session.customer_email,
          gender: session.metadata.gender || null,
          age: parseInt(session.metadata.age),
          been_hiking: session.metadata.beenHiking || null,
          hiking_experience: session.metadata.hikingExperience || null,
          accommodation_type: session.metadata.accommodationType || null,
          participants: 1, // Single person booking
          amount_paid: session.amount_total,
          payment_status: 'completed'
        };
        
        const savedBooking = await addBooking(bookingData);
        console.log('✅ Booking saved to Supabase');
        console.log(`📊 Spot booked for ${bookingData.retreat_name}: ${bookingData.first_name} ${bookingData.last_name}`);
        console.log('📦 Saved booking data:', JSON.stringify(savedBooking, null, 2));
        
        // Send confirmation email to customer
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
        
        // Send retreat-owner notification (who signed up, guest details)
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
      } catch (dbError) {
        console.error('❌ Error saving to database:', dbError);
        // Payment still succeeded, just log the error
      }
      break;
    case 'payment_intent.payment_failed':
      console.log('❌ Payment failed:', event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
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
      req.path.startsWith('/create-checkout-session') ||
      req.path.startsWith('/checkout-session') ||
      req.path.startsWith('/retreat-capacity') ||
      req.path.startsWith('/send-contact') ||
      req.path.startsWith('/register-interest') ||
      req.path.startsWith('/waitlist') ||
      req.path.startsWith('/webhook')) {
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
  console.log(`   - STRIPE_SECRET_KEY: ${process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   - CLIENT_URL: ${process.env.CLIENT_URL || '❌ Missing'}`);
  console.log(`   - SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   - SUPABASE_SERVICE_KEY: ${process.env.SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing'}`);
});

