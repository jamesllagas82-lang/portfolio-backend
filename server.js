const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* -----------------------------
   OWNER EMAIL TEMPLATE (YOU)
   MAGENTA PROFESSIONAL THEME
------------------------------*/
function createOwnerTemplate({ name, email, subject, message }) {
  return `
  <div style="font-family: Arial; background:#f5f5f5; padding:30px;">
    <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

      <!-- HEADER -->
      <div style="background:linear-gradient(135deg,#9d174d,#7a0c3a);padding:20px;text-align:center;color:white;">
        <h1 style="margin:0;font-size:20px;">📩 New Portfolio Message</h1>
      </div>

      <!-- CONTENT -->
      <div style="padding:20px;">
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>

        <hr style="border:1px solid #eee;" />

        <h3 style="color:#9d174d;">Message</h3>

        <div style="background:#f5f5f5;padding:12px;border-left:4px solid #9d174d;">
          ${message}
        </div>
      </div>

    </div>
  </div>
  `;
}

/* -----------------------------
   AUTO REPLY TEMPLATE (USER)
------------------------------*/
function createAutoReplyTemplate({ name, subject }) {
  return `
  <div style="font-family: Arial; background:#f5f5f5; padding:30px;">
    <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

      <!-- HEADER -->
      <div style="background:linear-gradient(135deg,#9d174d,#7a0c3a);padding:20px;text-align:center;color:white;">
        <h1 style="margin:0;font-size:20px;">🚀 Message Received</h1>
      </div>

      <!-- CONTENT -->
      <div style="padding:20px; color:#333;">

        <h2 style="color:#9d174d;">Hi ${name},</h2>

        <p>Thanks for reaching out through my portfolio.</p>

        <p>I’ve received your message about:</p>

        <div style="background:#f5f5f5;border-left:4px solid #9d174d;padding:10px;margin:10px 0;">
          ${subject}
        </div>

        <p>I’ll get back to you as soon as possible.</p>

        <hr style="border:1px solid #eee;" />

        <p style="font-size:12px;color:#888;">
          This is an automated response — no need to reply.
        </p>

        <p style="color:#9d174d;font-weight:bold;">
          — James Charles M. Llagas
        </p>

      </div>

    </div>
  </div>
  `;
}

/* -----------------------------
   CONTACT ROUTE
------------------------------*/
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    /* -----------------------------
       1. EMAIL TO YOU
    ------------------------------*/
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `[Portfolio] ${subject}`,
      html: createOwnerTemplate({
        name,
        email,
        subject,
        message,
      }),
    });

    /* -----------------------------
       2. AUTO REPLY TO USER
    ------------------------------*/
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thanks for reaching out 🚀",
      html: createAutoReplyTemplate({
        name,
        subject,
      }),
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });

  } catch (err) {
    console.error("EMAIL ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});

/* -----------------------------
   START SERVER
------------------------------*/
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});