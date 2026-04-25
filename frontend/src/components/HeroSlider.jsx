import { useState, useEffect } from 'react';
import './HeroSlider.css';
import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';
import hero3 from '../assets/hero3.png';

const slides = [
    {
        id: 1,
        image: hero1,
        title: 'Modern Solutions',
        subtitle: 'Crafting premium digital experiences with cutting-edge technology.'
    },
    {
        id: 2,
        image: hero2,
        title: 'Digital Innovation',
        subtitle: 'Interconnecting the world through robust full-stack architectures.'
    },
    {
        id: 3,
        image: hero3,
        title: 'Team Excellence',
        subtitle: 'Collaborating to build stable and scalable software for the future.'
    }
];

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="hero-slider">
            {slides.map((slide, index) => (
                <div 
                    key={slide.id} 
                    className={`slide ${index === current ? 'active' : ''}`}
                    style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${slide.image})` }}
                >
                    <div className="slide-content">
                        <h1 className="slide-title">{slide.title}</h1>
                        <p className="slide-subtitle">{slide.subtitle}</p>
                        <button className="slide-btn">Learn More</button>
                    </div>
                </div>
            ))}
            <div className="slider-dots">
                {slides.map((_, index) => (
                    <span 
                        key={index} 
                        className={`dot ${index === current ? 'active' : ''}`}
                        onClick={() => setCurrent(index)}
                    ></span>
                ))}
            </div>
        </section>
    );
};

export default HeroSlider;
