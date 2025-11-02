import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

async function testEmailDebug() {
  console.log('🧪 Testing SendGrid Email Delivery - Debug Mode\n');
  
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'wildadventurecoach@gmail.com';
  const TO_EMAIL = 'zakm.meadows15@gmail.com'; // Your test email
  
  console.log('📋 Configuration:');
  console.log(`   API Key: ${SENDGRID_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   From: ${FROM_EMAIL}`);
  console.log(`   To: ${TO_EMAIL}\n`);
  
  if (!SENDGRID_API_KEY) {
    console.error('❌ SendGrid API key not found!');
    return;
  }
  
  sgMail.setApiKey(SENDGRID_API_KEY);
  
  // Test 1: Simple text email
  console.log('📧 Test 1: Sending simple text email...');
  const msg1 = {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject: 'Wild Adventure Coach - Simple Test',
    text: 'This is a simple text email test.',
  };
  
  try {
    const response1 = await sgMail.send(msg1);
    console.log('✅ Simple email sent successfully!');
    console.log(`   Status: ${response1[0].statusCode}`);
    console.log(`   Message ID: ${response1[0].headers['x-message-id']}`);
  } catch (error) {
    console.error('❌ Simple email failed:', error.response?.body?.errors || error.message);
  }
  
  // Test 2: HTML email (like your booking confirmation)
  console.log('\n📧 Test 2: Sending HTML email (like booking confirmation)...');
  const msg2 = {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject: 'Wild Adventure Coach - HTML Test',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #C65D2B;">🎉 Booking Confirmation Test</h2>
        <p>Hello!</p>
        <p>This is a test of the HTML email format used for booking confirmations.</p>
        <p><strong>If you received this, the HTML emails are working!</strong></p>
        <p>Best regards,<br>The Wild Adventure Coach Team</p>
      </div>
    `,
  };
  
  try {
    const response2 = await sgMail.send(msg2);
    console.log('✅ HTML email sent successfully!');
    console.log(`   Status: ${response2[0].statusCode}`);
    console.log(`   Message ID: ${response2[0].headers['x-message-id']}`);
  } catch (error) {
    console.error('❌ HTML email failed:', error.response?.body?.errors || error.message);
  }
  
  // Test 3: Check SendGrid activity
  console.log('\n📊 Next Steps:');
  console.log('1. Check your email inbox (and spam folder)');
  console.log('2. Go to SendGrid Dashboard → Activity → Activity Feed');
  console.log('3. Look for the emails we just sent');
  console.log('4. Check the delivery status');
}

testEmailDebug();
