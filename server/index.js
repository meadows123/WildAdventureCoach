import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { addBooking, getAvailableSpots, getRetreatStats } from './supabase.js';
import { sendBookingConfirmationEmail, sendAdminNotification, sendContactEmail } from './sendEmail.js';

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
  'Hiking and Yoga Retreat - August': 125000, // £1,250.00 (125000 pence)
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
  'Hiking and Yoga Retreat - August': 37500, // £375.00 (37500 pence)
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
  const { retreat, accommodationType, email, firstName, lastName, gender, age, beenHiking, hikingExperience } = req.body;
  
  // Build the full retreat key with accommodation if provided (and not empty string)
  const retreatKey = (accommodationType && accommodationType.trim() !== '') ? `${retreat} - ${accommodationType}` : retreat;
  
  // Check required fields
  if (!retreat || !email || !firstName || !lastName || !gender || !age || !beenHiking || !hikingExperience) {
    console.log('❌ Missing required fields:', { retreat, email, firstName, lastName, gender, age, beenHiking, hikingExperience });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // For Chamonix retreat, check if accommodation is required
  if (retreat === 'Hiking & Yoga Retreat Chamonix' && (!accommodationType || accommodationType.trim() === '')) {
    console.log('❌ Chamonix retreat requires accommodation selection');
    return res.status(400).json({ error: 'Please select an accommodation option' });
  }

  const depositAmount = retreatDeposits[retreatKey] || retreatDeposits[retreat];
  const fullPriceAmount = retreatPrices[retreatKey] || retreatPrices[retreat];
  
  console.log('💰 Pricing lookup:', { retreat, retreatKey, depositAmount, fullPriceAmount });
  
  if (!depositAmount || !fullPriceAmount) {
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
            description: accommodationType 
              ? `Deposit for ${retreat} - ${accommodationType} - Balance of £${(fullPriceAmount - depositAmount) / 100} due closer to retreat date`
              : `Deposit for ${retreat} - Balance of £${(fullPriceAmount - depositAmount) / 100} due closer to retreat date`,
            images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4'],
          },
          unit_amount: depositAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        retreat,
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
    console.log('📊 Fetching capacity for:', req.params.retreatName);
    const stats = await getRetreatStats(req.params.retreatName);
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

