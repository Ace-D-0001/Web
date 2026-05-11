import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Invoice from '../components/Invoice';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ users: 0, products: 0, inquiries: 0, team: 0 });
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { logout } = useAuth();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [u, p, i, t] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/admin/users`),
                axios.get(`${import.meta.env.VITE_API_URL}/admin/products`),
                axios.get(`${import.meta.env.VITE_API_URL}/admin/inquiries`),
                axios.get(`${import.meta.env.VITE_API_URL}/admin/team`)
            ]);
            setStats({
                users: u.data.length,
                products: p.data.length,
                inquiries: i.data.length,
                team: t.data.length
            });
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch dashboard stats', err);
            setLoading(false);
        }
    };

    const sidebarItems = [
        { id: 'overview', label: 'Dashboard', icon: '📊', group: 'Core' },
        { id: 'users', label: 'User Management', icon: '👥', group: 'Core' },
        { id: 'cards', label: 'Service Cards', icon: '🎴', group: 'Core' },
        { id: 'orders', label: 'Order Management', icon: '📦', group: 'Core' },
        { id: 'team', label: 'Team Members', icon: '👔', group: 'Core' },
        { id: 'messages', label: 'Inquiries', icon: '📩', group: 'Communication' },
        { id: 'settings', label: 'Site Branding', icon: '⚙️', group: 'Configuration' },
    ];

    if (loading) return <div className="admin-loading">Loading Dashboard...</div>;

    return (
        <div className="admin-layout">
            <button className={`mobile-toggle ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <span className="toggle-icon">{isSidebarOpen ? '✕' : '☰'}</span>
            </button>
            
            <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)} />

            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">AdminPanel</div>
                <nav className="sidebar-nav">
                    {/* Groups */}
                    {['Core', 'Communication', 'Configuration'].map(group => (
                        <div key={group} className="nav-group">
                            <div className="nav-group-title">{group}</div>
                            {sidebarItems.filter(item => item.group === group).map(item => (
                                <button 
                                    key={item.id}
                                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsSidebarOpen(false);
                                    }}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <button className="nav-item" onClick={() => window.location.href = '/'}>
                        <span className="nav-icon">🌐</span>
                        <span>View Website</span>
                    </button>
                    <button className="nav-item btn-logout" onClick={logout} style={{ color: '#ff453a' }}>
                        <span className="nav-icon">🚪</span>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                {activeTab === 'overview' && <OverviewSection stats={stats} />}
                {activeTab === 'orders' && <OrdersSection />}
                {activeTab === 'users' && <UsersSection />}
                {activeTab === 'cards' && <CardsSection />}
                {activeTab === 'team' && <TeamSection />}
                {activeTab === 'messages' && <MessagesSection />}
                {activeTab === 'settings' && <SettingsSection />}
            </main>
        </div>
    );
};

/* --- SUB-SECTIONS --- */

const OverviewSection = ({ stats }) => {
    return (
        <div className="section">
            <header className="content-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>Welcome back, Admin!</p>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Users</div>
                    <div className="stat-value">{stats.users}</div>
                    <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--success)' }}>↑ 12% from last month</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Active Services</div>
                    <div className="stat-value">{stats.products}</div>
                    <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--primary)' }}>Fully Optimized</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">New Inquiries</div>
                    <div className="stat-value">{stats.inquiries}</div>
                    <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--accent)' }}>Requires attention</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Team Members</div>
                    <div className="stat-value">{stats.team}</div>
                    <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>Core Staff</div>
                </div>
            </div>

            <div className="data-card" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                        { icon: '🆕', text: 'New inquiry received from contact form', time: '2 minutes ago' },
                        { icon: '👤', text: 'User "John Doe" registered as new member', time: '1 hour ago' },
                        { icon: '✅', text: 'Service "Premium Package" updated', time: '3 hours ago' },
                        { icon: '📩', text: 'System backup completed successfully', time: '5 hours ago' }
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.text}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const OrdersSection = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [newOrder, setNewOrder] = useState({
        user_email: '',
        notes: '',
        items: [{ product_name: '', quantity: 1, unit_price: 0 }]
    });

    useEffect(() => { 
        fetchOrders(); 
        fetchProducts();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/orders`);
            setOrders(res.data);
        } catch (err) {
            console.error('Failed to fetch orders', err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/products`);
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch products', err);
        }
    };

    const handleCreateDraft = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/admin/orders`, newOrder);
            setShowModal(false);
            fetchOrders();
            setNewOrder({ user_email: '', notes: '', items: [{ product_name: '', quantity: 1, unit_price: 0 }] });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create order. Make sure the email exists.');
        }
    };

    const handleAction = async (id, action) => {
        try {
            if (action === 'cancel') {
                const reason = prompt("Optional: Enter cancellation reason");
                if (reason === null) return;
                await axios.post(`${import.meta.env.VITE_API_URL}/admin/orders/${id}/cancel`, { cancel_reason: reason });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/admin/orders/${id}/${action}`);
            }
            fetchOrders();
            if (selectedOrder && selectedOrder.id === id) {
                const updated = await axios.get(`${import.meta.env.VITE_API_URL}/admin/orders/${id}`);
                setSelectedOrder(updated.data);
            }
        } catch (err) {
            alert(err.response?.data?.message || `Failed to ${action} order.`);
        }
    };

    const openDetails = async (order) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/orders/${order.id}`);
            setSelectedOrder(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesFilter = filter === 'all' || o.status === filter;
        const matchesSearch = o.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              o.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="section">
            <header className="content-header">
                <div>
                    <h1>Order Management</h1>
                    <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>Manage customer orders and workflow</p>
                </div>
                <button className="action-btn btn-primary" onClick={() => setShowModal(true)}>
                    + Create Order
                </button>
            </header>

            <div className="data-card">
                <div style={{ padding: '1.5rem', marginBottom: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {['all', 'draft', 'assigned', 'confirmed', 'completed', 'cancelled'].map(f => (
                            <button 
                                key={f} 
                                onClick={() => setFilter(f)}
                                className={`badge ${filter === f ? 'badge-primary' : ''}`}
                                style={{ 
                                    cursor: 'pointer', 
                                    opacity: filter === f ? 1 : 0.6,
                                    transition: 'all 0.2s',
                                    border: 'none'
                                }}
                            >
                                {f.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    
                    <div className="search-box" style={{ flex: 1, minWidth: '200px', maxWidth: '300px' }}>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Search by email or name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '8px 16px', borderRadius: '20px' }}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                    <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(o => (
                            <tr key={o.id}>
                                <td>ORD-{String(o.id).padStart(5, '0')}</td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 600 }}>{o.user?.name || 'Unknown'}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{o.user?.email}</span>
                                    </div>
                                </td>
                                <td>{o.items?.length || 0} items</td>
                                <td style={{ fontWeight: 600 }}>${Number(o.total_price).toFixed(2)}</td>
                                <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {o.status === 'draft' && (
                                            <button className="action-btn" onClick={() => handleAction(o.id, 'assign')} title="Assign to User">✈️</button>
                                        )}
                                        {o.status === 'confirmed' && (
                                            <button className="action-btn btn-success" onClick={() => handleAction(o.id, 'complete')} title="Mark Complete">✅</button>
                                        )}
                                        <button className="action-btn" onClick={() => openDetails(o)} title="View Details">👁️</button>
                                        {o.status !== 'completed' && o.status !== 'cancelled' && (
                                            <button className="action-btn btn-danger" onClick={() => handleAction(o.id, 'cancel')} title="Cancel Order">❌</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Create Draft Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '600px' }}>
                        <h2>Create New Order (Draft)</h2>
                        <form onSubmit={handleCreateDraft} style={{ marginTop: '20px' }}>
                            <div className="form-group">
                                <label>Customer Email</label>
                                <input className="form-control" type="email" required placeholder="User must be registered"
                                    value={newOrder.user_email} onChange={e => setNewOrder({...newOrder, user_email: e.target.value})} />
                            </div>
                            
                            <h4 style={{ margin: '20px 0 10px' }}>Order Items</h4>
                            {newOrder.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <select className="form-control" style={{ flex: 2 }} required
                                        value={item.product_name} onChange={e => {
                                            const items = [...newOrder.items];
                                            items[idx].product_name = e.target.value;
                                            
                                            // Auto-fill price if selected
                                            const selectedProduct = products.find(p => p.title === e.target.value);
                                            if (selectedProduct) {
                                                const numericPrice = parseFloat(selectedProduct.price.replace(/[^0-9.]/g, ''));
                                                if (!isNaN(numericPrice)) {
                                                    items[idx].unit_price = numericPrice;
                                                }
                                            }
                                            setNewOrder({...newOrder, items});
                                        }}>
                                        <option value="">Select a Product</option>
                                        {products.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
                                    </select>
                                    <input className="form-control" style={{ flex: 1 }} type="number" min="1" placeholder="Qty" required
                                        value={item.quantity} onChange={e => {
                                            const items = [...newOrder.items];
                                            items[idx].quantity = e.target.value;
                                            setNewOrder({...newOrder, items});
                                        }} />
                                    <input className="form-control" style={{ flex: 1 }} type="number" min="0" step="0.01" placeholder="Unit $" required
                                        value={item.unit_price} onChange={e => {
                                            const items = [...newOrder.items];
                                            items[idx].unit_price = e.target.value;
                                            setNewOrder({...newOrder, items});
                                        }} />
                                    {newOrder.items.length > 1 && (
                                        <button type="button" className="action-btn btn-danger" onClick={() => {
                                            setNewOrder({...newOrder, items: newOrder.items.filter((_, i) => i !== idx)});
                                        }}>🗑️</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" className="action-btn" onClick={() => setNewOrder({...newOrder, items: [...newOrder.items, {product_name: '', quantity: 1, unit_price: 0}]})}>
                                + Add Another Item
                            </button>

                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label>Admin Notes</label>
                                <textarea className="form-control" rows="2" value={newOrder.notes} onChange={e => setNewOrder({...newOrder, notes: e.target.value})}></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                <button type="submit" className="action-btn btn-primary" style={{ flex: 1 }}>Save as Draft</button>
                                <button type="button" className="action-btn" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '600px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2>Order #ORD-{String(selectedOrder.id).padStart(5, '0')}</h2>
                            <span className={`badge badge-${selectedOrder.status}`}>{selectedOrder.status.toUpperCase()}</span>
                        </div>

                        <div className="detail-group">
                            <p><strong>Customer:</strong> {selectedOrder.user?.name} ({selectedOrder.user?.email})</p>
                            <p><strong>Created By:</strong> {selectedOrder.creator?.name}</p>
                            <p><strong>Timestamps:</strong></p>
                            <ul style={{ paddingLeft: '20px', margin: '5px 0', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                                <li>Created: {new Date(selectedOrder.created_at).toLocaleString()}</li>
                                <li>Assigned: {selectedOrder.assigned_at ? new Date(selectedOrder.assigned_at).toLocaleString() : '-'}</li>
                                <li>Confirmed: {selectedOrder.confirmed_at ? new Date(selectedOrder.confirmed_at).toLocaleString() : '-'}</li>
                            </ul>
                        </div>

                        <h4 style={{ margin: '20px 0 10px' }}>Line Items</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                            <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '8px 0' }}>Item</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.items?.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '8px 0' }}>{item.product_name}</td>
                                        <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                        <td style={{ textAlign: 'center' }}>${Number(item.unit_price).toFixed(2)}</td>
                                        <td style={{ textAlign: 'right' }}>${Number(item.subtotal).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="3" style={{ textAlign: 'right', padding: '10px 0' }}>Total:</th>
                                    <th style={{ textAlign: 'right', fontSize: '1.2rem', padding: '10px 0' }}>${Number(selectedOrder.total_price).toFixed(2)}</th>
                                </tr>
                            </tfoot>
                        </table>

                        {selectedOrder.notes && (
                            <div className="detail-group">
                                <label>Admin Notes:</label>
                                <p style={{ fontStyle: 'italic', color: 'var(--text-dim)', padding: '10px', background: 'rgba(255,255,255,0.05)' }}>{selectedOrder.notes}</p>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            {selectedOrder.status === 'draft' && (
                                <button className="action-btn btn-primary" style={{ flex: 1 }} onClick={() => { handleAction(selectedOrder.id, 'assign'); setSelectedOrder(null); }}>✈️ Assign Order</button>
                            )}
                            {selectedOrder.status === 'confirmed' && (
                                <button className="action-btn btn-success" style={{ flex: 1 }} onClick={() => { handleAction(selectedOrder.id, 'complete'); setSelectedOrder(null); }}>✅ Mark Complete</button>
                            )}
                            <button className="action-btn" style={{ flex: 1 }} onClick={() => setShowInvoice(true)}>🖨️ View Invoice</button>
                            <button className="action-btn" style={{ flex: 1 }} onClick={() => setSelectedOrder(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showInvoice && selectedOrder && (
                <Invoice order={selectedOrder} onClose={() => setShowInvoice(false)} />
            )}
        </div>
    );
};

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
                <div className="table-responsive">
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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=6366f1&color=fff`} className="table-avatar" />
                                            <span style={{ fontWeight: 600 }}>{u.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-dim)' }}>{u.email}</td>
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
                                    <td style={{ color: 'var(--text-dim)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="action-btn" onClick={() => updateStatus(u.id, 'active')} title="Approve">✅</button>
                                            <button className="action-btn" onClick={() => updateStatus(u.id, 'pending')} title="Set Pending">⏳</button>
                                            <button className="action-btn btn-danger" onClick={() => deleteUser(u.id)} title="Delete">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
        try {
            const formData = new FormData();
            formData.append('title', currentCard.title);
            formData.append('price', currentCard.price);
            formData.append('description', currentCard.description);
            
            if (currentCard.image_file) {
                formData.append('image', currentCard.image_file);
            } else {
                formData.append('image_url', currentCard.image_url);
            }

            const gallery = typeof currentCard.gallery === 'string' 
                ? currentCard.gallery.split(',').map(s => s.trim()).filter(s => s) 
                : currentCard.gallery;
            formData.append('gallery', JSON.stringify(gallery));

            const specs = typeof currentCard.specs === 'string' 
                ? currentCard.specs.split('\n').map(s => s.trim()).filter(s => s) 
                : currentCard.specs;
            formData.append('specs', JSON.stringify(specs));

            if (currentCard.id) {
                // Laravel doesn't handle FormData well with PUT, so we use POST with _method spoofing
                formData.append('_method', 'PUT');
                await axios.post(`${import.meta.env.VITE_API_URL}/admin/products/${currentCard.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/admin/products`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setShowModal(false);
            fetchCards();
        } catch (err) {
            alert('Failed to save. Check your data and image file.');
        }
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
                <div>
                    <h1>Service Cards</h1>
                    <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>Manage your website offerings</p>
                </div>
                <button className="action-btn btn-primary" onClick={() => { 
                    setCurrentCard({ title: '', price: '', description: '', image_url: '', gallery: '', specs: '' }); 
                    setShowModal(true); 
                }}>
                    + Create New Card
                </button>
            </header>

            <div className="cards-grid">
                {products.map(p => (
                    <div key={p.id} className={`admin-product-card ${p.is_paused ? 'paused-overlay' : ''}`}>
                        <img src={p.image_url || '/assets/no-image.png'} className="card-img-preview" alt={p.title} />
                        <div className="card-body">
                            <h3>{p.title}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--primary-light)', fontWeight: '700', fontSize: '1.1rem' }}>{p.price || 'Contact for Price'}</span>
                            </div>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem', margin: '12px 0', lineHeight: '1.5' }}>
                                {p.description?.length > 100 ? p.description.substring(0, 100) + '...' : p.description}
                            </p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '16px' }}>
                                <button className="action-btn" style={{ flex: 1 }} onClick={() => { 
                                    setCurrentCard({
                                        ...p,
                                        gallery: p.gallery ? p.gallery.join(', ') : '',
                                        specs: p.specs ? p.specs.join('\n') : ''
                                    }); 
                                    setShowModal(true); 
                                }}>Edit</button>
                                <button className="action-btn" onClick={() => togglePause(p.id)}>
                                    {p.is_paused ? '▶️ Resume' : '⏸️ Pause'}
                                </button>
                                <button className="action-btn btn-danger" onClick={() => deleteCard(p.id)}>🗑️</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="admin-modal">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2>{currentCard.id ? 'Edit Service' : 'New Service'}</h2>
                            <button className="action-btn" onClick={() => setShowModal(false)} style={{ padding: '8px' }}>✕</button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '24px' }}>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input className="form-control" placeholder="e.g. Premium Hajj Package" value={currentCard.title} onChange={e => setCurrentCard({...currentCard, title: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Price</label>
                                    <input className="form-control" placeholder="e.g. $4,500" value={currentCard.price} onChange={e => setCurrentCard({...currentCard, price: e.target.value})} />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Service Image (Upload file or paste URL)</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <input 
                                        type="file" 
                                        className="form-control" 
                                        accept="image/*"
                                        onChange={e => setCurrentCard({...currentCard, image_file: e.target.files[0], image_url: URL.createObjectURL(e.target.files[0])})} 
                                    />
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <input className="form-control" style={{ flex: 1 }} placeholder="OR paste URL: https://images.unsplash.com/..." value={currentCard.image_url} onChange={e => setCurrentCard({...currentCard, image_url: e.target.value, image_file: null})} />
                                        {currentCard.image_url && (
                                            <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                                <img src={currentCard.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea className="form-control" rows="3" placeholder="Describe the service..." value={currentCard.description} onChange={e => setCurrentCard({...currentCard, description: e.target.value})} />
                            </div>

                            <div className="form-group">
                                <label>Specifications (One per line)</label>
                                <textarea className="form-control" rows="3" placeholder="Hardware encryption&#10;Cloud sync ready&#10;24/7 Support" value={currentCard.specs} onChange={e => setCurrentCard({...currentCard, specs: e.target.value})} />
                            </div>

                            <div className="form-group">
                                <label>Gallery Image URLs (Comma separated)</label>
                                <textarea className="form-control" rows="2" placeholder="https://image1.jpg, https://image2.jpg" value={currentCard.gallery} onChange={e => setCurrentCard({...currentCard, gallery: e.target.value})} />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                                <button type="submit" className="action-btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                                <button type="button" className="action-btn" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const TeamSection = () => {
    const [team, setTeam] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentMember, setCurrentMember] = useState({ name: '', position: '', email: '', image_url: '' });

    useEffect(() => { fetchTeam(); }, []);

    const fetchTeam = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/team`);
        setTeam(res.data);
    };

        try {
            const formData = new FormData();
            formData.append('name', currentMember.name);
            formData.append('position', currentMember.position);
            formData.append('email', currentMember.email);
            
            if (currentMember.image_file) {
                formData.append('image', currentMember.image_file);
            } else {
                formData.append('image_url', currentMember.image_url);
            }

            if (currentMember.id) {
                formData.append('_method', 'PUT');
                await axios.post(`${import.meta.env.VITE_API_URL}/admin/team/${currentMember.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/admin/team`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setShowModal(false);
            fetchTeam();
        } catch (err) {
            alert('Failed to save team member. Please check the image format.');
        }
    };

    const deleteMember = async (id) => {
        if (window.confirm('Delete this team member?')) {
            await axios.delete(`${import.meta.env.VITE_API_URL}/admin/team/${id}`);
            fetchTeam();
        }
    };

    return (
        <div className="section">
            <header className="content-header">
                <div>
                    <h1>Team Management</h1>
                    <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>Manage your organization's staff</p>
                </div>
                <button className="action-btn btn-primary" onClick={() => { 
                    setCurrentMember({ name: '', position: '', email: '', image_url: '' }); 
                    setShowModal(true); 
                }}>
                    + Add Member
                </button>
            </header>

            <div className="data-card">
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Member</th>
                                <th>Position</th>
                                <th>Gmail</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {team.map(m => (
                                <tr key={m.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <img src={m.image_url || `https://ui-avatars.com/api/?name=${m.name}`} className="table-avatar" />
                                            <span style={{ fontWeight: 600 }}>{m.name}</span>
                                        </div>
                                    </td>
                                    <td>{m.position}</td>
                                    <td style={{ color: 'var(--text-dim)' }}>{m.email}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="action-btn" onClick={() => { setCurrentMember(m); setShowModal(true); }}>Edit</button>
                                            <button className="action-btn btn-danger" onClick={() => deleteMember(m.id)}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="admin-modal">
                        <h2>{currentMember.id ? 'Edit Member' : 'Add New Member'}</h2>
                        <form onSubmit={handleSave} style={{ marginTop: '24px' }}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input className="form-control" value={currentMember.name} onChange={e => setCurrentMember({...currentMember, name: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>Position</label>
                                <input className="form-control" value={currentMember.position} onChange={e => setCurrentMember({...currentMember, position: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>Gmail Address</label>
                                <input className="form-control" type="email" value={currentMember.email} onChange={e => setCurrentMember({...currentMember, email: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Profile Image (Upload file or paste URL)</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <input 
                                        type="file" 
                                        className="form-control" 
                                        accept="image/*"
                                        onChange={e => setCurrentMember({...currentMember, image_file: e.target.files[0], image_url: URL.createObjectURL(e.target.files[0])})} 
                                    />
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <input className="form-control" style={{ flex: 1 }} placeholder="OR paste URL: https://..." value={currentMember.image_url} onChange={e => setCurrentMember({...currentMember, image_url: e.target.value, image_file: null})} />
                                        {currentMember.image_url && (
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                                <img src={currentMember.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                                <button type="submit" className="action-btn btn-primary" style={{ flex: 1 }}>Save Member</button>
                                <button type="button" className="action-btn" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
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
        if (window.confirm('Delete this inquiry?')) {
            await axios.delete(`${import.meta.env.VITE_API_URL}/admin/inquiries/${id}`);
            fetchMessages();
        }
    };

    return (
        <div className="section">
            <header className="content-header">
                <div>
                    <h1>User Inquiries</h1>
                    <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>Incoming requests from your website</p>
                </div>
            </header>
            <div className="data-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User Info</th>
                            <th>Interest</th>
                            <th>Message</th>
                            <th>Received</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map(m => (
                            <tr key={m.id}>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 600 }}>{m.email}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: #{m.id}</span>
                                    </div>
                                </td>
                                <td><span className="badge badge-admin">{m.product?.title || 'General Inquiry'}</span></td>
                                <td style={{ maxWidth: '300px', lineHeight: '1.4' }}>{m.message}</td>
                                <td style={{ color: 'var(--text-dim)' }}>{new Date(m.created_at).toLocaleString()}</td>
                                <td>
                                    <button className="action-btn btn-danger" onClick={() => deleteMsg(m.id)}>🗑️ Delete</button>
                                </td>
                            </tr>
                        ))}
                        {messages.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-dim)' }}>
                                    No inquiries found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SettingsSection = () => {
    const [settings, setSettings] = useState({ 
        navbar_config: { brand: 'SynergyStack', logo_url: '' }, 
        footer_config: { 
            brand: 'SynergyStack', 
            copyright: '© 2026',
            about_text: 'Building the future of full-stack development.',
            social: { facebook: '', twitter: '', linkedin: '', instagram: '' },
            contact: { email: '', phone: '', address: '' },
            map_url: '',
            quick_links: []
        },
        contact_info: {
            address: '123 Tech Avenue, Silicon Valley, CA',
            email: 'support@synergystack.com',
            phone: '+1 (555) SYNERGY'
        },
        about_info: {
            title: 'About SynergyStack',
            description: 'Founded in 2026, SynergyStack is a global leader in high-performance developer ecosystems...'
        }
    });

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/settings`);
            setSettings(prev => ({ ...prev, ...res.data }));
        } catch (err) {
            console.error('Failed to fetch settings');
        }
    };

    const saveSettings = async (key, value) => {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/settings/${key}`, { value });
        alert(`${key.replace('_', ' ').toUpperCase()} updated successfully!`);
    };

    return (
        <div className="section">
            <header className="content-header">
                <div>
                    <h1>Platform Branding & Content</h1>
                    <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>Global settings for your application</p>
                </div>
            </header>
            
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                {/* Branding */}
                <div className="stat-card" style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ marginBottom: '24px' }}>Header & Footer Branding</h3>
                    <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '0' }}>
                        <div className="nav-group">
                            <label className="nav-group-title" style={{ padding: 0 }}>General</label>
                            <div className="form-group">
                                <label>Platform Name</label>
                                <input className="form-control" value={settings.navbar_config?.brand} onChange={e => setSettings({...settings, navbar_config: {...settings.navbar_config, brand: e.target.value}})} />
                            </div>
                            <div className="form-group">
                                <label>Logo URL</label>
                                <input className="form-control" value={settings.navbar_config?.logo_url} onChange={e => setSettings({...settings, navbar_config: {...settings.navbar_config, logo_url: e.target.value}})} />
                            </div>
                            <div className="form-group">
                                <label>Copyright Text</label>
                                <input className="form-control" value={settings.footer_config?.copyright} onChange={e => setSettings({...settings, footer_config: {...settings.footer_config, copyright: e.target.value}})} />
                            </div>
                        </div>
                        <div className="nav-group">
                            <label className="nav-group-title" style={{ padding: 0 }}>Footer Details</label>
                            <div className="form-group">
                                <label>Footer About Text</label>
                                <textarea className="form-control" rows="2" value={settings.footer_config?.about_text} onChange={e => setSettings({...settings, footer_config: {...settings.footer_config, about_text: e.target.value}})} />
                            </div>
                            <div className="form-group">
                                <label>Footer Email</label>
                                <input className="form-control" value={settings.footer_config?.contact?.email} onChange={e => setSettings({...settings, footer_config: {...settings.footer_config, contact: {...settings.footer_config.contact, email: e.target.value}}})} />
                            </div>
                            <div className="form-group">
                                <label>Footer Phone</label>
                                <input className="form-control" value={settings.footer_config?.contact?.phone} onChange={e => setSettings({...settings, footer_config: {...settings.footer_config, contact: {...settings.footer_config.contact, phone: e.target.value}}})} />
                            </div>
                            <div className="form-group">
                                <label>Google Maps Embed URL</label>
                                <input className="form-control" placeholder="https://www.google.com/maps/embed?..." value={settings.footer_config?.map_url} onChange={e => setSettings({...settings, footer_config: {...settings.footer_config, map_url: e.target.value}})} />
                            </div>
                        </div>
                    </div>

                    <div className="nav-group" style={{ marginTop: '24px' }}>
                        <label className="nav-group-title" style={{ padding: 0 }}>Quick Links</label>
                        <div className="stats-grid" style={{ gridTemplateColumns: '1fr', gap: '12px' }}>
                            {(settings.footer_config?.quick_links || []).map((link, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <input className="form-control" style={{ flex: 1 }} placeholder="Label (e.g. Home)" value={link.label} onChange={e => {
                                        const newLinks = [...settings.footer_config.quick_links];
                                        newLinks[idx].label = e.target.value;
                                        setSettings({...settings, footer_config: {...settings.footer_config, quick_links: newLinks}});
                                    }} />
                                    <input className="form-control" style={{ flex: 2 }} placeholder="URL (e.g. /home)" value={link.url} onChange={e => {
                                        const newLinks = [...settings.footer_config.quick_links];
                                        newLinks[idx].url = e.target.value;
                                        setSettings({...settings, footer_config: {...settings.footer_config, quick_links: newLinks}});
                                    }} />
                                    <button className="action-btn btn-danger" onClick={() => {
                                        const newLinks = settings.footer_config.quick_links.filter((_, i) => i !== idx);
                                        setSettings({...settings, footer_config: {...settings.footer_config, quick_links: newLinks}});
                                    }}>🗑️</button>
                                </div>
                            ))}
                            <button className="action-btn" style={{ width: 'fit-content' }} onClick={() => {
                                const newLinks = [...(settings.footer_config.quick_links || []), { label: '', url: '' }];
                                setSettings({...settings, footer_config: {...settings.footer_config, quick_links: newLinks}});
                            }}>+ Add Link</button>
                        </div>
                    </div>

                    <div className="nav-group" style={{ marginTop: '24px' }}>
                        <label className="nav-group-title" style={{ padding: 0 }}>Social Media Links</label>
                        <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label>Facebook</label>
                                <input className="form-control" value={settings.footer_config?.social?.facebook} onChange={e => setSettings({...settings, footer_config: {...settings.footer_config, social: {...settings.footer_config.social, facebook: e.target.value}}})} />
                            </div>
                            <div className="form-group">
                                <label>Twitter</label>
                                <input className="form-control" value={settings.footer_config?.social?.twitter} onChange={e => setSettings({...settings, footer_config: {...settings.footer_config, social: {...settings.footer_config.social, twitter: e.target.value}}})} />
                            </div>
                            <div className="form-group">
                                <label>LinkedIn</label>
                                <input className="form-control" value={settings.footer_config?.social?.linkedin} onChange={e => setSettings({...settings, footer_config: {...settings.footer_config, social: {...settings.footer_config.social, linkedin: e.target.value}}})} />
                            </div>
                            <div className="form-group">
                                <label>Instagram</label>
                                <input className="form-control" value={settings.footer_config?.social?.instagram} onChange={e => setSettings({...settings, footer_config: {...settings.footer_config, social: {...settings.footer_config.social, instagram: e.target.value}}})} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button className="action-btn btn-primary" style={{ flex: 1 }} onClick={() => saveSettings('navbar_config', settings.navbar_config)}>Save Navbar Settings</button>
                        <button className="action-btn btn-primary" style={{ flex: 1 }} onClick={() => saveSettings('footer_config', settings.footer_config)}>Save Footer Settings</button>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="stat-card">
                    <h3 style={{ marginBottom: '24px' }}>Contact Details</h3>
                    <div className="form-group">
                        <label>Physical Address</label>
                        <input className="form-control" value={settings.contact_info?.address} onChange={e => setSettings({...settings, contact_info: {...settings.contact_info, address: e.target.value}})} />
                    </div>
                    <div className="form-group">
                        <label>Support Email</label>
                        <input className="form-control" value={settings.contact_info?.email} onChange={e => setSettings({...settings, contact_info: {...settings.contact_info, email: e.target.value}})} />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input className="form-control" value={settings.contact_info?.phone} onChange={e => setSettings({...settings, contact_info: {...settings.contact_info, phone: e.target.value}})} />
                    </div>
                    <button className="action-btn btn-primary" style={{ width: '100%' }} onClick={() => saveSettings('contact_info', settings.contact_info)}>Update Contact Info</button>
                </div>

                {/* About Information */}
                <div className="stat-card" style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ marginBottom: '24px' }}>About Us Content</h3>
                    <div className="form-group">
                        <label>Section Title</label>
                        <input className="form-control" value={settings.about_info?.title} onChange={e => setSettings({...settings, about_info: {...settings.about_info, title: e.target.value}})} />
                    </div>
                    <div className="form-group">
                        <label>About Description</label>
                        <textarea className="form-control" rows="6" value={settings.about_info?.description} onChange={e => setSettings({...settings, about_info: {...settings.about_info, description: e.target.value}})} />
                    </div>
                    <button className="action-btn btn-primary" style={{ width: '100%' }} onClick={() => saveSettings('about_info', settings.about_info)}>Update About Content</button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
