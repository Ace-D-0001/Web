import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Navbar.css';
import reactLogo from '../assets/react.svg';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [brandName, setBrandName] = useState('SynergyStack');
    const { logout, isAdmin } = useAuth();

    useEffect(() => {
        fetchNavbarSettings();
    }, []);

    const fetchNavbarSettings = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/settings/navbar_config`);
            if (res.data?.brand) setBrandName(res.data.brand);
        } catch (err) {
            console.error('Navbar config fetch failed');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
                    <img src={reactLogo} alt="Logo" className="logo-icon" />
                    <span className="brand-name">{brandName} {isAdmin && <span className="admin-badge">(Admin)</span>}</span>
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
                    <li><button className="logout-btn" onClick={logout}>Logout</button></li>
                </ul>
            </div>
        </nav>
    );
};


export default Navbar;

