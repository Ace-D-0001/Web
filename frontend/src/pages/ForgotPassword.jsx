import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Reset Password</h1>
                
                {!submitted ? (
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <p className="auth-subtitle">Enter your email to receive a reset link</p>
                        <div className="auth-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="your@email.com"
                                required 
                            />
                        </div>
                        <button type="submit" className="auth-btn">Send Link</button>
                    </form>
                ) : (
                    <div className="auth-success">
                        <p>If an account exists for {email}, you will receive a reset link shortly.</p>
                        <Link to="/login" className="auth-btn" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                            Back to Login
                        </Link>
                    </div>
                )}

                <div className="auth-links">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
