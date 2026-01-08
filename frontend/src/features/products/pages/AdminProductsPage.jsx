import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductTable from "../components/ProductTable";
import ProductListControls from "../components/ProductListControls";
import { useProducts } from "../hooks/useProducts";
import { useDeleteProduct } from "../hooks/useDeleteProduct";

import "../styles/AdminProductsPage.css";

export default function AdminProductsPage() {
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sort, setSort] = useState("productName,asc");

    const deleteMutation = useDeleteProduct();

    const handleDelete = (id) => {
        const ok = window.confirm(
            "Bu ürünü silmek istediğinize emin misiniz?"
        );
        if (!ok) return;

        deleteMutation.mutate(id);
    };

    const { data, isLoading, isError } = useProducts({
        page,
        size,
        sort,
    });

    if (isLoading) return <p>Yükleniyor...</p>;
    if (isError || !data)
        return <p>Ürünler yüklenirken hata oluştu.</p>;

    return (
        <div className="admin-products-page">
            {/* HEADER */}
            <div className="page-header">
                <h2>Ürünler</h2>

                <button
                    className="add-product-btn"
                    onClick={() => navigate("/admin/products/new")}
                >
                    + Ürün Ekle
                </button>
            </div>

            <ProductListControls
                sort={sort}
                size={size}
                onSortChange={(v) => {
                    setPage(0);
                    setSort(v);
                }}
                onSizeChange={(v) => {
                    setPage(0);
                    setSize(v);
                }}
            />

            <ProductTable
                products={data.content}
                onEdit={(p) =>
                    navigate(`/admin/products/${p.id}`)
                }
                onDelete={(id) => handleDelete(id)}
            />

            {/* PAGINATION */}
            <div className="pagination">
                <button
                    disabled={data.first}
                    onClick={() => setPage((p) => p - 1)}
                >
                    Önceki
                </button>

                <span>
                    Sayfa {data.number + 1} / {data.totalPages}
                </span>

                <button
                    disabled={data.last}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Sonraki
                </button>
            </div>
        </div>
    );
}
