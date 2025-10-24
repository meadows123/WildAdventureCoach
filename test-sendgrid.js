import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

// Test SendGrid configuration
async function testSendGrid() {
  console.log('🧪 Testing SendGrid Configuration...\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`   SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   FROM_EMAIL: ${process.env.FROM_EMAIL || '❌ Missing'}`);
  console.log(`   TO_EMAIL: ${process.env.TO_EMAIL || '❌ Missing'}\n`);
  
  if (!process.env.SENDGRID_API_KEY) {
    console.log('❌ SENDGRID_API_KEY not found in .env file');
    return;
  }
  
  if (!process.env.FROM_EMAIL) {
    console.log('❌ FROM_EMAIL not found in .env file');
    return;
  }
  
  // Set API key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  // Test email data
  const testEmail = {
    to: process.env.TO_EMAIL || 'thais.scholz@gmail.com', // Use your email for testing
    from: process.env.FROM_EMAIL,
    subject: '🧪 SendGrid Test - Wild Adventure Coach',
    text: 'This is a test email to verify SendGrid configuration.',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C65D2B;">🧪 SendGrid Test Email</h2>
        <p>This is a test email to verify that your SendGrid configuration is working correctly.</p>
        <p><strong>From:</strong> ${process.env.FROM_EMAIL}</p>
        <p><strong>To:</strong> ${process.env.TO_EMAIL || 'thais.scholz@gmail.com'}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 14px;">If you receive this email, your SendGrid setup is working! 🎉</p>
      </div>
    `
  };
  
  try {
    console.log('📧 Attempting to send test email...');
    console.log(`   From: ${testEmail.from}`);
    console.log(`   To: ${testEmail.to}`);
    
    const response = await sgMail.send(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`   Status Code: ${response[0].statusCode}`);
    console.log(`   Message ID: ${response[0].headers['x-message-id']}`);
    
  } catch (error) {
    console.log('❌ Error sending test email:');
    console.log(`   Status Code: ${error.code}`);
    console.log(`   Message: ${error.message}`);
    
    if (error.response) {
      console.log('   Response Body:', JSON.stringify(error.response.body, null, 2));
    }
    
    // Specific error analysis
    if (error.code === 403) {
      console.log('\n🔍 403 Error Analysis:');
      console.log('   This usually means:');
      console.log('   1. The FROM_EMAIL is not verified in SendGrid');
      console.log('   2. The API key doesn\'t have Mail Send permissions');
      console.log('   3. The API key belongs to a different SendGrid account');
    }
  }
}

// Run the test
testSendGrid().catch(console.error);
