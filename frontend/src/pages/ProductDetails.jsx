import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('inquiry'); // inquiry or order

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
            const found = res.data.find(p => p.id.toString() === id);
            setProduct(found);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch product details');
            setLoading(false);
        }
    };

    const handleInquiry = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to send an inquiry.');
            navigate('/login');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/inquiries`, {
                email: user.email,
                product_id: product.id,
                message: message || `I am interested in ${product.title}`
            });
            alert('Your inquiry has been sent to the admin!');
            setMessage('');
        } catch (err) {
            alert('Failed to send inquiry. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleOrder = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to place an order.');
            navigate('/login');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/orders`, {
                product_id: product.id,
                quantity: quantity,
                notes: message
            });
            alert('Order placed successfully! Redirecting to your orders...');
            navigate('/orders');
        } catch (err) {
            alert('Failed to place order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading product...</div>;
    if (!product) return <div style={{ padding: '100px', textAlign: 'center' }}>Product not found</div>;

    return (
        <div className="product-details-page">
            <div className="product-banner" style={{ 
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(10,10,15,1)), url(${product.image_url || 'https://via.placeholder.com/1200x400'})` 
            }}>
                <div className="banner-content">
                    <h1 className="banner-title">{product.title}</h1>
                    <p className="banner-price">{product.price || 'Contact for pricing'}</p>
                </div>
            </div>

            <div className="details-container">
                {product.gallery && product.gallery.length > 0 && (
                    <section className="gallery-section">
                        <h2 className="section-title">Product Gallery</h2>
                        <div className="gallery-grid">
                            {product.gallery.map((img, index) => (
                                <div key={index} className="gallery-item">
                                    <img src={img} alt={`Gallery ${index}`} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className="info-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                    <div className="description-and-specs">
                        <div className="description-part">
                            <h2 className="section-title">Description</h2>
                            <p className="product-description">{product.description}</p>
                        </div>

                        {product.specs && product.specs.length > 0 && (
                            <div className="specs-part" style={{ marginTop: '30px' }}>
                                <h2 className="section-title">Specifications</h2>
                                <ul className="specs-list">
                                    {product.specs.map((spec, index) => (
                                        <li key={index}>{spec}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="action-part" style={{ background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <button 
                                onClick={() => setActiveTab('inquiry')} 
                                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: activeTab === 'inquiry' ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                Send Inquiry
                            </button>
                            <button 
                                onClick={() => setActiveTab('order')} 
                                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: activeTab === 'order' ? 'var(--success)' : 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                Place Order
                            </button>
                        </div>

                        {activeTab === 'inquiry' ? (
                            <form onSubmit={handleInquiry} className="animate-fade-in">
                                <h2 className="section-title">Send Inquiry</h2>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Your Message</label>
                                    <textarea 
                                        className="form-control" 
                                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '12px', borderRadius: '8px' }}
                                        rows="5"
                                        placeholder="Write your questions here..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="order-btn" disabled={submitting} style={{ width: '100%' }}>
                                    {submitting ? 'Sending...' : 'Send Message to Admin'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleOrder} className="animate-fade-in">
                                <h2 className="section-title">Place Order Now</h2>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Quantity</label>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        className="form-control" 
                                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '12px', borderRadius: '8px' }}
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Additional Notes (Optional)</label>
                                    <textarea 
                                        className="form-control" 
                                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '12px', borderRadius: '8px' }}
                                        rows="3"
                                        placeholder="Any special requests..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="order-btn" disabled={submitting} style={{ width: '100%', background: 'var(--success)' }}>
                                    {submitting ? 'Processing...' : 'Place Order Now'}
                                </button>
                            </form>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProductDetails;
