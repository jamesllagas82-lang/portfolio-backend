const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `[Portfolio Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; padding: 20px;">
          <h2 style="color: #2563eb;">New Portfolio Contact Request</h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px;"><strong>Name:</strong></td>
              <td style="padding: 8px;">${name}</td>
            </tr>

            <tr>
              <td style="padding: 8px;"><strong>Email:</strong></td>
              <td style="padding: 8px;">${email}</td>
            </tr>

            <tr>
              <td style="padding: 8px;"><strong>Subject:</strong></td>
              <td style="padding: 8px;">${subject}</td>
            </tr>
          </table>

          <hr style="margin: 20px 0;" />

          <h3>Message</h3>

          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
            ${message}
          </div>

          <hr style="margin: 20px 0;" />

          <p style="color: #666;">
            This message was sent from your portfolio website.
          </p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000")
})