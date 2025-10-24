import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { addBooking, getAvailableSpots, getRetreatStats } from './supabase.js';
import { sendBookingConfirmationEmail, sendAdminNotification } from './sendEmail.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Configure CORS to allow requests from frontend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Define retreat prices (in pence for GBP)
const retreatPrices = {
  'Hiking and Yoga Retreat - August': 125000 // £1,250.00 (125000 pence)
};

// Define retreat currencies
const retreatCurrencies = {
  'Hiking and Yoga Retreat - August': 'gbp'
};

// Create Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  console.log('💳 Creating checkout session for:', req.body.email);
  const { retreat, email, firstName, lastName, gender, age, beenHiking, hikingExperience } = req.body;
  
  if (!retreat || !email || !firstName || !lastName || !gender || !age || !beenHiking || !hikingExperience) {
    console.log('❌ Missing required fields:', { retreat, email, firstName, lastName, gender, age, beenHiking, hikingExperience });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const pricePerPerson = retreatPrices[retreat];
  
  if (!pricePerPerson) {
    return res.status(400).json({ error: 'Invalid retreat selection' });
  }

  // CHECK CAPACITY BEFORE ALLOWING BOOKING (single person booking)
  try {
    const availableSpots = await getAvailableSpots(retreat);
    
    if (availableSpots < 1) {
      return res.status(400).json({ 
        error: 'Sorry, this retreat is sold out!'
      });
    }
  } catch (capacityError) {
    console.error('Capacity check error:', capacityError);
    // Continue anyway if capacity check fails (better to allow booking than block)
  }

  try {
    const currency = retreatCurrencies[retreat] || 'usd';
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
              description: `Transformative adventure retreat - Single booking`,
              images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4'],
            },
            unit_amount: pricePerPerson,
          },
          quantity: 1,
        },
      ],
      metadata: {
        retreat,
        firstName,
        lastName,
        gender,
        age,
        beenHiking,
        hikingExperience
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
          participants: 1,
          amount_paid: session.amount_total,
          payment_status: 'completed'
        };
        
        const savedBooking = await addBooking(bookingData);
        console.log('✅ Booking saved via success page (backup method)');
        console.log(`📊 Spot booked for ${bookingData.retreat_name}: ${bookingData.first_name} ${bookingData.last_name}`);
        
        // Send confirmation email to customer
        await sendBookingConfirmationEmail(savedBooking);
        
        // Send notification email to admin
        await sendAdminNotification(savedBooking);
      } catch (dbError) {
        // Might already exist from webhook - that's okay
        if (dbError.code !== '23505') { // Not a duplicate key error
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
    const stats = await getRetreatStats(req.params.retreatName);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching capacity:', error);
    res.status(500).json({ error: error.message });
  }
});

// Contact form endpoint
app.post('/send-contact', async (req, res) => {
  const { name, email, phone, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Log the contact form submission
    console.log('📧 New Contact Form Submission:');
    console.log('─────────────────────────────────');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone || 'Not provided');
    console.log('Message:', message);
    console.log('Timestamp:', new Date().toLocaleString());
    console.log('─────────────────────────────────\n');

    // TODO: Set up email sending with nodemailer
    // For now, we're logging to console
    // In production, you would send an email here to: wildadventurecoach@gmail.com
    
    res.json({ 
      success: true, 
      message: 'Contact form received. Currently logging to console. Configure email service to send emails.' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to process contact form' });
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
          participants: 1, // Single person booking
          amount_paid: session.amount_total,
          payment_status: 'completed'
        };
        
        const savedBooking = await addBooking(bookingData);
        console.log('✅ Booking saved to Supabase');
        console.log(`📊 Spot booked for ${bookingData.retreat_name}: ${bookingData.first_name} ${bookingData.last_name}`);
        
        // Send confirmation email to customer
        await sendBookingConfirmationEmail(savedBooking);
        
        // Send notification email to admin
        await sendAdminNotification(savedBooking);
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
app.use(express.static(buildPath));

// Catch-all handler: send back React's index.html for any request that doesn't match an API route
// Note: Express 5.x requires regex pattern for catch-all routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
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

