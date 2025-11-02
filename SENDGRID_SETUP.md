# 📧 SendGrid Email Setup Guide

## 🎯 What This Does

Automatically sends **two emails** after each successful booking:

1. **Confirmation email** to the customer with booking details
2. **Notification email** to you (admin) about the new booking

---

## 🚀 SendGrid Setup (5 Minutes)

### **Step 1: Create SendGrid Account**

1. Go to: https://sendgrid.com
2. Click **"Start for Free"**
3. Sign up (Free plan includes 100 emails/day - perfect for your needs!)
4. Verify your email address

---

### **Step 2: Verify Your Sender Email**

**Important:** SendGrid requires you to verify your sender email before sending.

1. In SendGrid Dashboard, go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in the form:
   - **From Name:** `Wild Adventure Coach`
   - **From Email:** `wildadventurecoach2233@gmail.com`
   - **Reply To:** `wildadventurecoach2233@gmail.com`
   - **Company:** `Wild Adventure Coach`
   - **Address:** Your address
4. Click **"Create"**
5. **Check your email** (wildadventurecoach2233@gmail.com)
6. Click the verification link

---

### **Step 3: Create API Key**

1. Go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name it: `wild-adventure-booking-emails`
4. Permissions: **Full Access** (or at least "Mail Send")
5. Click **"Create & View"**
6. **Copy the API key** (starts with `SG.`)
   - ⚠️ **Important:** Save it now - you can't see it again!

---

### **Step 4: Add to Your .env File**

Add these lines to your `.env` file:

```env
SENDGRID_API_KEY=SG.your_api_key_here
FROM_EMAIL=wildadventurecoach2233@gmail.com
```

---

### **Step 5: Add to Render Environment Variables**

For production (when you deploy your backend):

1. Go to **Render Dashboard** → Your backend service
2. **Environment** tab
3. Add these variables:
   - `SENDGRID_API_KEY` = `SG.your_api_key_here`
   - `FROM_EMAIL` = `wildadventurecoach2233@gmail.com`

---

### **Step 6: Restart Your Server**

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run server
```

---

## 🧪 Test the Email System

### **Step 1: Make a Test Booking**

1. Go to: http://localhost:3000/booking
2. Fill in the form
3. Use your **real email** (so you can see the confirmation)
4. Complete payment with test card: `4242 4242 4242 4242`

### **Step 2: Check Your Emails**

You should receive **TWO emails**:

1. **To customer's email:**
   - Subject: "✅ Booking Confirmed - Hiking and Yoga Retreat - August"
   - Beautiful HTML email with all booking details
   
2. **To admin (wildadventurecoach2233@gmail.com):**
   - Subject: "🎉 New Booking: [Name] - Hiking and Yoga Retreat - August"
   - Admin notification with all guest details

### **Step 3: Check Server Logs**

You should see:
```
✅ Booking saved to Supabase
📧 Confirmation email sent to customer@email.com
📧 Admin notification sent to wildadventurecoach2233@gmail.com
```

---

## 📧 What the Emails Include

### **Customer Confirmation Email:**

✅ Professional header with Wild Adventure Coach branding  
✅ Personalized greeting  
✅ Complete booking details:
  - Retreat name
  - Personal information
  - Hiking experience details
  - Amount paid
  - Booking date
✅ "What's Next" timeline  
✅ Contact information (WhatsApp, Instagram, Email)  
✅ Beautifully formatted HTML  

### **Admin Notification Email:**

✅ Alert about new booking  
✅ Complete guest information  
✅ Payment amount  
✅ Stripe session ID  
✅ Action items checklist  

---

## 🔍 Troubleshooting

### **No emails being sent?**

**Check 1:** Is SendGrid API key in your `.env`?
```bash
cat .env | grep SENDGRID
```

**Check 2:** Did you verify your sender email in SendGrid?

**Check 3:** Check server logs for email errors

**Check 4:** Check SendGrid Dashboard → Activity Feed

### **Emails going to spam?**

1. Set up **Domain Authentication** in SendGrid (Settings → Sender Authentication)
2. Use a custom domain instead of Gmail
3. This is optional but recommended for production

### **Error: "SendGrid API error: 403"**

- Your sender email isn't verified
- Go to SendGrid → Settings → Sender Authentication
- Verify your email

---

## 💰 SendGrid Free Tier

- ✅ **100 emails/day** for FREE
- ✅ Perfect for your booking volume
- ✅ No credit card required
- ✅ Reliable delivery

If you need more:
- **Essentials Plan:** $19.95/month for 50,000 emails

---

## 🎯 Summary

**What I created:**
- ✅ `server/sendEmail.js` - Email sending functions
- ✅ `supabase/functions/send-booking-confirmation/index.ts` - Edge Function (optional)
- ✅ `supabase-email-trigger.sql` - Database trigger (optional)
- ✅ Updated `server/index.js` to send emails after bookings

**What you need to do:**
1. Create SendGrid account
2. Verify sender email
3. Create API key
4. Add to `.env` file
5. Restart server
6. Test with a booking!

---

## 📚 Additional Resources

- **SendGrid Dashboard:** https://app.sendgrid.com
- **SendGrid Docs:** https://docs.sendgrid.com
- **API Key Creation:** https://app.sendgrid.com/settings/api_keys
- **Sender Verification:** https://app.sendgrid.com/settings/sender_auth

---

**Follow the steps above and you'll have automated booking confirmation emails!** 📧✨

