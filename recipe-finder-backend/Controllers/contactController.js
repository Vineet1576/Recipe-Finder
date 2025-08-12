const nodemailer = require('nodemailer');
const ContactMessage = require('../Models/ContactMessage');

exports.sendContactMessage = async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        // Save to DB
        const savedMsg = await ContactMessage.create({ name, email, subject, message });

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "vineetrana1576@gmail.com",
                pass: "btke lqrv vmso fazj"
            },
        });
        await transporter.sendMail({
            from: email,
            to: "vineetrana1806@gmail.com",
            subject: `Contact Form: ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            html: `<p><strong>Name:</strong> ${name}<br/><strong>Email:</strong> ${email}<br/><strong>Message:</strong> ${message}</p>`
        });
        res.json({ message: 'Message sent and saved successfully!' });
    } catch (error) {
        console.error('Contact form error:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
};
// ===============================================
// File: controllers/contactController.js
// Description: Logic for handling contact form submission.
// ===============================================

// @desc    Submit a contact form and send an email
// @route   POST /api/contact
// @access  Public
exports.sendContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Simple validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'recipient@example.com', // Replace with the email you want to receive the messages
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <h2>New Message from Contact Form</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    // Send the email using the transporter from the server.js middleware
    await req.transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
};