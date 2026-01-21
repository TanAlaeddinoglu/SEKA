import "../styles/ProductListControls.css";

export default function ProductListControls({
                                                search,
                                                sort,
                                                size,
                                                onSearchChange,
                                                onSortChange,
                                                onSizeChange,
                                            }) {
    return (
        <div className="product-controls">
            <div className="control-item">
                <label>Arama</label>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Ürün, marka, kategori..."
                />
            </div>
            <div className="control-item">
                <label>Sıralama</label>
                <select
                    value={sort}
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    <option value="productName,asc">
                        Ürün Adı (A → Z)
                    </option>
                    <option value="productName,desc">
                        Ürün Adı (Z → A)
                    </option>
                    <option value="brand,asc">
                        Marka (A → Z)
                    </option>
                    <option value="brand,desc">
                        Marka (Z → A)
                    </option>
                </select>
            </div>

            <div className="control-item">
                <label>Sayfa Boyutu</label>
                <select
                    value={size}
                    onChange={(e) => onSizeChange(Number(e.target.value))}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
        </div>
    );
}
