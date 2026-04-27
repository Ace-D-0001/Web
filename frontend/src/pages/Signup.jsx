import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/signup`, { email });
            setMessage(response.data.message);
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Enter your Gmail to receive a verification link</p>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}
                    {message && <div className="auth-success" style={{ color: '#28a745', marginBottom: '15px', textAlign: 'center' }}>{message}</div>}
                    
                    <div className="auth-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="yourname@gmail.com"
                            required 
                            disabled={loading}
                        />
                    </div>
                    
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Sending link...' : 'Send Verification Link'}
                    </button>
                </form>

                <div className="auth-links">
                    <Link to="/login">Already have an account? Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
