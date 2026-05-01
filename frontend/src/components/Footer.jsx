import { useState, useEffect } from 'react';
import axios from 'axios';
import './Footer.css';

const Footer = () => {
    const [config, setConfig] = useState({
        brand: 'SynergyStack',
        about_text: 'Building the future of full-stack development with React and Laravel.',
        copyright: 'SynergyStack. All rights reserved.',
        contact: { email: 'info@synergystack.com', phone: '+1 (555) 000-0000', address: '123 Tech Avenue, CA' },
        social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' }
    });

    useEffect(() => {
        fetchFooterSettings();
    }, []);

    const fetchFooterSettings = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/settings/footer_config`);
            if (res.data) setConfig(prev => ({ ...prev, ...res.data }));
        } catch (err) {
            console.error('Footer config fetch failed');
        }
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section about">
                    <h3 className="footer-title">{config.brand}</h3>
                    <p className="footer-text">{config.about_text}</p>
                    <div className="social-links">
                        {config.social?.facebook && <a href={config.social.facebook} className="social-icon">FB</a>}
                        {config.social?.twitter && <a href={config.social.twitter} className="social-icon">TW</a>}
                        {config.social?.linkedin && <a href={config.social.linkedin} className="social-icon">LI</a>}
                        {config.social?.instagram && <a href={config.social.instagram} className="social-icon">IG</a>}
                    </div>
                </div>

                <div className="footer-section links">
                    <h3 className="footer-title">Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                    </ul>
                </div>

                <div className="footer-section contact-info">
                    <h3 className="footer-title">Contact Us</h3>
                    <p className="footer-text">Email: {config.contact?.email}</p>
                    <p className="footer-text">Phone: {config.contact?.phone}</p>
                    <p className="footer-text">Address: {config.contact?.address}</p>
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
                <p>&copy; {new Date().getFullYear()} {config.copyright}</p>
            </div>
        </footer>
    );
};

export default Footer;
