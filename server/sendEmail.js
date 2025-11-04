import dotenv from 'dotenv';
dotenv.config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'wildadventurecoach@gmail.com';

/**
 * Send booking confirmation email via SendGrid
 */
export async function sendBookingConfirmationEmail(booking) {
  console.log('📧 Attempting to send email from:', FROM_EMAIL);
  console.log('📦 Booking data received:', JSON.stringify(booking, null, 2));
  
  if (!SENDGRID_API_KEY) {
    console.warn('⚠️  SendGrid API key not configured. Skipping email.');
    return { success: false, error: 'SendGrid not configured' };
  }

  // Validate required fields
  if (!booking || !booking.email || !booking.first_name || !booking.last_name || !booking.retreat_name) {
    console.error('❌ Missing required booking fields:', { 
      hasBooking: !!booking,
      hasEmail: !!booking?.email,
      hasFirstName: !!booking?.first_name,
      hasLastName: !!booking?.last_name,
      hasRetreatName: !!booking?.retreat_name
    });
    return { success: false, error: 'Missing required booking fields' };
  }

  try {
    const amountInPounds = (booking.amount_paid / 100).toFixed(2);
    
    // Get retreat dates based on retreat name
    const retreatDatesMap = {
      'Hiking and Yoga Retreat in Chamonix': 'June 4 - 9, 2026',
      'Hiking & Yoga Retreat Chamonix': 'June 4 - 9, 2026',
      'Hiking and Yoga Retreat - August': 'August 30 - September 4, 2026',
      'Hiking & Yoga Retreat - Tour du Mont Blanc': 'August 30 - September 4, 2026'
    };
    
    const retreatDates = retreatDatesMap[booking.retreat_name] || '';
    
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background: #f5f5f5; }
    .email-wrapper { background: #ffffff; padding: 20px; border-radius: 8px; }
    .header { background: #6B8E23; color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 32px; }
    .header p { margin: 10px 0 0 0; font-size: 18px; }
    .content { padding: 30px 20px; color: #333; }
    .booking-card { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6B8E23; }
    .booking-card h2 { color: #6B8E23; margin-top: 0; font-size: 22px; }
    .detail-row { margin: 12px 0; padding: 8px 0; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e0e0e0; }
    .detail-label { font-weight: 600; color: #6B8E23; }
    .detail-value { text-align: right; color: #333; }
    .highlight { color: #C65D2B; font-weight: bold; font-size: 24px; }
    .next-steps { background: #6B8E23; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .next-steps h3 { margin-top: 0; font-size: 20px; }
    .next-steps ul { padding-left: 20px; margin: 10px 0; }
    .next-steps li { margin: 8px 0; }
    .button-wrapper { text-align: center; margin: 25px 0; }
    .button { display: inline-block; background: #C65D2B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; border-top: 2px solid #6B8E23; background: #f9f9f9; border-radius: 0 0 8px 8px; }
    .footer a { color: #C65D2B; text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <h1>🏔️ Booking Confirmed!</h1>
      <p>Your adventure awaits, ${booking.first_name}!</p>
    </div>
    
    <div class="content">
      <p>Dear ${booking.first_name},</p>
      
      <p>Thank you for booking with <strong>Wild Adventure Coach</strong>! We're thrilled to have you join us for an unforgettable adventure in the stunning landscapes of Mont Blanc.</p>
      
      <div class="booking-card">
        <h2>📋 Your Booking Details</h2>
        
        <div class="detail-row">
          <span class="detail-label">Retreat: </span>
          <span class="detail-value">${booking.retreat_name}</span>
        </div>
        
        ${retreatDates ? `
        <div class="detail-row">
          <span class="detail-label">Dates: </span>
          <span class="detail-value">${retreatDates}</span>
        </div>
        ` : ''}
        
        ${booking.accommodation_type ? `
        <div class="detail-row">
          <span class="detail-label">Accommodation: </span>
          <span class="detail-value">${booking.accommodation_type}</span>
        </div>
        ` : ''}
        
        <div class="detail-row">
          <span class="detail-label">Name: </span>
          <span class="detail-value">${booking.first_name} ${booking.last_name}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Email: </span>
          <span class="detail-value">${booking.email}</span>
        </div>
        
        ${booking.gender ? `
        <div class="detail-row">
          <span class="detail-label">Gender: </span>
          <span class="detail-value">${booking.gender}</span>
        </div>
        ` : ''}
        
        ${booking.age ? `
        <div class="detail-row">
          <span class="detail-label">Age: </span>
          <span class="detail-value">${booking.age}</span>
        </div>
        ` : ''}
        
        ${booking.been_hiking ? `
        <div class="detail-row">
          <span class="detail-label">Been Hiking Before: </span>
          <span class="detail-value">${booking.been_hiking}</span>
        </div>
        ` : ''}
        
        ${booking.hiking_experience ? `
        <div class="detail-row">
          <span class="detail-label">Hiking Experience: </span>
          <span class="detail-value">${booking.hiking_experience}</span>
        </div>
        ` : ''}
        
        <div class="detail-row" style="border-top: 2px solid #C65D2B; margin-top: 15px; padding-top: 15px; border-bottom: none;">
          <span class="detail-label" style="font-size: 18px;">Total Paid: </span>
          <span class="highlight">£${amountInPounds}</span>
        </div>
      </div>
      
      <div class="next-steps">
        <h3>✅ What Happens Next?</h3>
        <ul>
          <li><strong>Within 48 hours:</strong> You will receive a detailed itinerary, general information and transportation options</li>
          <li><strong>3 Months before:</strong> You will receive a comprehensive packing list, recommended training plan and consent form to sign.</li>
          <li><strong>2 Months before:</strong> The final payment is due.</li>
          <li><strong>1 Month before:</strong> You will be invited to an info session and an optional simulation hike.</li>
        </ul>
      </div>
      
      <div class="button-wrapper">
        <a href="https://wa.me/447549214155" class="button">📞 Get in Touch</a>
      </div>
      
      <p style="margin-top: 25px;">We can't wait to see you on the trails and help you create memories that will last a lifetime!</p>
      
      <p style="margin-top: 25px;">
        Best regards,<br>
        <strong>The Wild Adventure Coach Team</strong> 🥾⛰️
      </p>
    </div>
    
    <div class="footer">
      <p style="margin: 5px 0;"><strong>Wild Adventure Coach</strong></p>
      <p style="margin: 10px 0;">
        <a href="https://wildadventurecoach.com">wildadventurecoach.com</a> | 
        <a href="https://www.instagram.com/wildadventurecoach/">@wildadventurecoach</a>
      </p>
      <p style="margin: 15px 0 5px 0; font-size: 12px;">© 2025 Wild Adventure Coach. All rights reserved.</p>
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
- Retreat: ${booking.retreat_name}
${retreatDates ? `- Dates: ${retreatDates}` : ''}
${booking.accommodation_type ? `- Accommodation: ${booking.accommodation_type}` : ''}
- Name: ${booking.first_name} ${booking.last_name}
- Email: ${booking.email}
${booking.gender ? `- Gender: ${booking.gender}` : ''}
${booking.age ? `- Age: ${booking.age}` : ''}
${booking.been_hiking ? `- Been Hiking Before: ${booking.been_hiking}` : ''}
${booking.hiking_experience ? `- Hiking Experience: ${booking.hiking_experience}` : ''}
- Total Paid: £${amountInPounds}

What's Next?
- Within 48 hours: You will receive a detailed itinerary, general information and transportation options
- 3 Months before: You will receive a comprehensive packing list, recommended training plan and consent form to sign.
- 2 Months before: The final payment is due.
- 1 Month before: You will be invited to an info session and an optional simulation hike.

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
            subject: `Booking Confirmed - ${booking.retreat_name}`,
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
        // Mark as transactional email to improve deliverability
        mail_settings: {
          sandbox_mode: {
            enable: false
          }
        },
        // Add categories to help with deliverability
        categories: ['booking-confirmation', 'transactional'],
        // Custom headers to improve deliverability
        headers: {
          'X-Entity-Ref-ID': `booking-${booking.stripe_session_id}`,
          'List-Unsubscribe': `<mailto:${FROM_EMAIL}?subject=unsubscribe>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
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
    
    // Get retreat dates based on retreat name
    const retreatDatesMap = {
      'Hiking and Yoga Retreat in Chamonix': 'June 4 - 9, 2026',
      'Hiking & Yoga Retreat Chamonix': 'June 4 - 9, 2026',
      'Hiking and Yoga Retreat - August': 'August 30 - September 4, 2026',
      'Hiking & Yoga Retreat - Tour du Mont Blanc': 'August 30 - September 4, 2026'
    };
    
    const retreatDates = retreatDatesMap[booking.retreat_name] || '';
    
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background: #f5f5f5; }
    .email-wrapper { background: #ffffff; padding: 20px; border-radius: 8px; }
    .header { background: #6B8E23; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; color: #333; }
    .booking-info { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6B8E23; }
    .booking-info h2 { color: #6B8E23; margin-top: 0; font-size: 22px; }
    .detail { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
    .label { font-weight: 600; color: #6B8E23; margin-right: 10px; }
    .value { color: #333; }
    .action-box { background: #C65D2B; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .action-box h3 { margin-top: 0; }
    .action-box ul { padding-left: 20px; }
    .action-box li { margin: 8px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 13px; border-top: 2px solid #6B8E23; background: #f9f9f9; border-radius: 0 0 8px 8px; }
    .highlight { color: #C65D2B; font-weight: bold; font-size: 24px; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <h1>🎉 New Booking Received!</h1>
    </div>
    
    <div class="content">
      <div class="booking-info">
        <h2>Booking Details</h2>
        
        <div class="detail">
          <span class="label">Retreat:</span> <span class="value">${booking.retreat_name}</span>
        </div>
        
        ${retreatDates ? `
        <div class="detail">
          <span class="label">Date:</span> <span class="value">${retreatDates}</span>
        </div>
        ` : ''}
        
        ${booking.accommodation_type ? `
        <div class="detail">
          <span class="label">Accommodation:</span> <span class="value">${booking.accommodation_type}</span>
        </div>
        ` : ''}
        
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
        
        <div class="detail" style="border-top: 2px solid #C65D2B; margin-top: 15px; padding-top: 15px; border-bottom: none;">
          <span class="label" style="font-size: 18px;">Amount Paid:</span> 
          <span class="highlight">£${amountInPounds}</span>
        </div>
        
        <div class="detail">
          <span class="label">Booking Date:</span> <span class="value">${booking.booking_date ? new Date(booking.booking_date).toLocaleString('en-GB') : new Date().toLocaleString('en-GB')}</span>
        </div>
        
        <div class="detail">
          <span class="label">Stripe ID:</span> 
          <span class="value" style="font-family: monospace; font-size: 12px;">${booking.stripe_session_id}</span>
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
      <p style="margin: 5px 0;">Wild Adventure Coach - Admin Notification</p>
      <p style="margin: 5px 0; font-size: 12px;">This is an automated notification from your booking system</p>
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

/**
 * Send contact form email via SendGrid
 */
export async function sendContactEmail(contactData) {
  console.log('📧 Attempting to send contact email from:', FROM_EMAIL);
  if (!SENDGRID_API_KEY) {
    console.warn('⚠️  SendGrid API key not configured. Skipping email.');
    return { success: false, error: 'SendGrid not configured' };
  }

  try {
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background: #f5f5f5; }
    .email-wrapper { background: #ffffff; padding: 20px; border-radius: 8px; }
    .header { background: #6B8E23; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; color: #333; }
    .contact-info { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6B8E23; }
    .contact-info h2 { color: #6B8E23; margin-top: 0; font-size: 22px; }
    .detail { margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
    .label { font-weight: 600; color: #6B8E23; margin-right: 10px; }
    .value { color: #333; }
    .message-box { background: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C65D2B; }
    .message-box h3 { color: #C65D2B; margin-top: 0; margin-bottom: 15px; }
    .message-box p { color: #333; margin: 0; line-height: 1.8; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 13px; border-top: 2px solid #6B8E23; background: #f9f9f9; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <h1>📧 New Contact Form Submission</h1>
    </div>
    
    <div class="content">
      <div class="contact-info">
        <h2>Contact Details</h2>
        
        <div class="detail">
          <span class="label">Name:</span> <span class="value">${contactData.name}</span>
        </div>
        
        <div class="detail">
          <span class="label">Email:</span> <span class="value">${contactData.email}</span>
        </div>
        
        <div class="message-box">
          <h3>Message:</h3>
          <p>${contactData.message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div class="detail" style="margin-top: 20px; padding: 10px; background: #f5f5f5; font-size: 13px; border-radius: 6px; border-bottom: none;">
          <strong style="color: #6B8E23;">Received:</strong> ${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'long' })}
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>© 2025 Wild Adventure Coach. All rights reserved.</p>
      <p style="margin-top: 10px;">
        <a href="https://wildadventurecoach.com" style="color: #C65D2B; text-decoration: none;">wildadventurecoach.com</a>
      </p>
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
            to: [{ email: 'wildadventurecoach@gmail.com', name: 'Wild Adventure Coach' }],
            subject: `New Contact Form Message from ${contactData.name}`,
          },
        ],
        from: {
          email: FROM_EMAIL,
          name: 'Wild Adventure Coach Website',
        },
        reply_to: {
          email: contactData.email,
          name: contactData.name,
        },
        content: [
          {
            type: 'text/html',
            value: emailHtml,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ SendGrid error:', error);
      throw new Error(`SendGrid API error: ${response.status}`);
    }

    console.log('✅ Contact email sent successfully to wildadventurecoach@gmail.com');
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending contact email:', error.message);
    return { success: false, error: error.message };
  }
}

