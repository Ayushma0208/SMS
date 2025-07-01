import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email to one or multiple recipients (with safe looped delivery)
 * @param {string|string[]} recipients - Single email or array of emails
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 */
export const sendEmail = async (recipients, subject, html) => {
  // Convert single email string to array
  const emails = Array.isArray(recipients) ? recipients : [recipients];

  for (const email of emails) {
    const mailOptions = {
      from: `"School Management" <ayushmatripathi2002@gmail.com>`,
      to: email, 
      subject,
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to: ${email}`);
    } catch (err) {
      console.error(`❌ Failed to send to ${email}:`, err.message);
    }

    // Optional delay (to avoid SMTP provider limits)
    await new Promise((resolve) => setTimeout(resolve, 200)); // 200ms delay
  }
};
