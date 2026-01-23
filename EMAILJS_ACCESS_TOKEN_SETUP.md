# EmailJS Access Token Setup (Required for Server-Side)

## The Problem

EmailJS blocks server-side API calls by default with error:
```
API calls are disabled for non-browser applications
```

## The Solution

You need **TWO things**:
1. **Enable API access** in EmailJS Account Security settings
2. **Access Token** (private key) for authentication

---

## Step 1: Enable API Access (CRITICAL!)

**This must be done first!**

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Click on **Account** → **Security**
3. Find **"API requests"** or **"Enable API for non-browser applications"**
4. **Enable** this setting (toggle it ON)
5. Save the changes

**Without this step, you'll still get 403 errors even with the access token!**

## Step 2: Get Your Access Token

1. Still in EmailJS Dashboard
2. Go to **Account** → **General**
3. Scroll down to **"API Keys"** section
4. Find **"Private Key"** or **"Access Token"**
5. Click **"Generate"** or **"Reveal"** (if you already have one)
6. **Copy the access token** (it's a long string, keep it secret!)

---

## Add to Render Environment Variables

1. Go to **Render Dashboard** → Your service → **Environment**
2. Add new variable:
   - **Key:** `EMAILJS_ACCESS_TOKEN`
   - **Value:** Your access token from step 5 above
3. Click **"Save, rebuild, and deploy"**

---

## Required EmailJS Variables

For EmailJS to work server-side, you need **all** of these:

| Variable | Where to Find |
|----------|---------------|
| `EMAILJS_USER_ID` | Dashboard → Account → General → **Public Key** |
| `EMAILJS_ACCESS_TOKEN` | Dashboard → Account → General → **Private Key** (Access Token) |
| `EMAILJS_SERVICE_ID` | Optional - defaults to `service_1c8sjrs` |
| `EMAILJS_TEMPLATE_ID_BOOKING` | Optional - defaults to `template_hdnnpuh` |
| `EMAILJS_TEMPLATE_ID_ADMIN` | Optional - defaults to `template_ml0v13r` |

---

## After Adding Access Token

1. **Redeploy** your Render service
2. Check logs - you should see:
   ```
   📧 Email: Using EmailJS (service_1c8sjrs) for booking confirmation & retreat-owner notification
   ```
3. Test a booking - emails should send successfully!

---

## Alternative: Use SendGrid

If you don't want to use EmailJS access tokens, you can use **SendGrid** instead (which is already configured in your codebase). Just ensure `SENDGRID_API_KEY` is set in Render.
