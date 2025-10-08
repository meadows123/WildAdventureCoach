# Environment Setup Instructions

## Setting up Stripe Integration

### 1. Get Your Stripe API Keys

1. Go to [https://stripe.com](https://stripe.com) and create an account (or login)
2. Navigate to **Developers → API Keys**
3. You'll see two keys in **Test mode**:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - click "Reveal test key"

### 2. Create Your .env File

Create a `.env` file in the root of your project with the following content:

```env
# Frontend - Publishable Key (safe to expose in client-side code)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key

# Backend - Secret Key (keep this secure, NEVER commit to git)
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key

# Webhook Secret (optional, for production webhooks)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Application URLs
CLIENT_URL=http://localhost:3000
PORT=4242
```

**Replace** `pk_test_your_actual_publishable_key` and `sk_test_your_actual_secret_key` with your actual Stripe keys.

### 3. Test Cards for Development

Use these test card numbers in Stripe Checkout (Test Mode):

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any future expiration date, any 3-digit CVC, and any ZIP code.

### 4. Important Security Notes

⚠️ **NEVER** commit your `.env` file to version control (it's already in `.gitignore`)

⚠️ **NEVER** expose your `STRIPE_SECRET_KEY` in frontend code

✅ Only the `VITE_STRIPE_PUBLISHABLE_KEY` can be used in the frontend

✅ All payment processing must happen through your backend server

## Running the Application

### Terminal 1 - Frontend (React + Vite)
```bash
npm run dev
```

### Terminal 2 - Backend (Express + Stripe)
```bash
npm run server
```

The frontend will run on `http://localhost:3000`
The backend will run on `http://localhost:4242`

## Testing Payments

1. Navigate to the booking page
2. Fill out the 3-step form
3. Click "Proceed to Payment"
4. You'll be redirected to Stripe Checkout
5. Use test card: `4242 4242 4242 4242`
6. Complete the payment
7. You'll be redirected back to the success page

## Production Deployment

For production, you'll need to:
1. Switch from test keys to **live keys** in Stripe dashboard
2. Set up proper environment variables on your hosting platform
3. Configure webhooks for real-time event handling
4. Deploy both frontend and backend separately (or use serverless functions)

Recommended hosting:
- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **Backend**: Vercel Functions, Netlify Functions, Railway, or Render

