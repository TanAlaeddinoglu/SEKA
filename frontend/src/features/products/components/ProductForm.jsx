import { useEffect, useState } from "react";
import { useCategories } from "../../categories/hooks/useCategories";
import "../styles/ProductForm.css";

export default function ProductForm({
                                        initialData,
                                        onSubmit,
                                        loading,
                                    }) {
    const { data: categories, isLoading } = useCategories();

    const [form, setForm] = useState({
        name: "",
        brand: "",
        categoryId: "",
        description: "",
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name ?? "",
                brand: initialData.brand ?? "",
                categoryId: initialData.categoryId ?? "",
                description: initialData.description ?? "",
            });
        }
    }, [initialData]);


    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit({
            name: form.name,
            brand: form.brand,
            categoryId: Number(form.categoryId),
            description: form.description,
        });
    };

    return (
        <form className="product-form" onSubmit={handleSubmit}>
            <input
                placeholder="Ürün adı"
                value={form.name}
                onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                }
                required
            />

            <input
                placeholder="Marka"
                value={form.brand}
                onChange={(e) =>
                    setForm({ ...form, brand: e.target.value })
                }
            />

            <select
                value={form.categoryId}
                onChange={(e) =>
                    setForm({
                        ...form,
                        categoryId: e.target.value,
                    })
                }
                required
                disabled={isLoading}
            >
                <option value="">Kategori seçiniz</option>

                {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.categoryName}
                    </option>
                ))}
            </select>

            <textarea
                placeholder="Açıklama"
                value={form.description}
                onChange={(e) =>
                    setForm({
                        ...form,
                        description: e.target.value,
                    })
                }
                rows={3}
            />

            <button disabled={loading}>
                {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
        </form>
    );
}
