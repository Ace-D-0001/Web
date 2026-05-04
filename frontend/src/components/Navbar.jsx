import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Navbar.css';
import reactLogo from '../assets/react.svg';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState({ brand: 'SynergyStack', logo_url: '' });
    const [unreadCount, setUnreadCount] = useState(0);
    const { logout, isAdmin, user } = useAuth();

    useEffect(() => {
        fetchNavbarSettings();
        fetchNotifications();
    }, [user]);

    const fetchNotifications = async () => {
        if (user) {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/notifications/unread-count`);
                setUnreadCount(res.data.count);
            } catch (err) {
                console.error('Failed to fetch notification count');
            }
        }
    };

    const fetchNavbarSettings = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/settings/navbar_config`);
            if (res.data) setConfig(res.data);
        } catch (err) {
            console.error('Navbar config fetch failed');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
                    <img src={config.logo_url || reactLogo} alt="Logo" className="logo-icon" />
                    <span className="brand-name">{config.brand} {isAdmin && <span className="admin-badge">(Admin)</span>}</span>
                </Link>

                <button 
                    className={`menu-toggle ${isOpen ? 'active' : ''}`} 
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation"
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>

                <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
                    <li><Link to="/home" onClick={() => setIsOpen(false)}>Home</Link></li>
                    <li><Link to="/team-members" onClick={() => setIsOpen(false)}>Team Members</Link></li>
                    <li><Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
                    {!isAdmin && (
                        <li>
                            <Link to="/orders" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                My Orders
                                {unreadCount > 0 && (
                                    <span style={{
                                        background: '#ef4444', color: 'white', borderRadius: '50%', 
                                        padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold'
                                    }}>
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>
                        </li>
                    )}
                    <li><button className="logout-btn" onClick={logout}>Logout</button></li>
                </ul>
            </div>
        </nav>
    );
};


export default Navbar;

