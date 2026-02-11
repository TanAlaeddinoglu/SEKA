import { NavLink } from "react-router-dom";

export default function CategoryCard({ category, icon }) {
    return (
        <NavLink
            className="category-card"
            to={`/urunler?category=${encodeURIComponent(
                category.categoryName
            )}`}
            aria-label={`${category.categoryName} kategorisini görüntüle`}
        >
            <div className="category-icon">{icon}</div>
            <div className="category-name">{category.categoryName}</div>
            <div className="category-count">
                {category.productCount ?? 0} Ürün
            </div>
        </NavLink>
    );
}
