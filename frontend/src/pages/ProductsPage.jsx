import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductFilters from "../features/public/product/components/ProductFilters";
import ProductGrid from "../features/public/product/components/ProductGrid";
import ProductsPageSkeleton from "./ProductsPageSkeleton";
import { usePublicProducts } from "../features/public/product/hooks/usePublicProducts";
import { usePublicCategories } from "../features/public/category/hooks/usePublicCategories";
import usePageMeta from "../shared/seo/usePageMeta";
import { siteConfig } from "../shared/config/siteConfig";
import "./css/ProductsPage.css";

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFromUrl = searchParams.get("category") || "";
    const [page, setPage] = useState(1);
    const [size] = useState(20);
    const [sort, setSort] = useState("productName,asc");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [categoryName, setCategoryName] = useState(categoryFromUrl);

    usePageMeta({
        title: "Seka Ambalaj | Ürünler",
        description: "Ambalaj ürünleri ve ürün listesi.",
        canonical: `${siteConfig.siteUrl}/urunler`,
        image: `${siteConfig.siteUrl}/Seka-Logo.png`,
    });

    useEffect(() => {
        const handle = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 300);
        return () => clearTimeout(handle);
    }, [search]);

    useEffect(() => {
        setCategoryName(categoryFromUrl);
        setPage(1);
    }, [categoryFromUrl]);

    const { data: categories = [] } = usePublicCategories();

    const { data, isLoading, isError } = usePublicProducts({
        page: Math.max(page - 1, 0),
        size,
        sort,
        search: debouncedSearch || undefined,
        categoryName: categoryName || undefined,
    });

    const products = data?.content || [];

    return (
        <div className="public-products-page">
            <div className="page-header">
                <h2>ÜRÜNLERİMİZ</h2>
            </div>

            <ProductFilters
                search={search}
                onSearchChange={(value) => {
                    setPage(1);
                    setSearch(value);
                }}
                sort={sort}
                onSortChange={(value) => {
                    setPage(1);
                    setSort(value);
                }}
                categories={categories}
                categoryId={categoryName}
                onCategoryChange={(value) => {
                    setPage(1);
                    setCategoryName(value);
                    setSearchParams((prev) => {
                        const params = new URLSearchParams(prev);
                        if (value) {
                            params.set("category", value);
                        } else {
                            params.delete("category");
                        }
                        return params;
                    });
                }}
            />

            {isError ? (
                <div className="product-empty">Ürünler yüklenemedi.</div>
            ) : isLoading && !data ? (
                <ProductsPageSkeleton />
            ) : (
                <ProductGrid products={products} />
            )}

            <div className="pagination">
                <button
                    disabled={!data || page <= 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                    Önceki
                </button>
                <span>
                    {data
                        ? `Sayfa ${page} / ${data.totalPages}`
                        : "Sayfa - / -"}
                </span>
                <button
                    disabled={!data || (data.totalPages ? page >= data.totalPages : false)}
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    Sonraki
                </button>
            </div>
        </div>
    );
}
