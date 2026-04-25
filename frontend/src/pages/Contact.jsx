import { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Message sent by ${name}!`);
        setName('');
        setMessage('');
    };

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
                                <span className="info-value">123 Tech Avenue, Silicon Valley, CA</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">📧</div>
                            <div className="info-details">
                                <span className="info-label">Email Us</span>
                                <span className="info-value">support@synergystack.com</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">📞</div>
                            <div className="info-details">
                                <span className="info-label">Call Us</span>
                                <span className="info-value">+1 (555) SYNERGY</span>
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
                    <h2 className="about-title">About SynergyStack</h2>
                    <div className="about-divider"></div>
                    <p className="about-description">
                        Founded in 2026, SynergyStack is a global leader in high-performance developer ecosystems. 
                        We specialize in bridging the gap between cutting-edge hardware and the most stable 
                        software frameworks like React and Laravel.
                    </p>
                    <p className="about-description">
                        Our mission is to empower developers with the tools they need to build secure, 
                        scalable, and beautiful digital experiences without compromise. We believe in the 
                        power of synergy—where the combined effect of our technologies is greater than 
                        the sum of their parts.
                    </p>
                </div>
            </section>
        </div>
    );
};


export default Contact;
