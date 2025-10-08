# 📊 Booking Data Storage & Capacity Management Guide

## 🎯 Your Requirements

1. **Store booking data** when people sign up
2. **Track capacity** and prevent overbooking
3. **Block bookings** when retreat reaches maximum capacity

---

## ✅ Current Setup Complete

### Navigation Updated
- ✅ "Book Now" removed from navigation (still accessible via Retreat page button)
- ✅ "Retreats" renamed to "Retreat" (singular)
- ✅ "Contact Me" page added to navigation

### Contact Form Created
- ✅ Contact page with email form
- ✅ Backend endpoint logs messages to console
- ✅ Ready to send emails (needs email service setup)

---

## 📋 Best Solution: SQLite Database + Capacity Tracking

Here's the recommended architecture:

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Frontend   │───▶│    Server    │───▶│  Database    │───▶│   Stripe     │
│   Booking    │    │   Check      │    │   (SQLite)   │    │   Payment    │
│    Form      │    │  Capacity    │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

### Why SQLite?
✅ No external database server needed  
✅ Easy to set up  
✅ Perfect for small to medium traffic  
✅ Data stored in a single file  
✅ No monthly fees  

---

## 🚀 Implementation Steps

### Step 1: Install Database Package

```bash
npm install better-sqlite3
```

### Step 2: Create Database Schema

Create file: `server/database.js`

```javascript
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'bookings.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stripe_session_id TEXT UNIQUE,
    retreat_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    participants INTEGER NOT NULL,
    special_requests TEXT,
    amount_paid INTEGER NOT NULL,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_status TEXT DEFAULT 'pending'
  );

  CREATE TABLE IF NOT EXISTS retreat_capacity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    retreat_name TEXT UNIQUE NOT NULL,
    max_capacity INTEGER NOT NULL,
    current_bookings INTEGER DEFAULT 0
  );
`);

// Initialize retreat capacity
const initCapacity = db.prepare(`
  INSERT OR IGNORE INTO retreat_capacity (retreat_name, max_capacity)
  VALUES (?, ?)
`);

initCapacity.run('Mountain Summit Experience', 12); // Max 12 people

// Functions
export function addBooking(bookingData) {
  const insert = db.prepare(`
    INSERT INTO bookings 
    (stripe_session_id, retreat_name, first_name, last_name, email, phone, participants, special_requests, amount_paid, payment_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  return insert.run(
    bookingData.stripe_session_id,
    bookingData.retreat_name,
    bookingData.first_name,
    bookingData.last_name,
    bookingData.email,
    bookingData.phone,
    bookingData.participants,
    bookingData.special_requests,
    bookingData.amount_paid,
    bookingData.payment_status
  );
}

export function getAvailableSpots(retreatName) {
  const capacity = db.prepare(`
    SELECT max_capacity, current_bookings FROM retreat_capacity WHERE retreat_name = ?
  `).get(retreatName);
  
  if (!capacity) return 0;
  return capacity.max_capacity - capacity.current_bookings;
}

export function updateCapacity(retreatName, participants) {
  const update = db.prepare(`
    UPDATE retreat_capacity 
    SET current_bookings = current_bookings + ?
    WHERE retreat_name = ?
  `);
  
  return update.run(participants, retreatName);
}

export function getAllBookings() {
  return db.prepare('SELECT * FROM bookings ORDER BY booking_date DESC').all();
}

export function getRetreatStats(retreatName) {
  const stats = db.prepare(`
    SELECT 
      rc.max_capacity,
      rc.current_bookings,
      COUNT(b.id) as total_bookings,
      SUM(b.participants) as total_participants
    FROM retreat_capacity rc
    LEFT JOIN bookings b ON b.retreat_name = rc.retreat_name AND b.payment_status = 'completed'
    WHERE rc.retreat_name = ?
    GROUP BY rc.retreat_name
  `).get(retreatName);
  
  return stats;
}

export default db;
```

### Step 3: Update Server to Use Database

Update `server/index.js`:

```javascript
import { addBooking, getAvailableSpots, updateCapacity, getRetreatStats } from './database.js';

// Add before creating checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { retreat, participants, email, firstName, lastName, phone, specialRequests } = req.body;
  
  // CHECK CAPACITY FIRST
  const availableSpots = getAvailableSpots(retreat);
  if (availableSpots < parseInt(participants)) {
    return res.status(400).json({ 
      error: `Only ${availableSpots} spots remaining. Please adjust number of participants.` 
    });
  }
  
  // ... rest of checkout code
});

// New endpoint: Get retreat capacity
app.get('/retreat-capacity/:retreatName', (req, res) => {
  try {
    const stats = getRetreatStats(req.params.retreatName);
    res.json({
      maxCapacity: stats.max_capacity,
      currentBookings: stats.current_bookings,
      availableSpots: stats.max_capacity - stats.current_bookings,
      soldOut: stats.current_bookings >= stats.max_capacity
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update webhook to save bookings
case 'checkout.session.completed':
  const session = event.data.object;
  const bookingData = {
    stripe_session_id: session.id,
    retreat_name: session.metadata.retreat,
    first_name: session.metadata.firstName,
    last_name: session.metadata.lastName,
    email: session.customer_email,
    phone: session.metadata.phone,
    participants: parseInt(session.metadata.participants),
    special_requests: session.metadata.specialRequests,
    amount_paid: session.amount_total,
    payment_status: 'completed'
  };
  
  addBooking(bookingData);
  updateCapacity(session.metadata.retreat, bookingData.participants);
  console.log('✅ Booking saved to database');
  break;
```

### Step 4: Update Frontend to Check Capacity

Update `BookingPage.jsx` and `RetreatsPage.jsx`:

```javascript
// Add to component
const [availableSpots, setAvailableSpots] = useState(null);
const [soldOut, setSoldOut] = useState(false);

useEffect(() => {
  // Fetch capacity on load
  fetch('http://localhost:4242/retreat-capacity/Mountain Summit Experience')
    .then(res => res.json())
    .then(data => {
      setAvailableSpots(data.availableSpots);
      setSoldOut(data.soldOut);
    })
    .catch(console.error);
}, []);

// Show remaining spots
{availableSpots !== null && (
  <div className="text-[#DCCCA3] text-sm">
    {soldOut ? (
      <span className="text-[#C65D2B] font-bold">SOLD OUT</span>
    ) : (
      <span>Only {availableSpots} spots remaining!</span>
    )}
  </div>
)}

// Disable booking if sold out
<Button 
  disabled={soldOut || isSending}
  className={soldOut ? 'opacity-50 cursor-not-allowed' : ''}
>
  {soldOut ? 'Sold Out' : 'Book This Retreat'}
</Button>
```

---

## 🔄 Alternative: Google Sheets (Simpler, No Database)

If you prefer not to use a database:

### Using Google Sheets API

1. Create a Google Sheet for bookings
2. Set up Google Sheets API
3. POST booking data directly to sheet
4. Track capacity in the sheet

**Pros:** Easy to view/export data, no database setup  
**Cons:** Slower, requires Google API setup, less reliable

---

## 📧 Email Setup for Contact Form

### Option 1: Gmail SMTP (Simple)

Install nodemailer:
```bash
npm install nodemailer
```

Update `server/index.js`:

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // wildadventurecoach2233@gmail.com
    pass: process.env.EMAIL_PASSWORD // App-specific password
  }
});

// In /send-contact endpoint:
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'wildadventurecoach2233@gmail.com',
  subject: `New Contact Form: ${name}`,
  html: `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `
});
```

Add to `.env`:
```
EMAIL_USER=wildadventurecoach2233@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

**Note**: You need to create an **App Password** in Gmail settings (not your regular password).

### Option 2: SendGrid (Professional, Free Tier)

1. Sign up at [sendgrid.com](https://sendgrid.com) (free for 100 emails/day)
2. Get API key
3. Install: `npm install @sendgrid/mail`
4. Much more reliable than Gmail for production

---

## 📊 Booking Data You'll Capture

Each booking will store:
- Stripe session ID (unique identifier)
- Retreat name
- First & last name
- Email address
- Phone number
- Number of participants
- Special requests/dietary needs
- Amount paid
- Booking timestamp
- Payment status (pending/completed/refunded)

---

## 🛡️ How Capacity Management Works

1. **User visits booking page**
   - Frontend fetches current capacity
   - Shows "X spots remaining" or "SOLD OUT"

2. **User submits form**
   - Backend checks available spots BEFORE creating Stripe session
   - If not enough spots → Error message
   - If spots available → Create Stripe checkout

3. **Payment successful**
   - Stripe webhook fires
   - Booking saved to database
   - Capacity updated (current_bookings + participants)

4. **Retreat full**
   - When current_bookings >= max_capacity
   - Booking button disabled
   - Shows "SOLD OUT" message

---

## 🔧 Quick Setup Commands

```bash
# 1. Install database
npm install better-sqlite3

# 2. Install email (choose one):
npm install nodemailer              # Gmail/SMTP
npm install @sendgrid/mail          # SendGrid

# 3. Create database file
# (Create server/database.js with the code above)

# 4. Update server/index.js
# (Add the capacity checking code)

# 5. Update .env
EMAIL_USER=wildadventurecoach2233@gmail.com
EMAIL_PASSWORD=your_app_password_here

# 6. Restart server
npm run server
```

---

## 📁 Files to Create/Update

**New Files:**
- `server/database.js` - Database schema and functions
- `server/bookings.db` - SQLite database (auto-created)

**Update:**
- `server/index.js` - Add capacity checking
- `src/pages/BookingPage.jsx` - Show remaining spots
- `src/pages/RetreatsPage.jsx` - Show capacity info

---

## 🎯 Current Status

✅ **Contact form working** - Logs to server console  
✅ **Navigation updated** - Book Now removed, Retreat renamed  
✅ **Contact page live** - Form ready to send emails  
⚠️ **Booking storage** - Needs database setup  
⚠️ **Capacity tracking** - Needs database setup  
⚠️ **Email sending** - Currently logs only (needs nodemailer or SendGrid)  

---

## 🚀 Next Steps

Would you like me to:

1. **Implement the full database solution** (recommended)?
   - I'll create the database file
   - Add capacity checking
   - Update frontend to show remaining spots
   
2. **Set up email sending** with Gmail or SendGrid?
   - Configure nodemailer
   - Send real emails from contact form
   
3. **Create a simple admin dashboard**?
   - View all bookings
   - See who signed up
   - Export data to CSV

Let me know which you'd like to tackle first! 🎉

---

**Current Contact Form**: Messages display in your backend server terminal  
**Email Setup**: See EMAIL_SETUP section above  
**Database**: Ready to implement when you're ready
