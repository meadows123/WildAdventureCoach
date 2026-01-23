# ✅ Final Checklist - Get Emails Working

## 🎯 Two Things Must Be Done:

### **1. Database Columns (Supabase)** - CRITICAL ⚠️

**Did you run this SQL in Supabase?**

```sql
ALTER TABLE bookings ADD COLUMN been_hiking TEXT;
ALTER TABLE bookings ADD COLUMN gender TEXT;
ALTER TABLE bookings ADD COLUMN age INTEGER;
ALTER TABLE bookings ADD COLUMN hiking_experience TEXT;
ALTER TABLE bookings ADD COLUMN accommodation_type TEXT;
```

**How to check:**
1. Go to Supabase Dashboard → Table Editor
2. Click on `bookings` table
3. Look at the columns - you should see:
   - ✅ `been_hiking`
   - ✅ `gender`
   - ✅ `age`
   - ✅ `hiking_experience`
   - ✅ `accommodation_type`

**If you don't see these columns, the bookings won't save!**

---

### **2. SendGrid API Key (.env file)**

Your `.env` file should have these lines:

```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=wildadventurecoach2233@gmail.com
```

**Make sure:**
- ✅ No quotes around the values
- ✅ No spaces around the `=` sign
- ✅ API key starts with `SG.`
- ✅ File is saved

**Example of correct format:**
```env
STRIPE_SECRET_KEY=sk_test_abc123
SUPABASE_URL=https://example.supabase.co
SENDGRID_API_KEY=SG.abc123xyz
FROM_EMAIL=wildadventurecoach2233@gmail.com
```

---

## 🧪 Test Now

1. **Restart server** (I just restarted it for you - it's running)
2. **Make a test booking** at http://localhost:3000/booking
3. **Use your personal email** in the form
4. **Complete payment** with: `4242 4242 4242 4242`

---

## 📊 What You Should See

### **In Server Terminal:**
```
✅ Booking saved to Supabase
📧 Confirmation email sent to your@email.com
📧 Admin notification sent to wildadventurecoach2233@gmail.com
```

### **In Your Email Inbox:**
- Confirmation email from Wild Adventure Coach
- Subject: "✅ Booking Confirmed - Hiking and Yoga Retreat - August"

### **In Supabase:**
- New row in `bookings` table with all your information

---

## 🔍 If Still Not Working

**Check 1:** Supabase database columns
- Go to Table Editor → bookings
- Verify `been_hiking` column exists

**Check 2:** .env file format
- Open `.env` file
- Verify SendGrid variables are there
- Check for typos

**Check 3:** Server logs
- Look for email-related errors in terminal

---

## 💡 Most Likely Issue

Based on your terminal logs, the **database columns are still missing**. The error keeps repeating:
```
Could not find the 'been_hiking' column
```

**Please verify you ran the SQL in Supabase!**

---

**Once the database is fixed, everything else should work automatically!** 🚀

