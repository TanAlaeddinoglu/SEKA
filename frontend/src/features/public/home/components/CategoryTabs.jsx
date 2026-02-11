import "../../home/styles/CategoryTabs.css";

export default function CategoryTabs({
    categories = [],
    active,
    onChange,
}) {
    return (
        <div className="category-tabs">
            <button
                type="button"
                className={!active ? "active" : ""}
                onClick={() => onChange("")}
            >
                Tüm Ürünler
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    type="button"
                    className={active === category.categoryName ? "active" : ""}
                    onClick={() => onChange(category.categoryName)}
                >
                    {category.categoryName}
                </button>
            ))}
        </div>
    );
}
