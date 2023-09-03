const nodemailer = require('nodemailer');
const cron = require('node-cron');
const fs = require('fs').promises;



// Function to read the email template
async function readEmailTemplate() {
  try {
    const htmlContent = await fs.readFile('view/mailers/mail.html', 'utf-8');
    return htmlContent;
  } catch (error) {
    console.error('Error reading email template:', error);
    throw error;
  }
}



// Function to send an email
async function sendEmail(email, filterName, subject, content) {
  console.log(`Sending email to ${email}`);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    const htmlContent = await readEmailTemplate();

    // Replace placeholders with subject and content
    const emailHtml = htmlContent
      .replace('{filterName}', filterName)
      .replace('{content}', content);

    const mailOptions = {
      from: filterName,
      to: email,
      subject: subject,
      html: emailHtml,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  } catch (error) {
    console.log('Error:', error);
  }
}

module.exports.sendInfo = (req, res) => {

  const { email, subject, content, filterName, delay } = req.body;
  console.log(email, subject, content, filterName, delay);
  const delayVal = parseInt(delay);
  console.log("filte",filterName);

  sendEmail(email, filterName, subject, content);

  // Schedule emails => delayVal (1 for yearly, 2 for weekly, 3 for daily)
  switch (delayVal) {
    case 1:
      console.log('Email scheduled yearly');
      cron.schedule('0 9 1 1 *', () => {
        sendEmail(email, filterName, subject, content);
      });
      break;
    case 2:
      console.log('Email scheduled weekly');
      cron.schedule('0 9 * * 1', () => {
        sendEmail(email, filterName, subject, content);
      });
      break;
    case 3:
      console.log('Email scheduled daily');
      cron.schedule('0 9 * * *', () => {
        sendEmail(email, filterName, subject, content);
      });
      break;
    default:
      console.log('Invalid delayVal value. No emails scheduled.');
      break;
  }
};
