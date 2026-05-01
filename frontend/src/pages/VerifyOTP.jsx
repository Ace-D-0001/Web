import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const type = location.state?.type; // 'verification' or 'reset'

    // If there's no email in state, the user arrived here directly. Redirect them.
    useEffect(() => {
        if (!email || !type) {
            navigate('/signup');
        }
    }, [email, type, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/verify-otp`, { email, otp, type });

            if (type === 'verification') {
                // Account verified → go set a password
                navigate('/set-password', { state: { email } });
            } else {
                // Reset flow verified → go reset the password (pass otp for the final call)
                navigate('/reset-password', { state: { email, otp } });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired code. Please try again.');
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        try {
            if (type === 'verification') {
                await axios.post(`${import.meta.env.VITE_API_URL}/signup`, { email });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/forgot-password`, { email });
            }
            setError(''); // clear any error
            alert('A new code has been sent to your email.');
        } catch (err) {
            setError('Could not resend code. Please try again.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Enter OTP Code</h1>
                <p className="auth-subtitle">
                    We sent a 6-digit code to<br />
                    <strong style={{ color: '#fff' }}>{email}</strong>
                </p>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-group">
                        <label>6-Digit Code</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            style={{ textAlign: 'center', letterSpacing: '10px', fontSize: '1.6rem' }}
                            required
                            maxLength={6}
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading || otp.length !== 6}>
                        {loading ? 'Verifying...' : 'Verify Code'}
                    </button>
                </form>

                <div className="auth-links">
                    <button
                        type="button"
                        onClick={handleResend}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                        Didn't receive a code? <span style={{ color: '#646cff' }}>Resend</span>
                    </button>
                    <Link to={type === 'reset' ? '/forgot-password' : '/signup'}>Go Back</Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
