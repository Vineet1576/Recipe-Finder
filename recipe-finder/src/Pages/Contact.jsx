import React from 'react';
import '/public/contact.css';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';


function Contact() {
  const formFields = [
    { label: 'Full Name', type: 'text', id: 'name', name: 'name', required: true, placeholder: 'Enter your full name' },
    { label: 'Email Address', type: 'email', id: 'email', name: 'email', required: true, placeholder: 'Enter your email address' },
    { label: 'Subject', type: 'text', id: 'subject', name: 'subject', required: true, placeholder: 'Enter the subject of your message' },
    { label: 'Message', type: 'textarea', id: 'message', name: 'message', required: true, placeholder: '', rows: 5 },
  ];
  const contactDetails = [
    { icon: <FaEnvelope />, text: 'Email: hello@recipefinder.com' },
    { icon: <FaPhoneAlt />, text: 'Phone: (123) 456-7890' },
    { icon: <FaMapMarkerAlt />, text: 'Address: 123 Main St, Anytown, USA' },
  ];
  const socialLinks = [
    { icon: <FaFacebookF />, name: 'Facebook', url: 'https://www.facebook.com/recipefinder' },
    { icon: <FaTwitter />, name: 'Twitter', url: 'https://www.twitter.com/recipefinder' },
    { icon: <FaInstagram />, name: 'Instagram', url: 'https://www.instagram.com/recipefinder' },
    { icon: <FaLinkedin />, name: 'LinkedIn', url: 'https://www.linkedin.com/company/recipefinder' },
    { icon: <FaYoutube />, name: 'YouTube', url: 'https://www.youtube.com/channel/recipefinder' }
  ];

  return (
    <main>
      <section className="contact-header">
        <h1>Contact Us</h1>
        <p>
          "We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to reach out."
        </p>
      </section>
      <section className="contact-form">
        <div className="info-container">
          <div className="message">
            <h2>Send us a Message</h2>
            <span>
              📧 <strong>Demo Form:</strong> This is a sample contact form. In a real application, this would send your message to our team.
            </span>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const data = {};
              formFields.forEach(field => {
                data[field.name] = e.target[field.name].value;
              });
              try {
                const res = await axios.post('http://localhost:5000/api/contact', data);
                alert(res.data.message || 'Message sent!');
                e.target.reset();
              } catch (err) {
                alert(err.message);
              }
            }}>
              {formFields.map((field, idx) => (
                <React.Fragment key={field.id}>
                  <label htmlFor={field.id}>{field.label}</label>
                  {field.type !== 'textarea' ? (
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.name}
                      required={field.required}
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <textarea
                      id={field.id}
                      name={field.name}
                      rows={field.rows}
                      required={field.required}
                    ></textarea>
                  )}
                </React.Fragment>
              ))}
              <button type="submit">Send Message <FaPaperPlane /></button>
            </form>
          </div>
          <div className="contact-info">
            <div className="detailes">
              <h2>Contact Information</h2>
              <p>"If you have any questions, feel free to reach out to us via email or phone."</p>
              <ul>
                {contactDetails.map((detail, idx) => (
                  <li key={idx}>{detail.icon} {detail.text}</li>
                ))}
              </ul>
            </div>
            <div className="social-icon">
              <h2>Follow Us</h2>
              <ul>
                {socialLinks.map((link, idx) => (
                  <li key={link.name}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.icon} {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;