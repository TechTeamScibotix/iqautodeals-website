const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'noreply@iqautodeals.com',
    pass: '$Jd900659',
  },
  tls: {
    rejectUnauthorized: false,
  },
  debug: true,
  logger: true,
});

console.log('Testing SMTP connection and authentication...\n');

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP verification failed:');
    console.error(error);
    process.exit(1);
  } else {
    console.log('✓ SMTP server is ready to send emails');
    console.log('✓ Authentication successful!');
    process.exit(0);
  }
});
