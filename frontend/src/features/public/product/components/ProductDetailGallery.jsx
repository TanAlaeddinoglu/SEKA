import {useMemo, useState} from "react";

const resolveCover = (images = []) =>
    images.find((img) => img.cover) || images[0];

const resolveImageKey = (img, index) =>
    String(img?.id ?? img?.url ?? index);

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
    const imageKeys = useMemo(
        () => normalizedImages.map((img, index) => resolveImageKey(img, index)),
        [normalizedImages]
    );
    const coverKey = useMemo(() => {
        if (!cover || !normalizedImages.length) return imageKeys[0] || null;
        const index = normalizedImages.findIndex(
            (img) =>
                (img.id !== undefined &&
                    cover.id !== undefined &&
                    img.id === cover.id) ||
                img.url === cover.url
        );
        return imageKeys[index >= 0 ? index : 0] || null;
    }, [cover, normalizedImages, imageKeys]);
    const [activeKey, setActiveKey] = useState(() => coverKey);
    const activeIndex = useMemo(() => {
        if (!normalizedImages.length) return 0;
        if (activeKey) {
            const matchIndex = imageKeys.findIndex((key) => key === activeKey);
            if (matchIndex >= 0) return matchIndex;
        }
        if (coverKey) {
            const coverIndex = imageKeys.findIndex((key) => key === coverKey);
            if (coverIndex >= 0) return coverIndex;
        }
        return 0;
    }, [activeKey, coverKey, imageKeys, normalizedImages.length]);

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
        const nextIndex = (activeIndex - 1 + total) % total;
        setActiveKey(imageKeys[nextIndex]);
    };

    const handleNext = () => {
        if (total <= 1) return;
        const nextIndex = (activeIndex + 1) % total;
        setActiveKey(imageKeys[nextIndex]);
    };
    const activeImage = normalizedImages[activeIndex] || normalizedImages[0];

    return (
        <div className="product-detail-gallery">
            <div className="product-detail-main">
                <div
                    className="product-detail-slide"
                    key={activeImage?.id || activeIndex}
                >
                    <div className="product-detail-image-frame">
                        <img
                            src={activeImage.url}
                            alt={`${name} görseli`}
                            loading="eager"
                            decoding="async"
                        />
                    </div>
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
                            key={imageKeys[index]}
                            type="button"
                            className={`product-gallery-dot${
                                index === activeIndex ? " active" : ""
                            }`}
                            onClick={() => setActiveKey(imageKeys[index])}
                            aria-label={`Görsel ${index + 1}`}
                            aria-pressed={index === activeIndex}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
}
