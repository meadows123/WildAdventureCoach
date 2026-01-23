import dotenv from 'dotenv';
dotenv.config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'wildadventurecoach@gmail.com';
/** Where admin notifications are sent. Uses FROM_EMAIL if not set. */
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || FROM_EMAIL;
/** Where retreat-owner notifications (new booking alerts) are sent. Uses ADMIN_EMAIL if not set. */
const RETREAT_OWNER_EMAIL = process.env.RETREAT_OWNER_EMAIL || ADMIN_EMAIL;

/** EmailJS (https://emailjs.com) – booking confirmation & admin notification */
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_1c8sjrs';
const EMAILJS_USER_ID = process.env.EMAILJS_USER_ID;
const EMAILJS_ACCESS_TOKEN = process.env.EMAILJS_ACCESS_TOKEN; // Private key for server-side API calls
const EMAILJS_TEMPLATE_ID_BOOKING = process.env.EMAILJS_TEMPLATE_ID_BOOKING || 'template_hdnnpuh';
const EMAILJS_TEMPLATE_ID_ADMIN = process.env.EMAILJS_TEMPLATE_ID_ADMIN || 'template_ml0v13r';
const useEmailJS = !!(EMAILJS_USER_ID && EMAILJS_ACCESS_TOKEN && EMAILJS_TEMPLATE_ID_BOOKING && EMAILJS_TEMPLATE_ID_ADMIN);

/**
 * HTML encode special characters that might cause issues in EmailJS templates.
 * EmailJS templates are HTML-based, so special characters like &, <, > need to be encoded.
 */
function htmlEncode(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sanitize a value for EmailJS template parameters.
 * EmailJS requires all values to be clean strings - no null, undefined, or special formatting issues.
 * EmailJS can be very strict about character encoding and special characters.
 * This function ensures all values are safe for HTML templates.
 */
function sanitizeForEmailJS(value) {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return '';
  }
  
  // Handle boolean values
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  // Handle numbers - convert to string immediately
  if (typeof value === 'number') {
    return String(value);
  }
  
  // Convert to string
  let str = String(value);
  
  // Remove any control characters that might cause issues
  str = str.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  // Remove zero-width and other problematic Unicode characters
  str = str.replace(/[\u200B-\u200D\uFEFF\uFFFE\uFFFF]/g, '');
  
  // Normalize Unicode to avoid encoding issues
  try {
    str = str.normalize('NFKC'); // Normalize to Compatibility Composition
  } catch (e) {
    // If normalization fails, continue with original string
    console.warn('⚠️  Unicode normalization failed for value:', str.substring(0, 50));
  }
  
  // Don't HTML encode - EmailJS handles encoding automatically
  // HTML encoding might actually cause double-encoding issues
  // Instead, ensure the string is clean and safe
  
  // Trim whitespace
  str = str.trim();
  
  // Final check - ensure it's a valid string
  if (typeof str !== 'string') {
    return String(str);
  }
  
  return str;
}

async function sendViaEmailJS(templateId, templateParams) {
  if (!EMAILJS_ACCESS_TOKEN) {
    throw new Error('EMAILJS_ACCESS_TOKEN is required for server-side API calls');
  }
  
  // Sanitize all template parameters and only include non-empty values
  // EmailJS can be strict about empty strings in Handlebars conditionals
  const sanitizedParams = {};
  for (const [key, value] of Object.entries(templateParams)) {
    const sanitized = sanitizeForEmailJS(value);
    // Only include the parameter if it has a non-empty value
    // Exception: to_email, subject, and email are always included (required fields)
    // But ensure they're not empty strings
    if (key === 'to_email' || key === 'subject' || key === 'email') {
      if (sanitized === '') {
        console.warn(`⚠️  Warning: Required field ${key} is empty, but including it anyway`);
      }
      sanitizedParams[key] = sanitized;
    } else if (sanitized !== '') {
      // For optional fields, only include if they have a value
      sanitizedParams[key] = sanitized;
    }
  }
  
  // Validate required fields are present
  if (!sanitizedParams.to_email) {
    throw new Error('to_email is required but was empty or missing');
  }
  
  const requestBody = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: templateId,
    user_id: EMAILJS_USER_ID,
    template_params: sanitizedParams,
    accessToken: EMAILJS_ACCESS_TOKEN, // Required for server-side calls
  };
  
  console.log(`📧 [EmailJS] Sending to template ${templateId} with access token: ${EMAILJS_ACCESS_TOKEN ? '✅ Set' : '❌ Missing'}`);
  console.log(`📦 [EmailJS] Template params keys:`, Object.keys(sanitizedParams).join(', '));
  // Log param values for debugging (truncated to avoid sensitive data)
  const paramPreview = Object.entries(sanitizedParams).reduce((acc, [key, value]) => {
    acc[key] = typeof value === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value;
    return acc;
  }, {});
  console.log(`📦 [EmailJS] Template params preview:`, JSON.stringify(paramPreview, null, 2));
  
  // Validate all values are strings (EmailJS requirement)
  for (const [key, value] of Object.entries(sanitizedParams)) {
    if (typeof value !== 'string') {
      console.error(`❌ [EmailJS] Parameter ${key} is not a string:`, typeof value, value);
      throw new Error(`Parameter ${key} must be a string, got ${typeof value}`);
    }
  }
  
  // Ensure proper UTF-8 encoding for the request
  // EmailJS can be very sensitive to how the JSON is encoded
  let requestBodyString;
  try {
    // Stringify with no replacer to ensure clean JSON
    requestBodyString = JSON.stringify(requestBody, null, 0);
    
    // Double-check all values in the stringified version are valid
    const parsed = JSON.parse(requestBodyString);
    for (const [key, value] of Object.entries(parsed.template_params || {})) {
      if (typeof value !== 'string') {
        console.error(`❌ [EmailJS] After stringify, ${key} is not a string:`, typeof value);
        throw new Error(`Parameter ${key} became ${typeof value} after stringify`);
      }
    }
  } catch (e) {
    console.error('❌ Error preparing request body for EmailJS:', e);
    throw new Error(`Failed to prepare request body: ${e.message}`);
  }
  
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: requestBodyString,
  });
  
  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ EmailJS API error ${res.status}:`, text);
    
    // Try to parse error for more details
    try {
      const errorData = JSON.parse(text);
      console.error(`❌ EmailJS error details:`, JSON.stringify(errorData, null, 2));
      
      // If it's a corrupted variables error, log which variables might be problematic
      if (text.includes('corrupted') || text.includes('corrupt')) {
        console.error(`❌ [EmailJS] Corrupted variables detected. Checking all variables...`);
        for (const [key, value] of Object.entries(sanitizedParams)) {
          // Check for potentially problematic characters
          const hasSpecialChars = /[^\x20-\x7E]/.test(value);
          const hasControlChars = /[\x00-\x1F\x7F]/.test(value);
          if (hasSpecialChars || hasControlChars) {
            console.error(`⚠️  [EmailJS] Variable ${key} may be problematic:`, {
              length: value.length,
              hasSpecialChars,
              hasControlChars,
              preview: value.substring(0, 100)
            });
          }
        }
      }
    } catch (e) {
      // Error response is not JSON, that's okay
    }
    
    throw new Error(`EmailJS API ${res.status}: ${text}`);
  }
  
  return { success: true };
}

function retreatDatesForName(retreatName) {
  const map = {
    'Hiking and Yoga Retreat in Chamonix': 'June 4 - 9, 2026',
    'Hiking & Yoga Retreat Chamonix': 'June 4 - 9, 2026',
    'Hiking and Yoga Retreat - August': 'August 30 - September 4, 2026',
    'Hiking & Yoga Retreat - Tour du Mont Blanc': 'August 30 - September 4, 2026',
  };
  return map[retreatName] || '';
}

/**
 * Send booking confirmation email via SendGrid
 */
export async function sendBookingConfirmationEmail(booking) {
  console.log('📧 Attempting to send email from:', FROM_EMAIL);
  console.log('📦 Booking data received:', JSON.stringify(booking, null, 2));

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

  const amountInPounds = (booking.amount_paid / 100).toFixed(2);
  const retreatDates = retreatDatesForName(booking.retreat_name);

  if (useEmailJS) {
    try {
      // Only send variables that are actually used in the booking confirmation template
      // Required variables: to_email, first_name, guest_name, email, retreat_name, amount_paid
      // Optional variables (only send if they have values): retreat_dates, accommodation_type, gender, age, hiking_experience
      const guestName = `${booking.first_name || ''} ${booking.last_name || ''}`.trim() || 'Guest';
      // Replace & with "and" in retreat_name to avoid EmailJS template parsing issues
      const retreatName = (booking.retreat_name || '').replace(/&/g, 'and');
      
      const params = {
        to_email: booking.email, // Required by EmailJS API - recipient address
        first_name: booking.first_name || '',
        guest_name: guestName,
        email: booking.email || '',
        retreat_name: retreatName,
        amount_paid: `GBP ${amountInPounds}`,
      };
      
      // Only add optional variables if they have values (template uses {{#if}} conditionals)
      if (retreatDates) params.retreat_dates = retreatDates;
      if (booking.accommodation_type) params.accommodation_type = booking.accommodation_type;
      if (booking.gender) params.gender = booking.gender;
      if (booking.age) params.age = String(booking.age);
      if (booking.hiking_experience) params.hiking_experience = booking.hiking_experience;
      
      await sendViaEmailJS(EMAILJS_TEMPLATE_ID_BOOKING, params);
      console.log(`📧 [EmailJS] Confirmation email sent to ${booking.email}`);
      return { success: true, message: 'Email sent via EmailJS' };
    } catch (e) {
      console.error('❌ EmailJS booking confirmation failed:', e.message);
      return { success: false, error: e.message };
    }
  }

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
          <li><strong>Within 48 hours:</strong> You will receive a detailed itinerary, general information and transportation options.</li>
          <li><strong>90 - 60 days before:</strong> You will receive a comprehensive packing list, recommended training plan and a consent form to sign. The final payment is due.</li>
          <li><strong>30 days before:</strong> You will be invited to an info session and an optional simulation hike.</li>
        </ul>
      </div>
      
      <div class="button-wrapper">
        <a href="https://wildadventurecoach.com/contact" class="button">📞 Get in Touch</a>
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
${booking.hiking_experience ? `- Hiking Experience: ${booking.hiking_experience}` : ''}
- Total Paid: £${amountInPounds}

What's Next?
- Within 48 hours: You will receive a detailed itinerary, general information and transportation options.
- 90 - 60 days before: You will receive a comprehensive packing list, recommended training plan and a consent form to sign. The final payment is due.
- 30 days before: You will be invited to an info session and an optional simulation hike.

Questions?
Visit: https://wildadventurecoach.com/contact
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
 * Send notification email to retreat owner about new booking (guest details, who signed up).
 * Recipient: RETREAT_OWNER_EMAIL || ADMIN_EMAIL || FROM_EMAIL.
 */
export async function sendAdminNotification(booking) {
  const recipientEmail = RETREAT_OWNER_EMAIL || ADMIN_EMAIL || FROM_EMAIL;
  console.log('📧 Attempting to send retreat-owner notification from:', FROM_EMAIL, 'to:', recipientEmail);

  // Validate recipient email is set
  if (!recipientEmail || recipientEmail.trim() === '') {
    console.error('❌ RETREAT_OWNER_EMAIL, ADMIN_EMAIL, and FROM_EMAIL are all empty or not set');
    return { success: false, error: 'Recipient email address is not configured' };
  }

  const amountInPounds = (booking.amount_paid / 100).toFixed(2);
  const retreatDates = retreatDatesForName(booking.retreat_name);
  // Use a simpler date format to avoid encoding issues with commas and special characters
  const bookingDate = booking.booking_date ? new Date(booking.booking_date) : new Date();
  const bookingDateStr = `${bookingDate.getDate()}/${bookingDate.getMonth() + 1}/${bookingDate.getFullYear()} ${String(bookingDate.getHours()).padStart(2, '0')}:${String(bookingDate.getMinutes()).padStart(2, '0')}`;

  if (useEmailJS) {
    try {
      // Only send variables that are actually used in the admin notification template
      // Required variables: to_email, subject, guest_name, email, retreat_name, gender, age, been_hiking, hiking_experience, amount_paid, booking_date
      // Optional variables (only send if they have values): retreat_dates, accommodation_type, stripe_session_id
      // Replace & with "and" in retreat_name to avoid EmailJS template parsing issues
      const retreatName = (booking.retreat_name || '').replace(/&/g, 'and');
      const subjectRetreatName = retreatName; // Use same cleaned name for subject
      
      const params = {
        to_email: recipientEmail, // Required by EmailJS API - recipient address
        subject: `New Booking: ${booking.first_name || ''} ${booking.last_name || ''} - ${subjectRetreatName}`,
        guest_name: `${booking.first_name || ''} ${booking.last_name || ''}`.trim() || 'Guest',
        email: booking.email || '', // Used for Reply-To field
        retreat_name: retreatName,
        gender: booking.gender || 'N/A',
        age: String(booking.age || 'N/A'),
        been_hiking: booking.been_hiking || 'N/A',
        hiking_experience: booking.hiking_experience || 'N/A',
        amount_paid: `GBP ${amountInPounds}`,
        booking_date: bookingDateStr || '',
      };
      
      // Only add optional variables if they have values (template uses {{#if}} conditionals)
      if (retreatDates) params.retreat_dates = retreatDates;
      if (booking.accommodation_type) params.accommodation_type = booking.accommodation_type;
      if (booking.stripe_session_id) params.stripe_session_id = booking.stripe_session_id;
      
      console.log(`📧 [EmailJS] Sending retreat-owner notification to: ${params.to_email}`);
      await sendViaEmailJS(EMAILJS_TEMPLATE_ID_ADMIN, params);
      console.log(`📧 [EmailJS] Retreat-owner notification sent to ${recipientEmail}`);
      return { success: true, message: 'Admin email sent via EmailJS' };
    } catch (e) {
      console.error('❌ EmailJS retreat-owner notification failed:', e.message);
      return { success: false, error: e.message };
    }
  }

  if (!SENDGRID_API_KEY) {
    console.warn('⚠️ Retreat-owner notification NOT sent: no email provider (EmailJS or SendGrid) configured.');
    return { success: false, error: 'SendGrid not configured' };
  }

  try {
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
          <span class="label">Booking Date:</span> <span class="value">${bookingDateStr}</span>
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
            to: [{ email: RETREAT_OWNER_EMAIL, name: 'Wild Adventure Coach (Retreat Owner)' }],
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

    console.log(`📧 Retreat-owner notification sent to ${RETREAT_OWNER_EMAIL}`);
    return { success: true, message: 'Retreat-owner email sent' };
    
  } catch (error) {
    console.error('❌ Error sending retreat-owner notification:', error.message);
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

if (useEmailJS) {
  console.log(`📧 Email: Using EmailJS (${EMAILJS_SERVICE_ID}) for booking confirmation & retreat-owner notification`);
} else if (EMAILJS_USER_ID && !EMAILJS_ACCESS_TOKEN) {
  console.log('⚠️  EmailJS: USER_ID set but ACCESS_TOKEN missing - EmailJS requires access token for server-side calls');
  console.log('📧 Email: Falling back to SendGrid (if configured)');
} else if (SENDGRID_API_KEY) {
  console.log('📧 Email: Using SendGrid for booking confirmation & retreat-owner notification');
} else {
  console.log('📧 Email: No provider configured for booking/retreat-owner emails (set EmailJS with ACCESS_TOKEN or SendGrid)');
}

