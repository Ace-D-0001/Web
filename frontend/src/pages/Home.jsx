import { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSlider from '../components/HeroSlider';
import Card from '../components/Card';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
            // Filter out paused products for the public view
            setProducts(res.data.filter(p => !p.is_paused));
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch products');
            setLoading(false);
        }
    };

    return (
        <div className="home-page">
            <HeroSlider />
            
            <section className="products-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">Premium Collection</span>
                        <h2 className="section-title">Our Featured Products</h2>
                        <div className="section-divider"></div>
                    </div>
                    
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>Loading products...</div>
                    ) : (
                        <div className="cards-grid">
                            {products.length > 0 ? (
                                products.map(p => (
                                    <Card 
                                        key={p.id}
                                        id={p.id}
                                        title={p.title} 
                                        description={p.description}
                                        image={p.image_url || '/assets/no-image.png'}
                                    />
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', width: '100%', color: 'var(--text-dim)' }}>
                                    No products available at the moment.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
