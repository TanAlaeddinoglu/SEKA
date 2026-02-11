import ProductCard from "./ProductCard";
import "../styles/ProductGrid.css";

export default function ProductGrid({ products = [] }) {
    if (!products.length) {
        return <div className="product-empty">Ürün bulunamadı.</div>;
    }

    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
