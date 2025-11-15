const nodemailer = require('nodemailer');

async function testSMTP() {
  try {
    console.log('Testing SMTP connection...');
    console.log('Host:', process.env.SMTP_HOST || 'smtpout.secureserver.net');
    console.log('Port:', process.env.SMTP_PORT || '465');
    console.log('User:', process.env.SMTP_USER || 'noreply@iqautodeals.com');

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'noreply@iqautodeals.com',
        pass: process.env.SMTP_PASS,
      },
      debug: true,
    });

    console.log('\nVerifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');

    console.log('\nSending test email...');
    const info = await transporter.sendMail({
      from: '"IQ Auto Deals" <noreply@iqautodeals.com>',
      to: 'customer1@iqautodeals.com',
      subject: 'Test Email - SMTP Connection',
      text: 'This is a test email to verify SMTP is working.',
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ SMTP Error:', error.message);
    if (error.response) {
      console.error('Server Response:', error.response);
    }
    if (error.code) {
      console.error('Error Code:', error.code);
    }
  }
}

testSMTP();
