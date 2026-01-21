import { useEffect, useState } from "react";
import "../styles/ProductFeatureForm.css";
import { UNIT_TYPE_LABELS } from "../constants/unitTypeLabels";

export default function ProductFeatureForm({
                                               initialData,
                                               onSubmit,
                                               loading,
                                           }) {
    const [form, setForm] = useState({
        unitType: "",
        unitPerPack: "",
        unitPerCarton: "",
        color: "",
        size: "",
        weight: "",
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                unitType: initialData.unitType ?? "",
                unitPerPack: initialData.unitPerPack ?? "",
                unitPerCarton: initialData.unitPerCarton ?? "",
                color: initialData.color ?? "",
                size: initialData.size ?? "",
                weight: initialData.weight ?? "",
            });
        } else {
            setForm({
                unitType: "",
                unitPerPack: "",
                unitPerCarton: "",
                color: "",
                size: "",
                weight: "",
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // unitType boşsa göndermeyelim (backend patlamasın)
        const payload = {
            ...form,
            unitType: form.unitType || null,
        };

        onSubmit(payload);
    };

    return (
        <form className="product-feature-form" onSubmit={handleSubmit}>
            <h3>Ürün Özellikleri</h3>

            {/* ===== BİRİM TÜRÜ ===== */}
            <select
                value={form.unitType}
                onChange={(e) =>
                    setForm({ ...form, unitType: e.target.value })
                }
            >
                <option value="">Birim seçiniz</option>
                {Object.entries(UNIT_TYPE_LABELS).map(
                    ([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    )
                )}
            </select>

            <input
                type="number"
                placeholder="Paket içi adet"
                value={form.unitPerPack}
                onChange={(e) =>
                    setForm({ ...form, unitPerPack: e.target.value })
                }
            />

            <input
                type="number"
                placeholder="Koli içi adet"
                value={form.unitPerCarton}
                onChange={(e) =>
                    setForm({ ...form, unitPerCarton: e.target.value })
                }
            />

            <input
                placeholder="Renk"
                value={form.color}
                onChange={(e) =>
                    setForm({ ...form, color: e.target.value })
                }
            />

            <input
                placeholder="Ölçü"
                value={form.size}
                onChange={(e) =>
                    setForm({ ...form, size: e.target.value })
                }
            />

            <input
                placeholder="Ağırlık"
                value={form.weight}
                onChange={(e) =>
                    setForm({ ...form, weight: e.target.value })
                }
            />

            <button disabled={loading}>
                {loading
                    ? "Kaydediliyor..."
                    : initialData
                        ? "Özellikleri Güncelle"
                        : "Özellikleri Kaydet"}
            </button>
        </form>
    );
}
