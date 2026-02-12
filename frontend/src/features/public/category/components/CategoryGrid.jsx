import { useEffect, useRef, useState } from "react";
import CategoryCard from "./CategoryCard";
import "../styles/CategoryGrid.css";
import { categoryIconMap } from "../icons/categoryIconMap";
import { DEFAULT_ICON_KEY, ICONS_BY_KEY } from "../icons/icons.jsx";

const getCategoryIcon = (category) => {
    const name = (category?.categoryName || "").trim();
    const key =
        categoryIconMap[name] ||
        categoryIconMap[name.toLowerCase()] ||
        DEFAULT_ICON_KEY;
    return ICONS_BY_KEY[key] || ICONS_BY_KEY[DEFAULT_ICON_KEY];
};

export default function CategoryGrid({
    categories = [],
    loading,
    error,
    emptyText = "Kategori bulunamadı.",
    rows = 2,
    columns = 5,
}) {
    const trackRef = useRef(null);
    const [canScroll, setCanScroll] = useState(false);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const update = () => {
            const { scrollLeft, scrollWidth, clientWidth } = track;
            const maxScroll = scrollWidth - clientWidth;
            setCanScroll(maxScroll > 2);
            setAtStart(scrollLeft <= 2);
            setAtEnd(scrollLeft >= maxScroll - 2);
            setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
        };

        update();
        track.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);

        return () => {
            track.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [categories.length, loading]);

    const scrollByAmount = (direction) => {
        const track = trackRef.current;
        if (!track) return;
        const amount = Math.max(240, track.clientWidth);
        track.scrollBy({ left: direction * amount, behavior: "smooth" });
    };

    const skeletonCount = Math.max(6, rows * columns);

    if (loading) {
        return (
            <div className="categories-carousel">
                <div
                    className="categories-track"
                    ref={trackRef}
                    style={{
                        "--categories-rows": rows,
                        "--categories-columns": columns,
                    }}
                >
                    {Array.from({ length: skeletonCount }).map((_, index) => (
                        <div className="category-card skeleton" key={index}>
                            <div className="category-icon" />
                            <div className="category-name"> </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="categories-empty">
                Kategoriler yüklenemedi.
            </div>
        );
    }

    if (!categories.length) {
        return <div className="categories-empty">{emptyText}</div>;
    }

    return (
        <div className={`categories-carousel${canScroll ? " has-nav" : ""}`}>
            <div
                className="categories-track"
                ref={trackRef}
                style={{
                    "--categories-rows": rows,
                    "--categories-columns": columns,
                }}
            >
                {categories.map((category, index) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        icon={getCategoryIcon(category)}
                    />
                ))}
            </div>
            <div className="categories-controls">
                <div className="categories-progress" aria-hidden="true">
                    <span
                        className="categories-progress-bar"
                        style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                    />
                </div>
                <div className="categories-buttons">
                    <button
                        type="button"
                        className={`categories-nav prev${
                            canScroll ? "" : " is-hidden"
                        }`}
                        onClick={() => scrollByAmount(-1)}
                        aria-label="Önceki kategoriler"
                        disabled={!canScroll || atStart}
                        aria-hidden={!canScroll}
                        tabIndex={canScroll ? 0 : -1}
                    >
                        <span aria-hidden="true">‹</span>
                    </button>
                    <button
                        type="button"
                        className={`categories-nav next${
                            canScroll ? "" : " is-hidden"
                        }`}
                        onClick={() => scrollByAmount(1)}
                        aria-label="Sonraki kategoriler"
                        disabled={!canScroll || atEnd}
                        aria-hidden={!canScroll}
                        tabIndex={canScroll ? 0 : -1}
                    >
                        <span aria-hidden="true">›</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
