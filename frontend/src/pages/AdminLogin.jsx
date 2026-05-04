import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, adminLogin, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && user?.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [user, authLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await adminLogin(email, password);
        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.message);
            setLoading(false);
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
                        <label>Admin Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="admin@example.com"
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div className="auth-group">
                        <label>Admin Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••"
                            required 
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="auth-btn admin-btn" disabled={loading}>
                        {loading ? 'Accessing...' : 'Access Dashboard'}
                    </button>
                </form>

                <div className="auth-links">
                    <Link to="/login">User Login</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
