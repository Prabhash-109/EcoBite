const nodemailer = require('nodemailer');

// Create reusable transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection on startup
transporter.verify()
  .then(() => console.log('📧 Email service connected successfully!'))
  .catch((err) => console.error('❌ Email service error:', err.message));

/**
 * Send an email notification
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML email body
 */
const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"EcoBite 🌱" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    // Don't throw - email failure shouldn't break the main flow
    return null;
  }
};

// ============ EMAIL TEMPLATES ============

/**
 * Welcome email on registration
 */
const sendWelcomeEmail = (to, name, role) => {
  const roleLabel = role === 'restaurant' ? '🍽️ Restaurant Partner' : role === 'ngo' ? '🤝 NGO Partner' : '🚚 Volunteer';
  
  return sendMail(to, `Welcome to EcoBite, ${name}! 🌱`, `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; color: #fff;">🌱 Welcome to EcoBite!</h1>
        <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Together, we reduce food waste.</p>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 18px; color: #e5e7eb;">Hi <strong style="color: #10b981;">${name}</strong>,</p>
        <p style="color: #9ca3af; line-height: 1.6;">Your account has been successfully created as a <strong style="color: #fff;">${roleLabel}</strong>.</p>
        <div style="background: #111; border: 1px solid #222; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="color: #9ca3af; margin: 0;">You can now log in and start ${
            role === 'restaurant' ? 'listing surplus food donations' :
            role === 'ngo' ? 'browsing and claiming food near you' :
            'accepting delivery assignments'
          }.</p>
        </div>
        <p style="color: #6b7280; font-size: 13px; margin-top: 30px;">— The EcoBite Team</p>
      </div>
    </div>
  `);
};

/**
 * Email to NGO when restaurant accepts their request
 */
const sendRequestAcceptedEmail = (ngoEmail, ngoName, restaurantName, foodName) => {
  return sendMail(ngoEmail, `✅ Your food request has been accepted!`, `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; color: #fff;">✅ Request Accepted!</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 18px; color: #e5e7eb;">Hi <strong style="color: #10b981;">${ngoName}</strong>,</p>
        <p style="color: #9ca3af; line-height: 1.6;">Great news! <strong style="color: #fff;">${restaurantName}</strong> has accepted your request for:</p>
        <div style="background: #111; border: 1px solid #222; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
          <p style="font-size: 22px; font-weight: bold; color: #fff; margin: 0;">🍱 ${foodName}</p>
        </div>
        <p style="color: #9ca3af; line-height: 1.6;">Head to your dashboard to assign a volunteer for pickup.</p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 30px;">— The EcoBite Team</p>
      </div>
    </div>
  `);
};

/**
 * Email to NGO & restaurant when delivery is completed
 */
const sendDeliveryCompletedEmail = (to, recipientName, volunteerName, foodName, fromRestaurant, toNgo) => {
  return sendMail(to, `🎉 Delivery completed — ${foodName}`, `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; color: #fff;">🎉 Delivery Completed!</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 18px; color: #e5e7eb;">Hi <strong style="color: #10b981;">${recipientName}</strong>,</p>
        <p style="color: #9ca3af; line-height: 1.6;">The delivery has been successfully completed:</p>
        <div style="background: #111; border: 1px solid #222; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; color: #9ca3af; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #6b7280;">Food Item</td><td style="padding: 6px 0; color: #fff; font-weight: bold;">${foodName}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Restaurant</td><td style="padding: 6px 0; color: #fff;">${fromRestaurant}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Delivered To</td><td style="padding: 6px 0; color: #fff;">${toNgo}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Volunteer</td><td style="padding: 6px 0; color: #10b981; font-weight: bold;">${volunteerName}</td></tr>
          </table>
        </div>
        <p style="color: #9ca3af;">Thank you for helping reduce food waste! 🌍</p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 30px;">— The EcoBite Team</p>
      </div>
    </div>
  `);
};

module.exports = {
  sendMail,
  sendWelcomeEmail,
  sendRequestAcceptedEmail,
  sendDeliveryCompletedEmail
};
