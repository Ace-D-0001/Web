import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (login(username, password)) {
            navigate('/');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">User Login</h1>
                <p className="auth-subtitle">Welcome back to SynergyStack</p>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}
                    <div className="auth-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="usger"
                            required 
                        />
                    </div>
                    <div className="auth-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="password"
                            required 
                        />
                    </div>
                    <button type="submit" className="auth-btn">Login</button>
                </form>

                <div className="auth-links">
                    <Link to="/forgot-password">Forgot Password?</Link>
                    <Link to="/admin-login">Admin Access</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
