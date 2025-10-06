import nodemailer from "nodemailer";

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

//Send welcome to user
export async function sendWelcomeEmail(
  email: string,
  name: string,
  verificationToken: string
): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://bira-im.vercel.app";
  const verificationUrl = `${baseUrl}/verify?token=${verificationToken}`;

  console.log("📧 Preparing welcome email...");
  console.log("   To:", email);
  console.log("   Verification URL:", verificationUrl);
  console.log("   Resend API Key exists:", !!process.env.RESEND_API_KEY);

  try {
    await transporter.sendMail({
      from: "Bira'eem Learning <onboarding@resend.dev>",
      to: email,
      subject: "🌱 Welcome to bira'eem - Verify Your Email",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #fbf5ee;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #8b5e3c 0%, #5e3c15 100%);
                padding: 40px 20px;
                text-align: center;
              }
              .header h1 {
                color: #ffffff;
                margin: 0;
                font-size: 32px;
              }
              .content {
                padding: 40px 30px;
                color: #5c4033;
              }
              .content h2 {
                color: #8b5e3c;
                margin-bottom: 20px;
              }
              .button {
                display: inline-block;
                padding: 14px 32px;
                background: linear-gradient(135deg, #8b5e3c 0%, #5e3c15 100%);
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                margin: 20px 0;
              }
              .footer {
                background-color: #d5bfa8;
                padding: 20px;
                text-align: center;
                color: #7a5540;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🌱 Welcome to Bira'eem!</h1>
              </div>
              <div class="content">
                <h2>Hello ${name}! 👋</h2>
                <p>We're thrilled to have you join our learning community! Bira'eem is your personal learning companion, designed to make education fun and engaging.</p>
                
                <p><strong>Here's what awaits you:</strong></p>
                <ul>
                  <li>📚 Personalized lessons adapted to your pace</li>
                  <li>🤖 Buddy, your AI learning assistant</li>
                  <li>🏆 Achievements and XP to track your progress</li>
                  <li>🎯 Interactive quizzes to test your knowledge</li>
                </ul>

                <p>To get started, please verify your email address:</p>
                
                <div style="text-align: center;">
                  <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>

                <p style="margin-top: 30px; font-size: 14px; color: #7a5540;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="${verificationUrl}" style="color: #8b5e3c;">${verificationUrl}</a>
                </p>

                <p style="margin-top: 30px;">
                  Happy learning! 🎓<br>
                  <strong>The Bira'eem Team</strong>
                </p>
              </div>
              <div class="footer">
                <p>If you didn't create an account with Bira'eem, please ignore this email.</p>
                <p>© ${new Date().getFullYear()} Bira'eem Learning. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Welcome to Bira'eem, ${name}!

        We're thrilled to have you join our learning community!

        To get started, please verify your email address by clicking this link:
        ${verificationUrl}

        Happy learning!
        The Bira'eem Team

        If you didn't create an account with Bira'eem, please ignore this email.
      `,
    });

    console.log(`Welcome email sent to ${email}}`);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    throw error;
  }
}

//Send contact form submission notification
export async function sendContactFormEmail(
  name: string,
  email: string,
  message: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: "Bira'eem Contact Form <onboarding@resend.dev>",
      to: "eighthmudathir@gmail.com",
      replyTo: email,
      subject: `🌱 New Contact Form Submission from ${name}`,
      html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #fbf5ee;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    color: #8b5e3c;
                    border-bottom: 2px solid #d5bfa8;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .field {
                    margin-bottom: 20px;
                }
                .label {
                    font-weight: bold;
                    color: #5c4033;
                    margin-bottom: 5px;
                }
                .value {
                    color: #7a5540;
                    padding: 10px;
                    background-color: #fbf5ee;
                    border-radius: 4px;
                }
                </style>
            </head>
            <body>
                <div class="container">
                <div class="header">
                    <h2>New Contact Form Submission</h2>
                </div>
                
                <div class="field">
                    <div class="label">Name:</div>
                    <div class="value">${name}</div>
                </div>
                
                <div class="field">
                    <div class="label">Email:</div>
                    <div class="value">${email}</div>
                </div>
                
                <div class="field">
                    <div class="label">Message:</div>
                    <div class="value">${message}</div>
                </div>
                
                <p style="margin-top: 30px; font-size: 14px; color: #7a5540;">
                    Reply directly to this email to respond to ${name}.
                </p>
                </div>
            </body>
            </html>
        `,
    });
    console.log(`Contact form email sent from ${email}`);
  } catch (error) {
    console.error("Failed to send contact form email:", error);
    throw error;
  }
}
