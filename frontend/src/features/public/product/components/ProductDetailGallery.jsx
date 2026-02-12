import { useEffect, useMemo, useState } from "react";

const resolveCover = (images = []) =>
    images.find((img) => img.cover) || images[0];

export default function ProductDetailGallery({
    images = [],
    name = "Ürün",
}) {
    const normalizedImages = useMemo(
        () => images.filter((img) => img?.url),
        [images]
    );
    const cover = useMemo(
        () => resolveCover(normalizedImages),
        [normalizedImages]
    );
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!cover) {
            setActiveIndex(0);
            return;
        }
        const index = normalizedImages.findIndex(
            (img) => img.id === cover.id
        );
        setActiveIndex(index >= 0 ? index : 0);
    }, [cover, normalizedImages]);

    if (!normalizedImages.length) {
        return (
            <div className="product-detail-placeholder">
                Görsel bulunamadı
            </div>
        );
    }

    const total = normalizedImages.length;
    const handlePrev = () => {
        if (total <= 1) return;
        setActiveIndex((prev) => (prev - 1 + total) % total);
    };

    const handleNext = () => {
        if (total <= 1) return;
        setActiveIndex((prev) => (prev + 1) % total);
    };

    return (
        <div className="product-detail-gallery">
            <div className="product-detail-main">
                <div
                    className="product-detail-track"
                    style={{
                        transform: `translateX(-${activeIndex * 100}%)`,
                    }}
                >
                    {normalizedImages.map((img) => (
                        <div className="product-detail-slide" key={img.id}>
                            <img
                                src={img.url}
                                alt={`${name} görseli`}
                                loading="eager"
                                decoding="async"
                            />
                        </div>
                    ))}
                </div>

                {total > 1 ? (
                    <>
                        <button
                            type="button"
                            className="product-gallery-btn prev"
                            onClick={handlePrev}
                            aria-label="Önceki görsel"
                        >
                            <span aria-hidden="true">‹</span>
                        </button>
                        <button
                            type="button"
                            className="product-gallery-btn next"
                            onClick={handleNext}
                            aria-label="Sonraki görsel"
                        >
                            <span aria-hidden="true">›</span>
                        </button>
                    </>
                ) : null}
            </div>

            {total > 1 ? (
                <div className="product-gallery-dots" role="tablist">
                    {normalizedImages.map((img, index) => (
                        <button
                            key={img.id}
                            type="button"
                            className={`product-gallery-dot${
                                index === activeIndex ? " active" : ""
                            }`}
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Görsel ${index + 1}`}
                            aria-pressed={index === activeIndex}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
}
