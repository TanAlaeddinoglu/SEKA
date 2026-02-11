import "../styles/ProductGridSkeleton.css";

export default function ProductGridSkeleton({ count = 8 }) {
    return (
        <div className="product-grid-skeleton">
            {Array.from({ length: count }).map((_, index) => (
                <div className="product-card-skeleton" key={index}>
                    <div className="skeleton-media" />
                    <div className="skeleton-body">
                        <div className="skeleton-line title" />
                        <div className="skeleton-line" />
                        <div className="skeleton-line" />
                    </div>
                </div>
            ))}
        </div>
    );
}
