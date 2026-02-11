import "../styles/CategoryProductSection.css";
import ProductCard from "./ProductCard";

export default function CategoryProductSection({
    title,
    products = [],
}) {
    if (!products.length) return null;

    return (
        <section className="category-product-section">
            <div className="category-product-header">
                <h2>{title}</h2>
            </div>
            <div className="category-product-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
