import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [stats, setStats] = useState({ users: 0, products: 0, inquiries: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial data fetch
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [u, p, i] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/admin/users`),
                axios.get(`${import.meta.env.VITE_API_URL}/admin/products`),
                axios.get(`${import.meta.env.VITE_API_URL}/admin/inquiries`)
            ]);
            setStats({
                users: u.data.length,
                products: p.data.length,
                inquiries: i.data.length
            });
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch dashboard stats', err);
            setLoading(false);
        }
    };

    if (loading) return <div className="admin-loading">Loading Dashboard...</div>;

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-logo">AdminPanel</div>
                <nav className="sidebar-nav">
                    <button 
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        👥 Users
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'cards' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cards')}
                    >
                        🎴 Card Management
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
                        onClick={() => setActiveTab('messages')}
                    >
                        📩 Inquiries
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        ⚙️ Site Settings
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button className="nav-item" onClick={() => window.location.href = '/'}>
                        🌐 View Website
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {activeTab === 'users' && <UsersSection />}
                {activeTab === 'cards' && <CardsSection />}
                {activeTab === 'messages' && <MessagesSection />}
                {activeTab === 'settings' && <SettingsSection />}
            </main>
        </div>
    );
};

/* --- SUB-SECTIONS --- */

const UsersSection = () => {
    const [users, setUsers] = useState([]);
    
    useEffect(() => { fetchUsers(); }, []);
    
    const fetchUsers = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`);
        setUsers(res.data);
    };

    const updateStatus = async (id, status) => {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/users/${id}/status`, { status });
        fetchUsers();
    };

    const toggleRole = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/users/${id}/role`, { role: newRole });
        fetchUsers();
    };

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await axios.delete(`${import.meta.env.VITE_API_URL}/admin/users/${id}`);
            fetchUsers();
        }
    };

    return (
        <div className="section">
            <header className="content-header">
                <h1>User Management</h1>
            </header>
            <div className="data-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} className="table-avatar" />
                                        {u.name}
                                    </div>
                                </td>
                                <td>{u.email}</td>
                                <td>
                                    <button 
                                        className={`badge badge-admin`} 
                                        onClick={() => toggleRole(u.id, u.role)}
                                        style={{ cursor: 'pointer', border: 'none' }}
                                        title="Click to toggle role"
                                    >
                                        {u.role}
                                    </button>
                                </td>
                                <td><span className={`badge badge-${u.status}`}>{u.status}</span></td>
                                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button className="action-btn" onClick={() => updateStatus(u.id, 'active')} title="Approve">✅</button>
                                        <button className="action-btn" onClick={() => updateStatus(u.id, 'rejected')} title="Reject">❌</button>
                                        <button className="action-btn" onClick={() => updateStatus(u.id, 'pending')} title="Set Pending">⏳</button>
                                        <button className="action-btn" onClick={() => deleteUser(u.id)} title="Delete" style={{ color: '#ef4444' }}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const CardsSection = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentCard, setCurrentCard] = useState({ 
        title: '', 
        price: '', 
        description: '', 
        image_url: '', 
        gallery: [], 
        specs: [] 
    });

    useEffect(() => { fetchCards(); }, []);

    const fetchCards = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/products`);
        setProducts(res.data);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            ...currentCard,
            gallery: typeof currentCard.gallery === 'string' ? currentCard.gallery.split(',').map(s => s.trim()).filter(s => s) : currentCard.gallery,
            specs: typeof currentCard.specs === 'string' ? currentCard.specs.split('\n').map(s => s.trim()).filter(s => s) : currentCard.specs
        };

        if (currentCard.id) {
            await axios.put(`${import.meta.env.VITE_API_URL}/admin/products/${currentCard.id}`, payload);
        } else {
            await axios.post(`${import.meta.env.VITE_API_URL}/admin/products`, payload);
        }
        setShowModal(false);
        fetchCards();
    };

    const togglePause = async (id) => {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/products/${id}/toggle-pause`);
        fetchCards();
    };

    const deleteCard = async (id) => {
        if (window.confirm('Delete this card?')) {
            await axios.delete(`${import.meta.env.VITE_API_URL}/admin/products/${id}`);
            fetchCards();
        }
    };

    return (
        <div className="section">
            <header className="content-header">
                <h1>Product/Service Cards</h1>
                <button className="action-btn btn-primary" onClick={() => { 
                    setCurrentCard({ title: '', price: '', description: '', image_url: '', gallery: '', specs: '' }); 
                    setShowModal(true); 
                }}>
                    + Add New Card
                </button>
            </header>

            <div className="cards-grid">
                {products.map(p => (
                    <div key={p.id} className={`admin-product-card ${p.is_paused ? 'paused-overlay' : ''}`}>
                        <img src={p.image_url || 'https://via.placeholder.com/300x180?text=No+Image'} className="card-img-preview" />
                        <div className="card-body">
                            <h3>{p.title}</h3>
                            <p style={{ color: 'var(--admin-primary)', fontWeight: '600' }}>{p.price || 'N/A'}</p>
                            <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.9rem', margin: '8px 0' }}>{p.description}</p>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                <button className="action-btn" onClick={() => { 
                                    setCurrentCard({
                                        ...p,
                                        gallery: p.gallery ? p.gallery.join(', ') : '',
                                        specs: p.specs ? p.specs.join('\n') : ''
                                    }); 
                                    setShowModal(true); 
                                }}>Edit</button>
                                <button className="action-btn" onClick={() => togglePause(p.id)}>{p.is_paused ? '▶️ Resume' : '⏸️ Pause'}</button>
                                <button className="action-btn" onClick={() => deleteCard(p.id)} style={{ color: '#ef4444' }}>🗑️</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2>{currentCard.id ? 'Edit Card' : 'Create New Card'}</h2>
                        <form onSubmit={handleSave}>
                            <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input className="form-control" value={currentCard.title} onChange={e => setCurrentCard({...currentCard, title: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Price (e.g. $299)</label>
                                    <input className="form-control" value={currentCard.price} onChange={e => setCurrentCard({...currentCard, price: e.target.value})} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Main Image URL</label>
                                <input className="form-control" value={currentCard.image_url} onChange={e => setCurrentCard({...currentCard, image_url: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Gallery Images (Comma separated URLs)</label>
                                <textarea className="form-control" rows="2" value={currentCard.gallery} onChange={e => setCurrentCard({...currentCard, gallery: e.target.value})} placeholder="url1, url2, url3" />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea className="form-control" rows="3" value={currentCard.description} onChange={e => setCurrentCard({...currentCard, description: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Specifications (One per line)</label>
                                <textarea className="form-control" rows="4" value={currentCard.specs} onChange={e => setCurrentCard({...currentCard, specs: e.target.value})} placeholder="16GB RAM&#10;2TB SSD" />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="action-btn btn-primary">Save Changes</button>
                                <button type="button" className="action-btn" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const MessagesSection = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => { fetchMessages(); }, []);

    const fetchMessages = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/inquiries`);
        setMessages(res.data);
    };

    const deleteMsg = async (id) => {
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/inquiries/${id}`);
        fetchMessages();
    };

    return (
        <div className="section">
            <header className="content-header">
                <h1>User Inquiries</h1>
            </header>
            <div className="data-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Product Interest</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map(m => (
                            <tr key={m.id}>
                                <td>{m.email}</td>
                                <td><span className="badge badge-admin">{m.product?.title || 'General'}</span></td>
                                <td style={{ maxWidth: '300px' }}>{m.message}</td>
                                <td>{new Date(m.created_at).toLocaleDateString()}</td>
                                <td><button className="action-btn" onClick={() => deleteMsg(m.id)}>Archive</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SettingsSection = () => {
    const [settings, setSettings] = useState({ 
        navbar: { brand: 'Nusrat', links: [] }, 
        footer: { copyright: '© 2026', text: '' } 
    });

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/settings`);
        if (res.data.navbar_config) setSettings(prev => ({ ...prev, navbar: res.data.navbar_config }));
        if (res.data.footer_config) setSettings(prev => ({ ...prev, footer: res.data.footer_config }));
    };

    const saveSettings = async (key, value) => {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/settings/${key}`, { value });
        alert(`${key} updated!`);
    };

    return (
        <div className="section">
            <header className="content-header">
                <h1>Platform Customization</h1>
            </header>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Navbar Customization</h3>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Brand Name</label>
                        <input className="form-control" value={settings.navbar.brand} onChange={e => setSettings({...settings, navbar: {...settings.navbar, brand: e.target.value}})} />
                    </div>
                    <button className="action-btn btn-primary" onClick={() => saveSettings('navbar_config', settings.navbar)}>Update Navbar</button>
                </div>

                <div className="stat-card">
                    <h3>Footer Customization</h3>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Copyright Text</label>
                        <input className="form-control" value={settings.footer.copyright} onChange={e => setSettings({...settings, footer: {...settings.footer, copyright: e.target.value}})} />
                    </div>
                    <button className="action-btn btn-primary" onClick={() => saveSettings('footer_config', settings.footer)}>Update Footer</button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
