# 🎯 Stripe Payment Integration Guide

## ✅ What's Been Configured

Your adventure retreat website now has a **complete Stripe Checkout integration** including:

1. ✅ **Express Backend Server** (`server/index.js`)
   - Handles Stripe payment sessions
   - Secure API endpoint for checkout
   - Webhook support for production

2. ✅ **Updated Booking Flow** (`src/pages/BookingPage.jsx`)
   - 3-step booking form
   - Real-time price calculation
   - Stripe Checkout redirect
   - Loading states and error handling

3. ✅ **Success Page** (`src/pages/BookingSuccessPage.jsx`)
   - Displays booking confirmation
   - Shows payment details
   - Customer information summary

4. ✅ **Environment Setup**
   - `.gitignore` configured
   - Environment variable documentation

## 🚀 Quick Start

### Step 1: Get Your Stripe Keys

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register) (or login)
2. Navigate to **Developers → API Keys**
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Click "Reveal test key" and copy your **Secret key** (starts with `sk_test_`)

### Step 2: Create .env File

Create a `.env` file in the root directory:

```env
# Frontend - Publishable Key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE

# Backend - Secret Key
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE

# Application URLs
CLIENT_URL=http://localhost:3000
PORT=4242
```

**Replace the placeholder keys with your actual Stripe keys!**

### Step 3: Run the Application

You need to run **TWO terminal windows**:

#### Terminal 1 - Frontend
```bash
npm run dev
```
This runs the React app on `http://localhost:3000`

#### Terminal 2 - Backend
```bash
npm run server
```
This runs the Express server on `http://localhost:4242`

### Step 4: Test a Payment

1. Open `http://localhost:3000/booking`
2. Fill out the booking form:
   - Choose a retreat
   - Enter your information
   - Review and confirm
3. Click "Proceed to Payment"
4. You'll be redirected to **Stripe Checkout**
5. Use test card: **4242 4242 4242 4242**
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
6. Complete payment
7. You'll be redirected to the success page!

## 💳 Test Card Numbers

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | ✅ Successful payment |
| `4000 0000 0000 0002` | ❌ Card declined |
| `4000 0025 0000 3155` | 🔐 Requires 3D Secure authentication |
| `4000 0000 0000 9995` | ❌ Insufficient funds |

See more at: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

## 💰 Retreat Pricing

The following prices are configured in the backend:

- **Mountain Summit Experience**: $1,499
- **Coastal Wilderness Retreat**: $1,299
- **Desert Soul Journey**: $1,699
- **Forest Immersion Retreat**: $999

To change prices, edit `server/index.js` line 12-17:

```javascript
const retreatPrices = {
  'Mountain Summit Experience': 149900, // in cents
  // ... etc
};
```

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │────────▶│  Express Server │────────▶│   Stripe API    │
│   (Port 3000)   │         │   (Port 4242)   │         │                 │
│                 │◀────────│                 │◀────────│                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
      User fills                Creates checkout           Processes payment
      booking form              session securely           & returns status
```

## 🔒 Security Features

✅ **API Keys Protected**: Secret key only used on backend
✅ **HTTPS**: Stripe Checkout uses secure connection
✅ **PCI Compliant**: No card data touches your servers
✅ **CORS Enabled**: Only your frontend can access the backend
✅ **Validation**: Server-side validation of all bookings

## 📁 New Files Created

```
wild adventure website/
├── server/
│   └── index.js              # Express backend server
├── src/
│   └── pages/
│       ├── BookingPage.jsx    # Updated with Stripe integration
│       └── BookingSuccessPage.jsx  # New success page
├── .env                       # Your environment variables (create this!)
├── .gitignore                 # Updated to ignore .env
├── ENV_SETUP.md              # Environment setup guide
└── STRIPE_INTEGRATION_GUIDE.md  # This file
```

## 🐛 Troubleshooting

### Error: "Cannot POST /create-checkout-session"
- Make sure the backend server is running (`npm run server`)
- Check that it's running on port 4242

### Error: "No API key provided"
- Check your `.env` file exists
- Verify `STRIPE_SECRET_KEY` is set correctly
- Restart the backend server after creating `.env`

### Payment Redirects to Wrong URL
- Check `CLIENT_URL` in `.env` is set to `http://localhost:3000`
- Verify both servers are running

### "Invalid API Key" Error
- Make sure you're using **test mode** keys (start with `pk_test_` and `sk_test_`)
- Check for extra spaces in your `.env` file
- Verify keys are copied correctly from Stripe dashboard

## 🌐 Production Deployment

When ready for production:

### 1. Switch to Live Keys
- In Stripe dashboard, toggle from "Test mode" to "Live mode"
- Get your **live keys** (start with `pk_live_` and `sk_live_`)
- Update production environment variables

### 2. Set Up Webhooks
- Go to Stripe Dashboard → Developers → Webhooks
- Add endpoint: `https://your-api.com/webhook`
- Select events: `checkout.session.completed`, `payment_intent.payment_failed`
- Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 3. Update URLs
- Change `CLIENT_URL` to your production domain
- Update success/cancel URLs in `server/index.js`

### 4. Deploy
- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **Backend**: Railway, Render, or Vercel Functions

## 📚 Next Steps

- [ ] Customize retreat prices
- [ ] Add database to store bookings
- [ ] Set up email confirmations
- [ ] Configure production webhooks
- [ ] Add refund/cancellation functionality
- [ ] Implement promo codes/discounts

## 🆘 Need Help?

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Checkout Guide](https://stripe.com/docs/payments/checkout)

---

**🎉 You're all set!** Start testing payments and watch your adventure retreat business come to life!

