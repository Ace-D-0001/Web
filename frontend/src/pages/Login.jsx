import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, login, setToken, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!authLoading && user) {
            const target = user.role === 'admin' ? '/admin-dashboard' : '/home';
            navigate(target, { replace: true });
            return;
        }
        // Handle Google OAuth callback token
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const urlError = urlParams.get('error');

        if (token) {
            setToken(token).then((userData) => {
                const target = userData?.role === 'admin' ? '/admin/dashboard' : '/home';
                navigate(target);
            });
            return;
        }

        if (urlError) {
            setError(urlError);
        }

        // Show success message passed from other pages (e.g. after password reset)
        if (location.state?.message) {
            setSuccess(location.state.message);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(email, password);

        if (result.success) {
            if (result.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/home');
            }
        } else {
            setError(result.message || 'Login failed. Please try again.');
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to your account</p>

                {success && <div className="auth-success">{success}</div>}
                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="auth-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Your password"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-divider"><span>OR</span></div>

                <button type="button" className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                    Sign in with Google
                </button>

                <div className="auth-links">
                    <Link to="/signup">Don't have an account? <span>Sign Up</span></Link>
                    <Link to="/forgot-password">Forgot Password?</Link>
                    <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '12px 0' }} />
                    <Link to="/admin-login" style={{ opacity: 0.5, fontSize: '0.78rem' }}>Admin Access</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
