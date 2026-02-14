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

const DEFAULT_PAGE = 1;
const DEFAULT_SORT = "productName,asc";
const DEFAULT_SIZE = 20;
const VALID_SORTS = new Set(["productName,asc", "productName,desc", "id,desc"]);

const parsePage = (value) => {
    const parsed = Number.parseInt(value || "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_PAGE;
};

const parseSort = (value) => (VALID_SORTS.has(value) ? value : DEFAULT_SORT);

const parseStateFromParams = (params) => ({
    page: parsePage(params.get("page")),
    sort: parseSort(params.get("sort")),
    search: params.get("q") || "",
    categoryName: params.get("category") || "",
});

const buildParamsFromState = ({page, sort, search, categoryName}) => {
    const next = new URLSearchParams();
    if (categoryName) {
        next.set("category", categoryName);
    }
    if (search) {
        next.set("q", search);
    }
    if (sort !== DEFAULT_SORT) {
        next.set("sort", sort);
    }
    if (page > DEFAULT_PAGE) {
        next.set("page", String(page));
    }
    return next;
};

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialState = parseStateFromParams(searchParams);
    const [page, setPage] = useState(initialState.page);
    const [size] = useState(DEFAULT_SIZE);
    const [sort, setSort] = useState(initialState.sort);
    const [search, setSearch] = useState(initialState.search);
    const [debouncedSearch, setDebouncedSearch] = useState(
        initialState.search.trim()
    );
    const [categoryName, setCategoryName] = useState(initialState.categoryName);

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
        const fromUrl = parseStateFromParams(searchParams);
        setPage((prev) => (prev === fromUrl.page ? prev : fromUrl.page));
        setSort((prev) => (prev === fromUrl.sort ? prev : fromUrl.sort));
        setSearch((prev) => (prev === fromUrl.search ? prev : fromUrl.search));
        setCategoryName((prev) =>
            prev === fromUrl.categoryName ? prev : fromUrl.categoryName
        );
    }, [searchParams]);

    useEffect(() => {
        const nextParams = buildParamsFromState({
            page,
            sort,
            search: search.trim(),
            categoryName,
        });
        const currentParams = new URLSearchParams(searchParams);
        if (nextParams.toString() === currentParams.toString()) {
            return;
        }
        setSearchParams(nextParams, {replace: true});
    }, [page, sort, search, categoryName, searchParams, setSearchParams]);

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
