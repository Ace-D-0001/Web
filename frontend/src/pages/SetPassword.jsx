import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const SetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/set-password`, {
                token,
                password,
                password_confirmation: passwordConfirmation
            });
            alert('Password set successfully! You can now login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired token.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Set Password</h1>
                <p className="auth-subtitle">Choose a secure password to activate your account</p>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}
                    
                    <div className="auth-group">
                        <label>New Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Min 8 characters"
                            required 
                            minLength={8}
                            disabled={loading}
                        />
                    </div>

                    <div className="auth-group">
                        <label>Confirm Password</label>
                        <input 
                            type="password" 
                            value={passwordConfirmation} 
                            onChange={(e) => setPasswordConfirmation(e.target.value)} 
                            placeholder="Repeat password"
                            required 
                            disabled={loading}
                        />
                    </div>
                    
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Activating Account...' : 'Set Password & Activate'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetPassword;
