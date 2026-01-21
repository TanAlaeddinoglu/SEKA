import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import ProductTable from "../components/ProductTable";
import ProductListControls from "../components/ProductListControls";
import {useProducts} from "../hooks/useProducts";
import {useDeleteProduct} from "../hooks/useDeleteProduct";

import "../styles/AdminProductsPage.css";

export default function AdminProductsPage() {
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sort, setSort] = useState("productName,asc");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const deleteMutation = useDeleteProduct();

    const handleDelete = (id) => {
        const ok = window.confirm(
            "Bu ürünü silmek istediğinize emin misiniz?"
        );
        if (!ok) return;

        deleteMutation.mutate(id);
    };

    useEffect(() => {
        const handle = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 300);
        return () => clearTimeout(handle);
    }, [search]);

    const {data, isLoading, isError} = useProducts({
        page,
        size,
        sort,
        search: debouncedSearch || undefined,
    });

    if (isError)
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
                search={search}
                sort={sort}
                size={size}
                onSearchChange={(value) => {
                    setPage(0);
                    setSearch(value.toLowerCase());
                }}
                onSortChange={(v) => {
                    setPage(0);
                    setSort(v);
                }}
                onSizeChange={(v) => {
                    setPage(0);
                    setSize(v);
                }}
            />

            {isLoading && !data ? (
                <p>Yükleniyor...</p>
            ) : (
                <ProductTable
                    products={data?.content || []}
                    onEdit={(p) =>
                        navigate(`/admin/products/${p.id}`)
                    }
                    onDelete={(id) => handleDelete(id)}
                />
            )}

            {/* PAGINATION */}
            <div className="pagination">
                <button
                    disabled={!data || data.first}
                    onClick={() => setPage((p) => p - 1)}
                >
                    Önceki
                </button>

                <span>
                    {data
                        ? `Sayfa ${data.number + 1} / ${data.totalPages}`
                        : "Sayfa - / -"}
                </span>

                <button
                    disabled={!data || data.last}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Sonraki
                </button>
            </div>
        </div>
    );
}
