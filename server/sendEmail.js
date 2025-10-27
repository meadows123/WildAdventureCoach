import dotenv from 'dotenv';
dotenv.config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'wildadventurecoach@gmail.com';

/**
 * Send booking confirmation email via SendGrid
 */
export async function sendBookingConfirmationEmail(booking) {
  console.log('📧 Attempting to send email from:', FROM_EMAIL);
  if (!SENDGRID_API_KEY) {
    console.warn('⚠️  SendGrid API key not configured. Skipping email.');
    return { success: false, error: 'SendGrid not configured' };
  }

  try {
    const amountInPounds = (booking.amount_paid / 100).toFixed(2);
    
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #F7F5EB; max-width: 600px; margin: 0 auto; background: #1a2d20; }
    .email-wrapper { background: #1a2d20; padding: 20px; }
    .header { background: linear-gradient(135deg, #2E4A34 0%, #6B8E23 100%); color: #F7F5EB; padding: 40px 20px; text-align: center; border-radius: 15px 15px 0 0; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
    .header h1 { margin: 0; font-size: 36px; color: #F7F5EB; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
    .header p { margin: 10px 0 0 0; font-size: 18px; opacity: 0.95; color: #DCCCA3; }
    .content { background: #2E4A34; padding: 30px 20px; color: #DCCCA3; }
    .booking-card { background: #1a2d20; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.2); border: 2px solid #6B8E23; }
    .booking-card h2 { color: #F7F5EB; margin-top: 0; font-size: 24px; border-bottom: 2px solid #C65D2B; padding-bottom: 10px; }
    .detail-row { margin: 15px 0; padding: 12px; background: #2E4A34; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
    .detail-label { font-weight: 700; color: #6B8E23; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-value { color: #F7F5EB; text-align: right; font-weight: 500; }
    .highlight { color: #C65D2B; font-weight: bold; font-size: 28px; text-shadow: 1px 1px 2px rgba(0,0,0,0.2); }
    .next-steps { background: #6B8E23; padding: 25px; border-radius: 15px; margin: 20px 0; border: 2px solid #C65D2B; }
    .next-steps h3 { color: #F7F5EB; margin-top: 0; font-size: 22px; }
    .next-steps ul { padding-left: 20px; margin: 15px 0; }
    .next-steps li { margin: 12px 0; color: #DCCCA3; font-size: 15px; }
    .next-steps li strong { color: #F7F5EB; }
    .contact-box { background: linear-gradient(135deg, #C65D2B 0%, #6B8E23 100%); border: 2px solid #F7F5EB; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
    .contact-box h3 { color: #F7F5EB; margin-top: 0; font-size: 20px; }
    .contact-box p { color: #F7F5EB; margin: 10px 0; }
    .contact-box a { color: #DCCCA3; text-decoration: none; font-weight: 700; border-bottom: 2px solid #DCCCA3; padding-bottom: 2px; }
    .contact-box a:hover { color: #F7F5EB; border-color: #F7F5EB; }
    .footer { text-align: center; padding: 30px 20px; color: #DCCCA3; font-size: 14px; background: #1a2d20; border-radius: 0 0 15px 15px; border-top: 2px solid #6B8E23; }
    .footer a { color: #C65D2B; text-decoration: none; font-weight: 600; }
    .footer a:hover { text-decoration: underline; }
    .greeting { color: #F7F5EB; font-size: 17px; }
    .body-text { color: #DCCCA3; font-size: 16px; line-height: 1.8; }
    .signature { color: #F7F5EB; font-size: 16px; }
    .signature strong { color: #C65D2B; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏔️ Booking Confirmed!</h1>
    <p>Your adventure awaits, ${booking.first_name}!</p>
  </div>
  
  <div class="email-wrapper">
  <div class="content">
    <p class="greeting">Dear ${booking.first_name},</p>
    
    <p class="body-text">Thank you for booking with <strong style="color: #F7F5EB;">Wild Adventure Coach</strong>! We're thrilled to have you join us for an unforgettable adventure in the stunning landscapes of Mont Blanc.</p>
    
    <div class="booking-card">
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
      
      <div class="detail-row" style="border-top: 2px solid #C65D2B; margin-top: 15px; padding-top: 15px;">
        <span class="detail-label" style="font-size: 18px;">Total Paid:</span>
        <span class="highlight">£${amountInPounds}</span>
      </div>
    </div>
    
    <div class="next-steps">
      <h3>✅ What Happens Next?</h3>
      <ul>
        <li><strong>Within 48 hours:</strong> You'll receive a detailed itinerary for your retreat</li>
        <li><strong>2 weeks before:</strong> We'll send you a comprehensive packing list</li>
        <li><strong>1 week before:</strong> Meeting point and logistics details</li>
        <li><strong>3 days before:</strong> Final reminders and emergency contacts</li>
      </ul>
    </div>
    
    <div class="contact-box">
      <h3>📞 Questions or Need Help?</h3>
      <p style="margin: 10px 0; color: #856404;">
        <strong>WhatsApp:</strong> <a href="https://wa.me/447549214155">+44 7549 214155</a><br>
        <strong>Instagram:</strong> <a href="https://www.instagram.com/wildadventurecoach/">@wildadventurecoach</a><br>
        <strong>Email:</strong> <a href="mailto:wildadventurecoach@gmail.com">wildadventurecoach@gmail.com</a>
      </p>
    </div>
    
    <p class="body-text" style="margin-top: 30px;">We can't wait to see you on the trails and help you create memories that will last a lifetime!</p>
    
    <p class="signature" style="margin-top: 25px;">
      Best regards,<br>
      <strong>The Wild Adventure Coach Team</strong> 🥾⛰️
    </p>
  </div>
  
  <div class="footer">
    <p style="margin: 5px 0;"><strong style="color: #F7F5EB;">Wild Adventure Coach</strong></p>
    <p style="margin: 10px 0;">
      <a href="https://wildadventurecoach.onrender.com">wildadventurecoach.onrender.com</a> | 
      <a href="https://www.instagram.com/wildadventurecoach/">@wildadventurecoach</a>
    </p>
    <p style="margin: 15px 0 5px 0; font-size: 12px; color: #DCCCA3;">© 2025 Wild Adventure Coach. All rights reserved.</p>
    <p style="margin: 5px 0; font-size: 11px; color: #DCCCA3; opacity: 0.7;">
      Developed by <a href="https://www.cisconnects.com" style="color: #C65D2B;">Cisconnects</a>
    </p>
  </div>
  </div>
</body>
</html>
    `;

    const emailText = `
Booking Confirmed - Wild Adventure Coach

Dear ${booking.first_name},

Thank you for booking ${booking.retreat_name}!

Booking Details:
- Name: ${booking.first_name} ${booking.last_name}
- Email: ${booking.email}
${booking.gender ? `- Gender: ${booking.gender}` : ''}
${booking.age ? `- Age: ${booking.age}` : ''}
${booking.been_hiking ? `- Been Hiking Before: ${booking.been_hiking}` : ''}
${booking.hiking_experience ? `- Hiking Experience: ${booking.hiking_experience}` : ''}
- Total Paid: £${amountInPounds}

What's Next?
- Within 48 hours: Detailed itinerary
- 2 weeks before: Packing list
- 1 week before: Meeting point details
- 3 days before: Final reminders

Questions?
WhatsApp: +44 7549 214155
Instagram: @wildadventurecoach
Email: wildadventurecoach@gmail.com

See you on the trails!

Best regards,
The Wild Adventure Coach Team
    `;

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ 
              email: booking.email, 
              name: `${booking.first_name} ${booking.last_name}` 
            }],
            subject: `✅ Booking Confirmed - ${booking.retreat_name}`,
          },
        ],
        from: {
          email: FROM_EMAIL,
          name: 'Wild Adventure Coach',
        },
        reply_to: {
          email: FROM_EMAIL,
          name: 'Wild Adventure Coach',
        },
        content: [
          {
            type: 'text/plain',
            value: emailText,
          },
          {
            type: 'text/html',
            value: emailHtml,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ SendGrid error:', errorText);
      throw new Error(`SendGrid API error: ${response.status}`);
    }

    console.log(`📧 Confirmation email sent to ${booking.email}`);
    return { success: true, message: 'Email sent successfully' };
    
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send notification email to admin about new booking
 */
export async function sendAdminNotification(booking) {
  console.log('📧 Attempting to send admin email from:', FROM_EMAIL);
  if (!SENDGRID_API_KEY) {
    return { success: false, error: 'SendGrid not configured' };
  }

  try {
    const amountInPounds = (booking.amount_paid / 100).toFixed(2);
    
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #F7F5EB; max-width: 600px; margin: 0 auto; background: #1a2d20; }
    .email-wrapper { background: #1a2d20; padding: 20px; }
    .header { background: linear-gradient(135deg, #C65D2B 0%, #6B8E23 100%); color: #F7F5EB; padding: 30px 20px; text-align: center; border-radius: 15px 15px 0 0; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
    .header h1 { margin: 0; font-size: 32px; color: #F7F5EB; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
    .content { padding: 30px 20px; background: #2E4A34; }
    .booking-info { background: #1a2d20; padding: 25px; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.2); border: 2px solid #6B8E23; }
    .booking-info h2 { color: #F7F5EB; margin-top: 0; font-size: 24px; border-bottom: 2px solid #C65D2B; padding-bottom: 10px; }
    .detail { margin: 12px 0; padding: 10px; background: #2E4A34; border-radius: 8px; color: #DCCCA3; }
    .label { font-weight: bold; color: #6B8E23; margin-right: 10px; }
    .value { color: #F7F5EB; }
    .action-box { background: #6B8E23; padding: 20px; border-radius: 12px; margin: 20px 0; border: 2px solid #C65D2B; }
    .action-box h3 { color: #F7F5EB; margin-top: 0; }
    .action-box ul { color: #DCCCA3; padding-left: 20px; }
    .action-box li { margin: 8px 0; }
    .footer { text-align: center; padding: 20px; color: #DCCCA3; font-size: 13px; background: #1a2d20; border-radius: 0 0 15px 15px; border-top: 2px solid #6B8E23; }
  </style>
</head>
<body>
  <div class="email-wrapper">
  <div class="header">
    <h1>🎉 New Booking Received!</h1>
  </div>
  
  <div class="content">
    <div class="booking-info">
      <h2 style="margin-top: 0; color: #2E4A34;">Booking Details</h2>
      
      <div class="detail">
        <span class="label">Retreat:</span> <span class="value">${booking.retreat_name}</span>
      </div>
      
      <div class="detail">
        <span class="label">Guest:</span> <span class="value">${booking.first_name} ${booking.last_name}</span>
      </div>
      
      <div class="detail">
        <span class="label">Email:</span> <span class="value">${booking.email}</span>
      </div>
      
      <div class="detail">
        <span class="label">Gender:</span> <span class="value">${booking.gender || 'N/A'}</span>
      </div>
      
      <div class="detail">
        <span class="label">Age:</span> <span class="value">${booking.age || 'N/A'}</span>
      </div>
      
      <div class="detail">
        <span class="label">Been Hiking:</span> <span class="value">${booking.been_hiking || 'N/A'}</span>
      </div>
      
      <div class="detail">
        <span class="label">Experience:</span> <span class="value">${booking.hiking_experience || 'N/A'}</span>
      </div>
      
      <div class="detail" style="margin-top: 15px; background: #6B8E23; border: 2px solid #C65D2B;">
        <span class="label" style="font-size: 16px; color: #F7F5EB;">Amount Paid:</span> 
        <span style="color: #F7F5EB; font-weight: bold; font-size: 24px;">£${amountInPounds}</span>
      </div>
      
      <div class="detail">
        <span class="label">Booking Date:</span> <span class="value">${new Date(booking.booking_date).toLocaleString('en-GB')}</span>
      </div>
      
      <div class="detail" style="font-size: 12px;">
        <span class="label">Stripe ID:</span> 
        <span class="value" style="font-family: monospace; font-size: 11px;">${booking.stripe_session_id}</span>
      </div>
    </div>
    
    <div class="action-box">
      <h3>✅ Action Required:</h3>
      <ul>
        <li>Log into Supabase to view full booking details</li>
        <li>Send welcome package to guest within 48 hours</li>
        <li>Update retreat capacity if needed</li>
        <li>Prepare personalized itinerary for guest</li>
      </ul>
    </div>
  </div>
  
  <div class="footer">
    <p style="margin: 5px 0; color: #DCCCA3;">Wild Adventure Coach - Admin Notification</p>
    <p style="margin: 5px 0; font-size: 11px; opacity: 0.7;">This is an automated notification from your booking system</p>
  </div>
  </div>
</body>
</html>
    `;

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: FROM_EMAIL, name: 'Wild Adventure Coach Admin' }],
            subject: `🎉 New Booking: ${booking.first_name} ${booking.last_name} - ${booking.retreat_name}`,
          },
        ],
        from: {
          email: FROM_EMAIL,
          name: 'Wild Adventure Coach Booking System',
        },
        content: [
          {
            type: 'text/html',
            value: adminEmailHtml,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ SendGrid admin email error:', errorText);
      throw new Error(`SendGrid API error: ${response.status}`);
    }

    console.log(`📧 Admin notification sent to ${FROM_EMAIL}`);
    return { success: true, message: 'Admin email sent' };
    
  } catch (error) {
    console.error('❌ Error sending admin notification:', error.message);
    return { success: false, error: error.message };
  }
}

