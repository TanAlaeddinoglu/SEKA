import "../styles/ProductFilters.css";

export default function ProductFilters({
    search,
    onSearchChange,
    sort,
    onSortChange,
    categories = [],
    categoryId,
    onCategoryChange,
}) {
    return (
        <div className="product-filters">
            <div className="filter-search">
                <input
                    type="text"
                    placeholder="Ürün ara"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                />
            </div>

            <div className="filter-group">
                <select
                    value={categoryId || ""}
                    onChange={(event) => onCategoryChange(event.target.value)}
                >
                    <option value="">Tüm Kategoriler</option>
                    {categories.map((category) => (
                        <option
                            key={category.id}
                            value={category.categoryName}
                        >
                            {category.categoryName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group sort-buttons">
                <button
                    type="button"
                    className={sort === "productName,asc" ? "active" : ""}
                    onClick={() => onSortChange("productName,asc")}
                >
                    A-Z
                </button>
                <button
                    type="button"
                    className={sort === "productName,desc" ? "active" : ""}
                    onClick={() => onSortChange("productName,desc")}
                >
                    Z-A
                </button>
                <button
                    type="button"
                    className={sort === "id,desc" ? "active" : ""}
                    onClick={() => onSortChange("id,desc")}
                >
                    Yeni
                </button>
            </div>
        </div>
    );
}
