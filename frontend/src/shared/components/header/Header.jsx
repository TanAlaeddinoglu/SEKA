import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useCategories } from "../../../features/categories/hooks/useCategories";
import "./Header.css";

const NAV_LINKS = [
    { label: "ÜRÜNLER", to: "/urunler" },
    { label: "HAKKIMIZDA", to: "/hakkimizda" },
    { label: "REFERANSLAR", to: "/referanslar" },
    { label: "KATALOG", to: "/katalog" },
    { label: "İLETİŞİM", to: "/iletisim" },
];

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [categoriesPrefetch, setCategoriesPrefetch] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const headerRef = useRef(null);
    const hamburgerRef = useRef(null);

    const closeAllMenus = () => {
        setMenuOpen(false);
        setCategoriesOpen(false);
    };

    const handleCategoryClick = () => {
        if (!menuOpen) return;
        closeAllMenus();
    };

    const { data: categories = [], isLoading, isError } = useCategories({
        enabled: categoriesOpen || categoriesPrefetch || menuOpen,
    });

    const activeCategories = categories.filter((category) => category.isActive);
    const visibleCategories = activeCategories.slice(0, 10);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!headerRef.current?.contains(event.target)) {
                closeAllMenus();
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("touchstart", handlePointerDown);
        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("touchstart", handlePointerDown);
        };
    }, []);

    useEffect(() => {
        if (!menuOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeAllMenus();
                hamburgerRef.current?.focus();
                return;
            }

            if (event.key !== "Tab") return;

            const focusable = Array.from(
                headerRef.current?.querySelectorAll(
                    "a, button, [tabindex]:not([tabindex=\"-1\"])"
                ) || []
            ).filter((el) => el.getClientRects().length > 0);

            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [menuOpen]);

    return (
        <header
            className={`site-header ${scrolled ? "scrolled" : ""}`}
            ref={headerRef}
        >
            <div className="header-inner">
                <NavLink to="/" className="site-logo" onClick={closeAllMenus}>
                    <img
                        src="/Seka-Logo.png"
                        alt="Seka Logo"
                        className="site-logo-image"
                        width="128"
                        height="64"
                    />
                </NavLink>

                <nav
                    id="main-nav"
                    className={`header-nav ${menuOpen ? "open" : ""}`}
                    aria-label="Main"
                >
                    <ul>
                        <li
                            className="categories-item"
                            onMouseEnter={() => setCategoriesPrefetch(true)}
                        >
                            <NavLink
                                to="/kategoriler"
                                className={`header-link categories-trigger ${
                                    categoriesOpen ? "open" : ""
                                }`}
                                onClick={handleCategoryClick}
                                aria-expanded={categoriesOpen}
                                aria-haspopup="true"
                                onFocus={() => setCategoriesPrefetch(true)}
                            >
                                KATEGORİLER
                                <span className="categories-arrow" aria-hidden="true">
                                    &gt;
                                </span>
                            </NavLink>

                            <div
                                className={`categories-panel ${
                                    categoriesOpen ? "open" : ""
                                }`}
                                role="region"
                                aria-label="Kategoriler"
                            >
                                <div className="categories-panel-inner">
                                    <NavLink
                                        to="/kategoriler"
                                        className="categories-all"
                                        onClick={closeAllMenus}
                                    >
                                        Tüm Kategoriler
                                    </NavLink>

                                    {isLoading && (
                                        <div className="categories-skeleton">
                                            {Array.from({ length: 4 }).map(
                                                (_, index) => (
                                                    <span
                                                        key={index}
                                                        className="skeleton-row"
                                                    />
                                                )
                                            )}
                                        </div>
                                    )}

                                    {isError && (
                                        <div className="categories-state">
                                            Kategoriler yüklenemedi.
                                        </div>
                                    )}

                                    {!isLoading && !isError && (
                                        <div className="categories-list">
                                            {visibleCategories.length === 0 ? (
                                                <div className="categories-empty">
                                                    Kategori bulunamadı.
                                                </div>
                                            ) : (
                                                visibleCategories.map((category) => (
                                                    <NavLink
                                                        key={category.id}
                                                        to={`/urunler?category=${encodeURIComponent(
                                                            category.categoryName
                                                        )}`}
                                                        className="category-chip"
                                                        onClick={closeAllMenus}
                                                    >
                                                        {category.categoryName}
                                                    </NavLink>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>

                        {NAV_LINKS.map((link) => (
                            <li key={link.label}>
                                <NavLink
                                    to={link.to}
                                    className="header-link"
                                    onClick={closeAllMenus}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <button
                    type="button"
                    className={`hamburger ${menuOpen ? "open" : ""}`}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    aria-controls="main-nav"
                    ref={hamburgerRef}
                    onClick={() => {
                        setMenuOpen((prev) => !prev);
                        if (menuOpen) setCategoriesOpen(false);
                    }}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>
        </header>
    );
}
