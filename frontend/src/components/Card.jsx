import { Link } from 'react-router-dom';
import './Card.css';

const Card = ({ title, description, image, id }) => {
    return (
        <div className="product-card">
            <div className="product-image-wrapper">
                <img src={image} alt={title} className="product-image" />
            </div>
            <div className="product-card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-text">{description}</p>
                <Link to={`/product/${id}`} className="card-link">Learn More</Link>
            </div>
        </div>
    );
};


export default Card;
