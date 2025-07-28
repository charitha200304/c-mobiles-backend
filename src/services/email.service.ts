import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@cmobiles.com',
        to: options.to,
        subject: options.subject,
        html: options.html
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const subject = '🎉 Welcome to CMobiles!';
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Segoe UI', sans-serif;
                    background-color: #0f172a;
                    color: #e2e8f0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 40px 20px;
                    background-color: #1e293b;
                    border-radius: 10px;
                }
                h1 {
                    font-size: 28px;
                    font-weight: 600;
                    color: #ffffff;
                    margin-bottom: 20px;
                    text-align: center;
                }
                p {
                    font-size: 16px;
                    color: #cbd5e1;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                ul {
                    padding-left: 20px;
                    color: #94a3b8;
                }
                li {
                    margin-bottom: 10px;
                }
                .button {
                    display: block;
                    width: fit-content;
                    margin: 30px auto;
                    padding: 14px 28px;
                    background: linear-gradient(90deg, #6366f1, #8b5cf6);
                    color: white;
                    text-align: center;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 16px;
                }
                .footer {
                    text-align: center;
                    font-size: 14px;
                    color: #64748b;
                    margin-top: 40px;
                }
                a {
                    color: #818cf8;
                    text-decoration: none;
                }
                @media (max-width: 600px) {
                    .container {
                        padding: 30px 15px;
                    }
                    h1 {
                        font-size: 24px;
                    }
                    p {
                        font-size: 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>👋 Welcome, ${name}!</h1>
                <p>We're thrilled to have you join <strong>CMobiles</strong> — your go-to destination for the latest smartphones and accessories. 🎉</p>
                
                <p>Here's what you can do now: 🚀</p>
                <ul>
                    <li>🛍️ Explore and shop the newest devices</li>
                    <li>❤️ Save and manage your favorite products</li>
                    <li>🔥 Enjoy exclusive member-only offers</li>
                    <li>📦 Track your orders in real-time</li>
                </ul>

                <a href="${process.env.FRONTEND_URL || 'https://cmobiles.com'}/dashboard" class="button">🛒 Start Shopping</a>

                <p style="text-align:center;">Need help? 💬 <a href="${process.env.FRONTEND_URL || 'https://cmobiles.com'}/contact">Contact our support team</a></p>

                <div class="footer">
                    <p>© ${new Date().getFullYear()} CMobiles. All rights reserved.</p>
                    <p>📍 123 Mobile Street, Tech City, TC 12345</p>
                    <p>
                        <a href="#">Unsubscribe</a> | 
                        <a href="#">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </body>
        </html>`;

    return this.sendEmail({
      to: email,
      subject,
      html
    });
  }
}

export const emailService = new EmailService();
