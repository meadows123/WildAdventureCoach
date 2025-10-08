import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Define retreat prices (in cents)
const retreatPrices = {
  'Mountain Summit Experience': 149900, // $1,499.00
  'Coastal Wilderness Retreat': 129900, // $1,299.00
  'Desert Soul Journey': 169900,        // $1,699.00
  'Forest Immersion Retreat': 99900     // $999.00
};

// Create Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  const { retreat, participants, email, firstName, lastName, phone, specialRequests } = req.body;
  
  if (!retreat || !participants || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const pricePerPerson = retreatPrices[retreat];
  
  if (!pricePerPerson) {
    return res.status(400).json({ error: 'Invalid retreat selection' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: retreat,
              description: `Transformative adventure retreat for ${participants} participant(s)`,
              images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4'],
            },
            unit_amount: pricePerPerson,
          },
          quantity: parseInt(participants),
        },
      ],
      metadata: {
        retreat,
        participants,
        firstName,
        lastName,
        phone: phone || '',
        specialRequests: specialRequests || ''
      },
      success_url: `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/booking?canceled=true`,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Retrieve session details (for success page)
app.get('/checkout-session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json(session);
  } catch (error) {
    console.error('Stripe error:', error);
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
    // In production, you would send an email here to: wildadventurecoach2233@gmail.com
    
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
    return res.status(400).send('Webhook secret not configured');
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
      // Here you can:
      // - Send confirmation emails
      // - Save booking to database
      // - Update inventory
      break;
    case 'payment_intent.payment_failed':
      console.log('❌ Payment failed:', event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

const PORT = process.env.PORT || 4242;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Endpoint: http://localhost:${PORT}`);
});

