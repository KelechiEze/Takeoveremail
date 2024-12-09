require("dotenv").config(); // Load environment variables
const nodemailer = require("nodemailer");
const fs = require("fs");

// Read the HTML file
const emailHTML = fs.readFileSync("index.html", "utf-8");

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email options
const mailOptions = {
  from: '"Global Harvest Church" <' + process.env.EMAIL_USER + '>',
  to: "kelechieze2000@gmail.com", // Replace with the recipient's email
  subject: "Takeover at the Summit",
  html: emailHTML,
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email:", error);
  } else {
    console.log("Email sent successfully:", info.response);
  }
});
