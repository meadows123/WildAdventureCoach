# 📧 Contact Form - Current Setup

## ✅ What's Working Now

Your Contact Me page is live and functional!

### Features:
- **Form Fields**: Name, Email, Phone (optional), Message
- **Validation**: Required fields enforced
- **Styling**: Matches your brand colors
- **Backend**: Receives and logs all submissions
- **User Feedback**: Success/error toast notifications

---

## 📍 How It Works Right Now

### When someone submits the contact form:

1. **Frontend** (`ContactPage.jsx`) sends data to backend
2. **Backend** (`server/index.js`) receives the message
3. **Console Log** displays the message in your server terminal:

```
📧 New Contact Form Submission:
─────────────────────────────────
Name: John Doe
Email: john@example.com
Phone: 555-1234
Message: I'm interested in the June retreat!
Timestamp: 10/8/2025, 9:30:15 AM
─────────────────────────────────
```

4. **User** sees success message

---

## 📨 To Receive Actual Emails

Currently, contact form submissions are logged to your **server console**. To receive them via email:

### Option A: Gmail SMTP (Quick Setup)

**1. Install nodemailer:**
```bash
npm install nodemailer
```

**2. Get Gmail App Password:**
- Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- Generate new app password for "Wild Adventure Website"
- Copy the 16-character password

**3. Add to `.env`:**
```env
EMAIL_USER=wildadventurecoach2233@gmail.com
EMAIL_PASSWORD=your_16_char_app_password_here
```

**4. Update `server/index.js`** (add at top):
```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

**5. Update `/send-contact` endpoint:**
```javascript
// Replace the console.log section with:
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'wildadventurecoach2233@gmail.com',
  replyTo: email, // User's email for easy reply
  subject: `New Contact: ${name}`,
  html: `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
    <hr>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
    <hr>
    <p><small>Sent: ${new Date().toLocaleString()}</small></p>
  `
});
```

**6. Restart server:**
```bash
npm run server
```

---

### Option B: SendGrid (More Reliable for Production)

**Benefits:** Better deliverability, 100 free emails/day, professional

**1. Sign up:** [sendgrid.com](https://sendgrid.com)
**2. Install:** `npm install @sendgrid/mail`
**3. Get API key:** Settings → API Keys
**4. Add to `.env`:** `SENDGRID_API_KEY=your_key_here`

---

## 🔍 Viewing Contact Submissions

### Currently:
- Check your **server terminal** (where you ran `npm run server`)
- Submissions appear there with all details

### After Email Setup:
- Receive emails at **wildadventurecoach2233@gmail.com**
- Can reply directly from your inbox

---

## 📊 Contact Form Data Structure

Each submission contains:
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  phone: "555-1234",
  message: "I'm interested in the June retreat..."
}
```

---

## 🎨 Contact Page Features

- **Responsive design** - Works on all devices
- **Email validation** - Ensures valid email format
- **Loading states** - Shows "Sending..." during submission
- **Error handling** - Clear error messages
- **Success feedback** - Toast notification on success
- **Contact info display** - Shows email, Instagram, location
- **FAQ section** - Helpful info about the retreat

---

## 🚀 Testing

1. Go to `http://localhost:3000/contact`
2. Fill out the form
3. Submit
4. Check your server terminal to see the message
5. User sees success notification

---

## 📝 To Do Later (Optional)

- [ ] Set up email sending (Gmail or SendGrid)
- [ ] Add auto-reply to users who contact you
- [ ] Store messages in database for record-keeping
- [ ] Create admin panel to view all contact submissions

---

**Current Status**: ✅ Contact form functional, logging to console  
**To Enable Emails**: Follow Option A or B above  
**Contact Destination**: wildadventurecoach2233@gmail.com
