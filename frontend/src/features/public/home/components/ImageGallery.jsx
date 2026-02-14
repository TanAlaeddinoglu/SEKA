import { useEffect, useMemo, useRef, useState } from "react";
import "../../home/styles/ImageGallery.css";

const defaultCopy = [
    {
        kicker: "Ambalaj Çözümleri",
        title: "Markanız İçin Güçlü Sunum",
        text: "Ürünlerinizi güvende tutan, raflarda fark yaratan ambalaj tasarımları.",
    },
    {
        kicker: "Kurumsal Üretim",
        title: "Kalite ve Süreklilik",
        text: "Her aşamada kontrol edilen üretim ile güvenilir tedarik.",
    },
    {
        kicker: "Yeni Koleksiyon",
        title: "Modern ve İşlevsel",
        text: "Estetik, dayanıklı ve ihtiyaçlara uygun ambalaj çözümleri.",
    },
];

function toTitle(value) {
    const cleaned = value
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .trim();
    if (!cleaned) return "Galeri";
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export default function ImageGallery({ slides, intervalMs = 5000 }) {
    const sectionRef = useRef(null);
    const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
    const viewportWidthRef = useRef(null);
    const resolvedSlides = useMemo(() => {
        if (Array.isArray(slides) && slides.length) {
            return slides;
        }

        const images = import.meta.glob(
            "../../../../assets/imageGallery/*.{jpg,jpeg,png,webp,avif}",
            { eager: true, import: "default" }
        );

        const entries = Object.entries(images)
            .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
            .map(([path, src], index) => {
                const fileName = path.split("/").pop() || "";
                const copy = defaultCopy[index % defaultCopy.length];
                return {
                    src,
                    alt: copy?.title || toTitle(fileName),
                    ...copy,
                };
            });

        return entries;
    }, [slides]);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);
    const totalSlides = resolvedSlides.length;
    const slideUnit = totalSlides ? 100 / totalSlides : 100;
    const currentIndex = totalSlides
        ? Math.min(activeIndex, totalSlides - 1)
        : 0;

    useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduceMotion(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        const element = sectionRef.current;
        if (!element) return;

        const readViewport = () => ({
            height: window.visualViewport?.height || window.innerHeight,
            width: window.visualViewport?.width || window.innerWidth,
        });

        const updateHeight = () => {
            const {height} = readViewport();
            const rect = element.getBoundingClientRect();
            const available = Math.max(320, height - rect.top);
            element.style.setProperty("--gallery-height", `${available}px`);
        };

        const handleResize = () => {
            const {width} = readViewport();
            if (viewportWidthRef.current === null) {
                viewportWidthRef.current = width;
                updateHeight();
                return;
            }

            // Ignore mobile address-bar / scroll-induced viewport height changes.
            if (Math.abs(width - viewportWidthRef.current) < 2) {
                return;
            }

            viewportWidthRef.current = width;
            updateHeight();
        };

        const {width} = readViewport();
        viewportWidthRef.current = width;
        updateHeight();

        const rafId = window.requestAnimationFrame(updateHeight);
        window.addEventListener("resize", handleResize);
        window.visualViewport?.addEventListener("resize", handleResize);

        return () => {
            window.cancelAnimationFrame(rafId);
            window.removeEventListener("resize", handleResize);
            window.visualViewport?.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const element = sectionRef.current;
        if (!element) return;

        const updateHeight = () => {
            const viewportHeight =
                window.visualViewport?.height || window.innerHeight;
            const rect = element.getBoundingClientRect();
            const available = Math.max(320, viewportHeight - rect.top);
            element.style.setProperty("--gallery-height", `${available}px`);
        };

        const orientationHandler = () => {
            window.requestAnimationFrame(updateHeight);
        };
        window.addEventListener("orientationchange", orientationHandler);

        return () => {
            window.removeEventListener("orientationchange", orientationHandler);
        };
    }, []);

    useEffect(() => {
        const first = resolvedSlides[0];
        if (!first?.src) return;
        const existing = document.head.querySelector(
            `link[data-gallery-preload="true"][href="${first.src}"]`
        );
        if (existing) return;
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = first.src;
        link.setAttribute("data-gallery-preload", "true");
        link.setAttribute("fetchpriority", "high");
        if (first.srcSet) {
            link.setAttribute("imagesrcset", first.srcSet);
        }
        if (first.sizes) {
            link.setAttribute("imagesizes", first.sizes);
        }
        document.head.appendChild(link);
    }, [resolvedSlides]);

    useEffect(() => {
        if (totalSlides <= 1 || isPaused || reduceMotion) return;
        const id = window.setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % totalSlides);
        }, intervalMs);
        return () => window.clearInterval(id);
    }, [intervalMs, isPaused, reduceMotion, totalSlides]);

    if (!totalSlides) {
        return (
            <section className="home-gallery">
                <div className="gallery-empty">Galeri hazırlanıyor.</div>
            </section>
        );
    }

    const handlePrev = () => {
        if (totalSlides <= 1) return;
        setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const handleNext = () => {
        if (totalSlides <= 1) return;
        setActiveIndex((prev) => (prev + 1) % totalSlides);
    };

    const handleTouchStart = (event) => {
        if (event.touches?.length !== 1) return;
        const touch = event.touches[0];
        touchStartRef.current = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now(),
        };
    };

    const handleTouchEnd = (event) => {
        const touch = event.changedTouches?.[0];
        if (!touch) return;
        const { x, y, time } = touchStartRef.current;
        const dx = touch.clientX - x;
        const dy = touch.clientY - y;
        const dt = Date.now() - time;

        if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
        if (dt > 800) return;

        if (dx < 0) {
            handleNext();
        } else {
            handlePrev();
        }
    };

    return (
        <section
            className="home-gallery"
            aria-roledescription="carousel"
            aria-label="Ana sayfa görsel galerisi"
            ref={sectionRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="gallery-frame">
                <div
                    className="gallery-track"
                    style={{
                        transform: `translate3d(-${currentIndex * slideUnit}%, 0, 0)`,
                        width: `${totalSlides * 100}%`,
                        "--slides-count": totalSlides || 1,
                    }}
                >
                    {resolvedSlides.map((slide, index) => (
                        <article
                            key={`${slide.src}-${index}`}
                            className={`gallery-slide${
                                index === currentIndex ? " is-active" : ""
                            }`}
                            aria-hidden={index !== currentIndex}
                        >
                            {slide.src ? (
                                slide.sources?.length ? (
                                    <picture>
                                        {slide.sources.map((source) => (
                                            <source
                                                key={`${source.type}-${source.srcSet}`}
                                                type={source.type}
                                                srcSet={source.srcSet}
                                                sizes={source.sizes}
                                            />
                                        ))}
                                        <img
                                            src={slide.src}
                                            srcSet={slide.srcSet}
                                            sizes={slide.sizes}
                                            alt={slide.alt || "Galeri görseli"}
                                            className="gallery-image"
                                            loading={index === 0 ? "eager" : "lazy"}
                                            decoding="async"
                                            fetchpriority={
                                                index === 0 ? "high" : "low"
                                            }
                                        />
                                    </picture>
                                ) : (
                                    <img
                                        src={slide.src}
                                        srcSet={slide.srcSet}
                                        sizes={slide.sizes}
                                        alt={slide.alt || "Galeri görseli"}
                                        className="gallery-image"
                                        loading={index === 0 ? "eager" : "lazy"}
                                        decoding="async"
                                        fetchPriority={
                                            index === 0 ? "high" : "low"
                                        }
                                    />
                                )
                            ) : (
                                <div className="gallery-image gallery-image-fallback" />
                            )}
                            <div className="gallery-overlay" />
                            <div className="gallery-content">
                                {slide.kicker ? (
                                    <span className="gallery-kicker">
                                        {slide.kicker}
                                    </span>
                                ) : null}
                                {slide.title ? (
                                    <h1 className="gallery-title">
                                        {slide.title}
                                    </h1>
                                ) : null}
                                {slide.text ? (
                                    <p className="gallery-text">{slide.text}</p>
                                ) : null}
                            </div>
                        </article>
                    ))}
                </div>

                {totalSlides > 1 ? (
                    <>
                        <div className="gallery-dots" role="tablist">
                            {resolvedSlides.map((slide, index) => (
                                <button
                                    key={`${slide.alt || "slide"}-${index}`}
                                    type="button"
                                    className={`gallery-dot${
                                        index === currentIndex ? " active" : ""
                                    }`}
                                    onClick={() => setActiveIndex(index)}
                                    aria-label={`Slayt ${index + 1}`}
                                    aria-pressed={index === currentIndex}
                                />
                            ))}
                        </div>
                        <div className="gallery-controls">
                            <button
                                type="button"
                                className="gallery-btn"
                                onClick={handlePrev}
                                aria-label="Önceki slayt"
                            >
                                <span aria-hidden="true">‹</span>
                            </button>
                            <button
                                type="button"
                                className="gallery-btn"
                                onClick={handleNext}
                                aria-label="Sonraki slayt"
                            >
                                <span aria-hidden="true">›</span>
                            </button>
                        </div>
                    </>
                ) : null}
            </div>
        </section>
    );
}
