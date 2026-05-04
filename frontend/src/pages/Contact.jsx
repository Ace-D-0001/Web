import { useState, useEffect } from 'react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [contactInfo, setContactInfo] = useState({
        address: '123 Tech Avenue, Silicon Valley, CA',
        email: 'support@synergystack.com',
        phone: '+1 (555) SYNERGY'
    });
    const [aboutInfo, setAboutInfo] = useState({
        title: 'About SynergyStack',
        description: 'Founded in 2026, SynergyStack is a global leader in high-performance developer ecosystems. We specialize in bridging the gap between cutting-edge hardware and the most stable software frameworks like React and Laravel.'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [contactRes, aboutRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/settings/contact_info`),
                    axios.get(`${import.meta.env.VITE_API_URL}/settings/about_info`)
                ]);
                if (contactRes.data) setContactInfo(contactRes.data);
                if (aboutRes.data) setAboutInfo(aboutRes.data);
            } catch (err) {
                console.error('Failed to fetch contact/about settings');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/inquiries`, {
                email: email,
                message: `From ${name}: ${message}`
            });
            alert(`Thank you ${name}, your message has been sent!`);
            setName('');
            setEmail('');
            setMessage('');
        } catch (err) {
            alert('Failed to send message. Please try again.');
        }
    };

    if (loading) return <div className="loading-state">Loading contact information...</div>;

    return (
        <div className="contact-page">
            <header className="page-header">
                <h1 className="page-title">Get In Touch</h1>
                <p className="page-subtitle">We are here to help and answer any question you might have.</p>
            </header>

            <div className="contact-main-grid">
                <div className="contact-info-section">
                    <h2 className="section-title">Contact Information</h2>
                    <p className="section-description">Reach out to us through any of these channels.</p>
                    
                    <div className="contact-info-list">
                        <div className="info-item">
                            <div className="info-icon">📍</div>
                            <div className="info-details">
                                <span className="info-label">Our Office</span>
                                <span className="info-value">{contactInfo.address}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">📧</div>
                            <div className="info-details">
                                <span className="info-label">Email Us</span>
                                <span className="info-value">{contactInfo.email}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">📞</div>
                            <div className="info-details">
                                <span className="info-label">Call Us</span>
                                <span className="info-value">{contactInfo.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="message-section">
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <h2 className="form-title">Send a Message</h2>
                        <div className="form-group">
                            <label htmlFor="name">Your Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="Enter your name"
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Your Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Enter your email"
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea 
                                id="message" 
                                rows="5" 
                                value={message} 
                                onChange={(e) => setMessage(e.target.value)} 
                                placeholder="How can we help you?"
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="submit-btn">Send Message</button>
                    </form>
                </div>
            </div>

            <section className="about-us-bottom">
                <div className="about-content">
                    <h2 className="about-title">{aboutInfo.title}</h2>
                    <div className="about-divider"></div>
                    <p className="about-description" style={{ whiteSpace: 'pre-line' }}>
                        {aboutInfo.description}
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Contact;
