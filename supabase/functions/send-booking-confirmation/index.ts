// Supabase Edge Function to send booking confirmation emails via SendGrid
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'wildadventurecoach@gmail.com'

interface BookingData {
  first_name: string
  last_name: string
  email: string
  retreat_name: string
  gender?: string
  age?: number
  been_hiking?: string
  hiking_experience?: string
  amount_paid: number
  booking_date: string
}

serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    // Parse the booking data
    const booking: BookingData = await req.json()

    // Validate required fields
    if (!booking.email || !booking.first_name || !booking.retreat_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required booking fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Format the amount paid (convert from pence to pounds)
    const amountInPounds = (booking.amount_paid / 100).toFixed(2)

    // Create email content
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2E4A34 0%, #6B8E23 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C65D2B; }
    .booking-details h2 { color: #2E4A34; margin-top: 0; }
    .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
    .detail-label { font-weight: bold; color: #6B8E23; }
    .detail-value { color: #333; }
    .highlight { color: #C65D2B; font-weight: bold; font-size: 24px; }
    .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
    .button { display: inline-block; background: #C65D2B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
    .checklist { background: #fff; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .checklist li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏔️ Booking Confirmed!</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Your adventure awaits, ${booking.first_name}!</p>
    </div>
    
    <div class="content">
      <p>Dear ${booking.first_name},</p>
      
      <p>Thank you for booking with <strong>Wild Adventure Coach</strong>! We're thrilled to have you join us on this incredible journey.</p>
      
      <div class="booking-details">
        <h2>📋 Your Booking Details</h2>
        
        <div class="detail-row">
          <span class="detail-label">Retreat:</span>
          <span class="detail-value">${booking.retreat_name}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Name:</span>
          <span class="detail-value">${booking.first_name} ${booking.last_name}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${booking.email}</span>
        </div>
        
        ${booking.gender ? `
        <div class="detail-row">
          <span class="detail-label">Gender:</span>
          <span class="detail-value">${booking.gender}</span>
        </div>
        ` : ''}
        
        ${booking.age ? `
        <div class="detail-row">
          <span class="detail-label">Age:</span>
          <span class="detail-value">${booking.age}</span>
        </div>
        ` : ''}
        
        ${booking.been_hiking ? `
        <div class="detail-row">
          <span class="detail-label">Been Hiking Before:</span>
          <span class="detail-value">${booking.been_hiking}</span>
        </div>
        ` : ''}
        
        ${booking.hiking_experience ? `
        <div class="detail-row">
          <span class="detail-label">Hiking Experience:</span>
          <span class="detail-value">${booking.hiking_experience}</span>
        </div>
        ` : ''}
        
        <div class="detail-row">
          <span class="detail-label">Total Paid:</span>
          <span class="highlight">£${amountInPounds}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Booking Date:</span>
          <span class="detail-value">${new Date(booking.booking_date).toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
      </div>
      
      <div class="checklist">
        <h3 style="color: #2E4A34; margin-top: 0;">✅ What's Next?</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li>✓ You'll receive a detailed itinerary within 48 hours</li>
          <li>✓ Packing list will be sent 2 weeks before departure</li>
          <li>✓ Meeting point details will be shared 1 week before</li>
          <li>✓ Emergency contact information coming soon</li>
        </ul>
      </div>
      
      <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #856404;"><strong>📞 Need to Contact Us?</strong></p>
        <p style="margin: 5px 0 0 0; color: #856404;">
          WhatsApp: <a href="https://wa.me/447549214155" style="color: #C65D2B;">+44 7549 214155</a><br>
          Instagram: <a href="https://www.instagram.com/wildadventurecoach/" style="color: #C65D2B;">@wildadventurecoach</a>
        </p>
      </div>
      
      <p>We're here to answer any questions and help you prepare for this amazing adventure!</p>
      
      <p style="margin-top: 30px;">See you on the trails! 🥾</p>
      
      <p>
        Best regards,<br>
        <strong>The Wild Adventure Coach Team</strong>
      </p>
    </div>
    
    <div class="footer">
      <p>© 2025 Wild Adventure Coach. All rights reserved.</p>
      <p>
        <a href="https://wildadventurecoach.onrender.com" style="color: #C65D2B;">wildadventurecoach.onrender.com</a> | 
        <a href="https://www.instagram.com/wildadventurecoach/" style="color: #C65D2B;">@wildadventurecoach</a>
      </p>
    </div>
  </div>
</body>
</html>
    `

    // Send email via SendGrid
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: booking.email, name: `${booking.first_name} ${booking.last_name}` }],
            subject: `Booking Confirmed - ${booking.retreat_name}`,
          },
        ],
        from: {
          email: FROM_EMAIL,
          name: 'Wild Adventure Coach',
        },
        content: [
          {
            type: 'text/html',
            value: emailHtml,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('SendGrid error:', error)
      throw new Error(`SendGrid API error: ${response.status}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Confirmation email sent' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

