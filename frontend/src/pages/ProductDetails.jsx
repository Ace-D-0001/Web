import { useParams } from 'react-router-dom';
import './ProductDetails.css';

// Assets
import product1 from '../assets/product1.png';
import product2 from '../assets/product2.png';
import product3 from '../assets/product3.png';
import gal1 from '../assets/gal1.png';
import gal2 from '../assets/gal2.png';
import gal3 from '../assets/gal3.png';
import gal4 from '../assets/gal4.png';

const productData = {
    'synergy-pro': {
        title: 'Synergy Pro Workstation',
        price: '$2,999 (Negotiable)',
        banner: product1,
        gallery: [gal1, gal4, product1, gal2],
        details: 'The Synergy Pro is a beast of a machine, designed for developers who demand the best. Featuring a liquid-cooled architecture and optimized for React/Laravel compilation, it reduces build times by up to 60%.',
        specs: [
            'Processor: 16-Core Ultra-Thread',
            'RAM: 64GB DDR5 @ 6000MHz',
            'Storage: 2TB NVMe Gen5 SSD',
            'Display: 16-inch 4K OLED HDR'
        ]
    },
    'cloud-link': {
        title: 'Cloud-Link Hub',
        price: '$450 (Volume Discounts Available)',
        banner: product2,
        gallery: [gal2, gal4, product2, gal1],
        details: 'Connect your local development environment to the global cloud with zero latency. The Cloud-Link Hub features hardware-level synchronization for git repositories and real-time database mirroring.',
        specs: [
            'Connectivity: 10Gbps Fiber-Ready',
            'Latency: < 1ms Local-to-Cloud',
            'Security: Hardware Firewall Built-in',
            'Ports: 8x Thunderbolt 5'
        ]
    },
    'secure-node': {
        title: 'Secure-Node v2',
        price: 'Contact for Quote',
        banner: product3,
        gallery: [gal3, gal4, product3, gal2],
        details: 'The ultimate security for your SQL databases. Secure-Node v2 provides physical encryption keys that must be present to access sensitive data clusters. Ideal for fintech and high-privacy applications.',
        specs: [
            'Encryption: AES-512 Hardware-Level',
            'Authentication: Multi-Factor Biometric',
            'Tamper-Proof: Self-Destruct Circuitry',
            'Interface: USB-C & Bluetooth 5.4'
        ]
    }
};

const ProductDetails = () => {
    const { id } = useParams();
    const product = productData[id] || productData['synergy-pro'];

    const handleOrder = () => {
        alert(`Interest registered for ${product.title}! Our team will contact you via your registered email shortly.`);
    };

    return (
        <div className="product-details-page">
            <div className="product-banner" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(10,10,15,1)), url(${product.banner})` }}>
                <div className="banner-content">
                    <h1 className="banner-title">{product.title}</h1>
                    <p className="banner-price">{product.price}</p>
                </div>
            </div>

            <div className="details-container">
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

                <section className="info-section">
                    <div className="description-part">
                        <h2 className="section-title">Description</h2>
                        <p className="product-description">{product.details}</p>
                    </div>

                    <div className="specs-part">
                        <h2 className="section-title">Specifications</h2>
                        <ul className="specs-list">
                            {product.specs.map((spec, index) => (
                                <li key={index}>{spec}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="action-part">
                        <button className="order-btn" onClick={handleOrder}>
                            I'm Interested in this Product
                        </button>
                        <p className="action-hint">Clicking will notify the admin. You will talk over email.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProductDetails;
