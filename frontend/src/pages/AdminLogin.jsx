import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { adminLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (adminLogin(username, password)) {
            navigate('/');
        } else {
            setError('Invalid Admin credentials');
        }
    };

    return (
        <div className="auth-page admin-theme">
            <div className="auth-card">
                <h1 className="auth-title">Admin Terminal</h1>
                <p className="auth-subtitle">Elevated Access Required</p>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}
                    <div className="auth-group">
                        <label>Admin Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="admin"
                            required 
                        />
                    </div>
                    <div className="auth-group">
                        <label>Admin Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="admin123"
                            required 
                        />
                    </div>
                    <button type="submit" className="auth-btn admin-btn">Access Dashboard</button>
                </form>

                <div className="auth-links">
                    <Link to="/login">User Login</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
