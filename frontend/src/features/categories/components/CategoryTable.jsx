import "./CategoryTable.css";

export default function CategoryTable({ data, onEdit, onDelete }) {
    return (
        <table className="category-table">
            <thead>
            <tr>
                <th>Kategori Adı</th>
                <th>Ürün Sayısı</th>
                <th>Durum</th>
                <th />
            </tr>
            </thead>
            <tbody>
            {data.map((c) => (
                <tr key={c.id}>
                    <td>{c.categoryName}</td>
                    <td>{c.productCount}</td>
                    <td>{c.isActive ? "Aktif" : "Pasif"}</td>
                    <td className="category-actions">
                        <button className="edit" onClick={() => onEdit(c)}>
                            Düzenle
                        </button>
                        <button
                            className="delete"
                            onClick={() => onDelete(c.id)}
                        >
                            Sil
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
