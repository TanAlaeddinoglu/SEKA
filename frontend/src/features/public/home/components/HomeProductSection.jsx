import "../../home/styles/HomeProductSection.css";
import CategoryTabs from "../../home/components/CategoryTabs.jsx";
import ProductCarousel from "../../home/components/ProductCarousel.jsx";
import ProductGridSkeleton from "../../product/components/ProductGridSkeleton.jsx";
import { NavLink } from "react-router-dom";

export default function HomeProductSection({
    title,
    categories,
    activeCategory,
    onCategoryChange,
    products,
    loading,
}) {
    return (
        <section className="home-product-section">
            <div className="home-product-top">
                <div className="home-product-header">
                    <h2>{title}</h2>
                </div>

                <div className="home-product-actions">
                    <NavLink className="view-all-btn" to="/urunler">
                        Tüm Ürünler
                    </NavLink>
                </div>
            </div>

            <CategoryTabs
                categories={categories}
                active={activeCategory}
                onChange={onCategoryChange}
            />

            {loading ? (
                <ProductGridSkeleton count={5} />
            ) : (
                <ProductCarousel products={products} />
            )}
        </section>
    );
}
