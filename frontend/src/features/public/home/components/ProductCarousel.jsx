import { useRef } from "react";
import ProductCard from "../../product/components/ProductCard.jsx";
import "../../home/styles/ProductCarousel.css";

export default function ProductCarousel({ products = [] }) {
    const trackRef = useRef(null);
    const maxCardsPerSlide = 4;

    const scrollByCard = (direction) => {
        if (!trackRef.current) return;
        const card = trackRef.current.querySelector(".product-card-public");
        const cardWidth = card ? card.offsetWidth : 280;
        const gap = 16;
        const trackWidth = trackRef.current.clientWidth || 0;
        const visibleCards = Math.max(
            1,
            Math.min(
                maxCardsPerSlide,
                Math.floor(trackWidth / (cardWidth + gap)) || 1
            )
        );
        trackRef.current.scrollBy({
            left: direction * (cardWidth + gap) * visibleCards,
            behavior: "smooth",
        });
    };

    if (!products.length) {
        return <div className="product-empty">Ürün bulunamadı.</div>;
    }

    return (
        <div className="product-carousel">
            <button
                type="button"
                className="carousel-btn prev"
                onClick={() => scrollByCard(-1)}
                aria-label="Önceki"
            >
                <span className="carousel-btn-icon" aria-hidden="true">
                    {"<"}
                </span>
            </button>
            <div className="carousel-track" ref={trackRef}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <button
                type="button"
                className="carousel-btn next"
                onClick={() => scrollByCard(1)}
                aria-label="Sonraki"
            >
                <span className="carousel-btn-icon" aria-hidden="true">
                    {">"}
                </span>
            </button>
        </div>
    );
}
