import '/public/index.css';
import { FaFacebookF, FaInstagram, FaPinterestP, FaTwitter, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import { useState } from 'react';

function Footer() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            setMessage('');
            return;
        }
        setMessage('✅ Subscribed successfully!');
        setError('');
        setEmail('');
    };

    return (
        <footer>
            <h2>📧 Get Weekly Recipe Inspiration</h2>
            <p className="newsletter-tagline">Join 100,000+ subscribers and never run out of meal ideas</p>
            <form className="newsletter-signup" autoComplete="off" onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email-input"
                    placeholder="Enter your email address"
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" id="subscribe-button">Subscribe</button>
                {error && <p className="privacy-note" style={{ color: '#ffb3b3' }}>{error}</p>}
                {message && <p className="privacy-note" style={{ color: '#c4f0c5' }}>{message}</p>}
                {!message && !error && <p className="privacy-note">No spam, unsubscribe anytime. We respect your privacy.</p>}
            </form>

            <div className="footer-links">
                <a href="/about.html">About Us</a>
                <span className="link-separator">|</span>
                <a href="/blog.html">Blog</a>
                <span className="link-separator">|</span>
                <a href="/faq.html">FAQs</a>
                <span className="link-separator">|</span>
                <a href="/privacy-policy.html">Privacy Policy</a>
                <span className="link-separator">|</span>
                <a href="/terms-of-service.html">Terms of Service</a>
                <span className="link-separator">|</span>
                <a href="/contact.html">Contact Us</a>
            </div>

            <div className="social-links">
                <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                <a href="#" aria-label="Instagram"><FaInstagram /></a>
                <a href="#" aria-label="Pinterest"><FaPinterestP /></a>
                <a href="#" aria-label="Twitter"><FaTwitter /></a>
                <a href="#" aria-label="YouTube"><FaYoutube /></a>
                <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>

            <p className="copyright">&copy; 2025 Recipe Finder. All rights reserved.</p>
        </footer>
    );
}

export default Footer;
