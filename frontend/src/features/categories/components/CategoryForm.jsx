import { useEffect, useState } from "react";
import "./CategoryForm.css";

export default function CategoryForm({ initialData, onSubmit, loading }) {
    const [form, setForm] = useState({
        categoryName: "",
        isActive: true,
    });

    const initialCategoryName = initialData?.categoryName ?? "";
    const initialIsActive = initialData?.isActive ?? true;

    useEffect(() => {
        setForm((prev) => {
            const next = {
                categoryName: initialCategoryName,
                isActive: initialIsActive,
            };
            if (
                prev.categoryName === next.categoryName &&
                prev.isActive === next.isActive
            ) {
                return prev;
            }
            return next;
        });
    }, [initialCategoryName, initialIsActive]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form className="category-form" onSubmit={handleSubmit}>
            <h3 className="category-form-title">
                {initialData ? "Kategori Düzenle" : "Kategori Ekle"}
            </h3>

            <input
                type="text"
                placeholder="Category name"
                value={form.categoryName}
                onChange={(e) =>
                    setForm({ ...form, categoryName: e.target.value })
                }
                required
            />

            <div className="active-row">
                <label htmlFor="active-checkbox">Aktif</label>
                <input
                    id="active-checkbox"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                        setForm({ ...form, isActive: e.target.checked })
                    }
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
        </form>
    );
}
