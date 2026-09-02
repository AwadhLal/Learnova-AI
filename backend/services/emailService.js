import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.EMAIL_USER !== 'demo@learnova.ai') {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return null;
};

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Learnova AI" <awadhpatel177@gmail.com>',
    to,
    subject,
    html,
  };

  if (!transporter) {
    console.log(`[EMAIL SERVICE LOG] Mock sending email to: ${to} | Subject: ${subject}`);
    return true;
  }

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email Sending Error:', error.message);
    return false;
  }
};

export const getWelcomeEmailTemplate = (name) => `
<div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; padding: 24px; border-radius: 8px; border: 1px solid #334155;">
    <h1 style="color: #6366f1; margin-bottom: 12px;">Welcome to Learnova AI, ${name}! 🚀</h1>
    <p style="font-size: 16px; line-height: 1.5; color: #cbd5e1;">
      We're thrilled to have you join our next-generation AI-powered learning platform. Learn smarter, master skills faster, and achieve your goals with personalized AI tutoring.
    </p>
    <div style="margin-top: 24px; padding: 16px; background-color: #0f172a; border-radius: 6px; border-left: 4px solid #6366f1;">
      <p style="margin: 0; font-weight: bold; color: #818cf8;">Quick Tip:</p>
      <p style="margin: 4px 0 0 0; color: #94a3b8;">Try out the AI Tutor inside any lesson to get step-by-step hints and instant explanations!</p>
    </div>
    <p style="margin-top: 24px; color: #64748b; font-size: 14px;">The Learnova AI Team</p>
  </div>
</div>
`;

export const getPaymentReceiptEmailTemplate = (name, courseTitle, amount, orderId) => `
<div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; padding: 24px; border-radius: 8px; border: 1px solid #334155;">
    <h2 style="color: #22c55e;">Payment Confirmed! 🎉</h2>
    <p style="color: #cbd5e1;">Hi ${name}, thank you for your enrollment.</p>
    <div style="background-color: #0f172a; padding: 16px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 4px 0; color: #94a3b8;"><strong>Course:</strong> ${courseTitle}</p>
      <p style="margin: 4px 0; color: #94a3b8;"><strong>Amount Paid:</strong> ₹${amount}</p>
      <p style="margin: 4px 0; color: #94a3b8;"><strong>Order ID:</strong> ${orderId}</p>
      <p style="margin: 4px 0; color: #94a3b8;"><strong>Status:</strong> Successful (Test Mode)</p>
    </div>
    <p style="color: #cbd5e1;">You now have full access to all course lessons, AI study tools, and quizzes.</p>
  </div>
</div>
`;

export const getVerificationEmailTemplate = (name, code) => `
<div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; padding: 24px; border-radius: 8px; border: 1px solid #334155;">
    <h1 style="color: #6366f1; margin-bottom: 12px;">Verify your email address</h1>
    <p style="font-size: 16px; line-height: 1.5; color: #cbd5e1;">
      Hi ${name},<br/><br/>
      Thank you for signing up for Learnova AI! Please use the following 6-digit verification code to complete your registration.
    </p>
    <div style="margin: 24px 0; padding: 16px; background-color: #0f172a; border-radius: 6px; text-align: center;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #818cf8;">${code}</span>
    </div>
    <p style="font-size: 14px; color: #94a3b8;">
      This code will expire in 5 minutes. If you did not request this, please ignore this email.
    </p>
    <p style="margin-top: 24px; color: #64748b; font-size: 14px;">Learnova AI<br/>Learn Smarter. Grow Faster.</p>
  </div>
</div>
`;

export const getPasswordResetEmailTemplate = (name, code) => `
<div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; padding: 24px; border-radius: 8px; border: 1px solid #334155;">
    <h1 style="color: #6366f1; margin-bottom: 12px;">Reset your password</h1>
    <p style="font-size: 16px; line-height: 1.5; color: #cbd5e1;">
      Hi ${name},<br/><br/>
      We received a request to reset your password. Use the 6-digit code below to proceed:
    </p>
    <div style="margin: 24px 0; padding: 16px; background-color: #0f172a; border-radius: 6px; text-align: center;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #818cf8;">${code}</span>
    </div>
    <p style="font-size: 14px; color: #94a3b8;">
      This code will expire in 5 minutes. For security reasons, do not share this code with anyone.
    </p>
    <p style="margin-top: 24px; color: #64748b; font-size: 14px;">Learnova AI<br/>Learn Smarter. Grow Faster.</p>
  </div>
</div>
`;

export const getPasswordResetConfirmationTemplate = (name) => `
<div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; padding: 24px; border-radius: 8px; border: 1px solid #334155;">
    <h1 style="color: #22c55e; margin-bottom: 12px;">Password Updated Successfully! 🎉</h1>
    <p style="font-size: 16px; line-height: 1.5; color: #cbd5e1;">
      Hi ${name},<br/><br/>
      Your password has been successfully reset. You can now log in using your new password.
    </p>
    <p style="font-size: 14px; color: #94a3b8; margin-top: 16px;">
      If you did not make this change, please contact our support team immediately.
    </p>
    <p style="margin-top: 24px; color: #64748b; font-size: 14px;">Learnova AI<br/>Learn Smarter. Grow Faster.</p>
  </div>
</div>
`;
