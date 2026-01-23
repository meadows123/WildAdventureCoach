# Stripe Test Mode Keys

## Test Keys (for testing emails and booking flow)

**Secret Key (Backend):**
```
sk_test_51SGbOA2Nj4rQiNYzC380dm76cYKcX5SD2vyIy4oN8pCxRJRlLbeyyD5yeWwj3BNDziWM9GRyBCLE82oYsJMILAUu006hj9JCGu
```

**Public Key (Frontend - not needed for Checkout, but here for reference):**
```
pk_test_51SGbOA2Nj4rQiNYzlxS0f8AtpDhMkH8wbyKl53tAWKq0T4QbQiipeBr7p6yEefKjln0XDsri9PubqwnHMZdaSWOz00DXXTdzUc
```

## How to Switch to Test Mode

1. **Render Dashboard** → Your service → **Environment**
2. Find **`STRIPE_SECRET_KEY`**
3. Update value to the test secret key above
4. **Save, rebuild, and deploy**

## Test Cards

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Any future expiry** (e.g., 12/25)
- **Any 3-digit CVC** (e.g., 123)

## What to Test

1. ✅ Booking confirmation email (EmailJS `template_hdnnpuh`) sent to guest
2. ✅ Retreat-owner notification (EmailJS `template_ml0v13r`) sent to `wildadventurecoach@gmail.com`
3. ✅ Booking saved to Supabase
4. ✅ No real charges (test mode)

## Switch Back to Live

When ready for production, update `STRIPE_SECRET_KEY` in Render to your **live** secret key (starts with `sk_live_...`).
