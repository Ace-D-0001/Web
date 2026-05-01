import { useState, useEffect } from 'react';
import axios from 'axios';
import './Footer.css';

const Footer = () => {
    const [copyright, setCopyright] = useState('SynergyStack. All rights reserved.');

    useEffect(() => {
        fetchFooterSettings();
    }, []);

    const fetchFooterSettings = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/settings/footer_config`);
            if (res.data?.copyright) setCopyright(res.data.copyright);
        } catch (err) {
            console.error('Footer config fetch failed');
        }
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section about">
                    <h3 className="footer-title">SynergyStack</h3>
                    <p className="footer-text">
                        Building the future of full-stack development with React and Laravel. 
                        Premium solutions for modern digital challenges.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-icon" aria-label="Facebook">FB</a>
                        <a href="#" className="social-icon" aria-label="Twitter">TW</a>
                        <a href="#" className="social-icon" aria-label="LinkedIn">LI</a>
                        <a href="#" className="social-icon" aria-label="Instagram">IG</a>
                    </div>
                </div>

                <div className="footer-section links">
                    <h3 className="footer-title">Quick Links</h3>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#team-members">Team Members</a></li>
                        <li><a href="#contact">Contact</a></li>
                        <li><a href="#privacy">Privacy Policy</a></li>
                    </ul>
                </div>

                <div className="footer-section contact-info">
                    <h3 className="footer-title">Contact Us</h3>
                    <p className="footer-text">Email: info@synergystack.com</p>
                    <p className="footer-text">Phone: +1 (555) 000-0000</p>
                    <p className="footer-text">Address: 123 Tech Avenue, Silicon Valley, CA</p>
                </div>

                <div className="footer-section map">
                    <h3 className="footer-title">Our Location</h3>
                    <div className="map-wrapper">
                        <iframe 
                            title="Office Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.6282977645198!2d-122.0837484846922!3d37.42199987982519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba02425dad8f%3A0x6c296c66619367e0!2sGoogleplex!5e0!3m2!1sen!2sus!4v1634567890123!5m2!1sen!2sus" 
                            width="100%" 
                            height="150" 
                            style={{ border: 0, borderRadius: '8px' }} 
                            allowFullScreen="" 
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} {copyright}</p>
            </div>
        </footer>
    );
};

export default Footer;
