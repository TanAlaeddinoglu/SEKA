import "./css/ProductsPageSkeleton.css";
import ProductGridSkeleton from "../features/public/product/components/ProductGridSkeleton";

export default function ProductsPageSkeleton() {
    return (
        <div className="products-page-skeleton">
            <div className="skeleton-header" />
            <div className="skeleton-filters">
                <div className="skeleton-input" />
                <div className="skeleton-input" />
                <div className="skeleton-buttons" />
            </div>
            <ProductGridSkeleton count={8} />
            <div className="skeleton-pagination" />
        </div>
    );
}
