import "../styles/ProductTable.css";
import { getUnitTypeLabel } from "../constants/unitTypeLabels";
import { useNavigate } from "react-router-dom";

export default function ProductTable({ products, onDelete }) {
    const navigate = useNavigate();

    return (
        <>
            {/* ===== DESKTOP TABLE ===== */}
            <table className="product-table desktop-only">
                <thead>
                <tr>
                    <th>Ürün</th>
                    <th>Marka</th>
                    <th>Slug</th>
                    <th>Açıklama</th>
                    <th>Birim</th>
                    <th>Paket/Koli</th>
                    <th>Renk</th>
                    <th>Ölçü</th>
                    <th>Ağırlık</th>
                    <th>Görsel</th>
                    <th />
                </tr>
                </thead>

                <tbody>
                {products.map((p) => (
                    <tr key={p.id}>
                        <td className="bold">{p.name}</td>
                        <td>{p.brand || "-"}</td>
                        <td className="truncate">{p.slug}</td>

                        <td className="truncate description">
                            {p.description || "-"}
                        </td>

                        <td>
                            {p.productFeature
                                ? getUnitTypeLabel(p.productFeature.unitType)
                                : "-"}
                        </td>

                        <td>
                            {p.productFeature
                                ? `${p.productFeature.unitPerPack} / ${p.productFeature.unitPerCarton}`
                                : "-"}
                        </td>

                        <td>{p.productFeature?.color || "-"}</td>
                        <td>{p.productFeature?.size || "-"}</td>
                        <td>{p.productFeature?.weight || "-"}</td>
                        <td>{p.images?.length || 0}</td>

                        <td className="actions">
                            <button
                                onClick={() =>
                                    navigate(`/admin/products/${p.id}/edit`)
                                }
                            >
                                Düzenle
                            </button>
                            <button
                                className="danger"
                                onClick={() => onDelete(p.id)}
                            >
                                Sil
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* ===== MOBILE CARDS ===== */}
            <div className="product-cards mobile-only">
                {products.map((p) => (
                    <div key={p.id} className="product-card">
                        <div className="card-title">{p.name}</div>

                        <CardRow label="Marka" value={p.brand} />
                        <CardRow label="Slug" value={p.slug} />
                        <CardRow
                            label="Açıklama"
                            value={p.description || "-"}
                            valueClassName="card-description"
                        />

                        <CardRow
                            label="Birim"
                            value={
                                p.productFeature
                                    ? getUnitTypeLabel(p.productFeature.unitType)
                                    : "-"
                            }
                        />
                        <CardRow
                            label="Paket / Koli"
                            value={
                                p.productFeature
                                    ? `${p.productFeature.unitPerPack} / ${p.productFeature.unitPerCarton}`
                                    : "-"
                            }
                        />
                        <CardRow
                            label="Renk"
                            value={p.productFeature?.color}
                        />
                        <CardRow
                            label="Ölçü"
                            value={p.productFeature?.size}
                        />
                        <CardRow
                            label="Ağırlık"
                            value={p.productFeature?.weight}
                        />
                        <CardRow
                            label="Görsel Sayısı"
                            value={p.images?.length || 0}
                        />

                        <div className="card-actions">
                            <button
                                onClick={() =>
                                    navigate(`/admin/products/${p.id}/edit`)
                                }
                            >
                                Düzenle
                            </button>
                            <button
                                className="danger"
                                onClick={() => onDelete(p.id)}
                            >
                                Sil
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

/* --- Küçük yardımcı --- */
function CardRow({ label, value, multiline }) {
    return (
        <div className={`card-row ${multiline ? "multiline" : ""}`}>
            <span>{label}</span>
            <span>{value || "-"}</span>
        </div>
    );
}
