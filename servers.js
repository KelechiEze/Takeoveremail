require("dotenv").config(); // Load environment variables
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require("fs");

// Load email HTML content
const emailHTML = fs.readFileSync("index.html", "utf-8");

// Set up Google Sheets API client
const sheets = google.sheets("v4");

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Google Sheets API Authentication
async function authenticateGoogleSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json", // Path to your service account JSON credentials file
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const client = await auth.getClient();
  return client;
}

// Fetch email addresses from Google Sheets
async function getEmailAddresses() {
  const authClient = await authenticateGoogleSheets();
  const spreadsheetId = "1WJgmiGU7GApTLbC4MTqlhQxO5d6xg37QF758zAN7V0M"; // Replace with your Google Sheets ID
  const range = "Sheet1!A1:A3"; // Range to read emails from (adjust if needed)

  const response = await sheets.spreadsheets.values.get({
    auth: authClient,
    spreadsheetId: spreadsheetId,
    range: range,
  });

  return response.data.values ? response.data.values.map((row) => row[0]) : [];
}

// Function to send email to individual recipients
async function sendEmails() {
  const emails = await getEmailAddresses();

  for (let email of emails) {
    const mailOptions = {
      from: `"Global Harvest Church" <${process.env.EMAIL_USER}>`,
      to: email, // Send email to one recipient at a time
      subject: "Takeover at the Summit",
      html: emailHTML,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${email}: ${info.response}`);
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error);
    }
  }
}

// Send emails
sendEmails();
