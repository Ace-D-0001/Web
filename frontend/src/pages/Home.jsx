import HeroSlider from '../components/HeroSlider';
import Card from '../components/Card';
import './Home.css';

import product1 from '../assets/product1.png';
import product2 from '../assets/product2.png';
import product3 from '../assets/product3.png';

const Home = () => {
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
                    
                    <div className="cards-grid">
                        <Card 
                            id="synergy-pro"
                            title="Synergy Pro Workstation" 
                            description="Unleash your potential with our flagship developer workstation, optimized for React and Laravel performance."
                            image={product1}
                        />
                        <Card 
                            id="cloud-link"
                            title="Cloud-Link Hub" 
                            description="Seamlessly interconnect your local environment with global cloud infrastructure using our secure hub."
                            image={product2}
                        />
                        <Card 
                            id="secure-node"
                            title="Secure-Node v2" 
                            description="Hardware-level encryption for your local databases, ensuring your SQL data stays private and safe."
                            image={product3}
                        />
                    </div>

                </div>
            </section>
        </div>
    );
};

export default Home;
