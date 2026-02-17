import {useDeferredValue} from "react";
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
    const currentState = parseStateFromParams(searchParams);
    const page = currentState.page;
    const size = DEFAULT_SIZE;
    const sort = currentState.sort;
    const search = currentState.search;
    const categoryName = currentState.categoryName;
    const deferredSearch = useDeferredValue(search.trim());
    const hasSeoFilteredState =
        page > DEFAULT_PAGE ||
        sort !== DEFAULT_SORT ||
        Boolean(search.trim()) ||
        Boolean(categoryName);

    usePageMeta({
        title: "Seka Ambalaj | Ürünler",
        description: "Ambalaj ürünleri ve ürün listesi.",
        canonical: `${siteConfig.siteUrl}/urunler`,
        image: `${siteConfig.siteUrl}/Seka-Logo.png`,
        robots: hasSeoFilteredState
            ? "noindex, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
            : undefined,
    });

    const updateSearchParams = (nextState) => {
        const nextParams = buildParamsFromState(nextState);
        if (nextParams.toString() === searchParams.toString()) {
            return;
        }
        setSearchParams(nextParams, {replace: true});
    };

    const { data: categories = [] } = usePublicCategories();

    const { data, isLoading, isError } = usePublicProducts({
        page: Math.max(page - 1, 0),
        size,
        sort,
        search: deferredSearch || undefined,
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
                    updateSearchParams({
                        page: DEFAULT_PAGE,
                        sort,
                        search: value,
                        categoryName,
                    });
                }}
                sort={sort}
                onSortChange={(value) => {
                    updateSearchParams({
                        page: DEFAULT_PAGE,
                        sort: value,
                        search,
                        categoryName,
                    });
                }}
                categories={categories}
                categoryId={categoryName}
                onCategoryChange={(value) => {
                    updateSearchParams({
                        page: DEFAULT_PAGE,
                        sort,
                        search,
                        categoryName: value,
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
                    onClick={() =>
                        updateSearchParams({
                            page: Math.max(page - 1, DEFAULT_PAGE),
                            sort,
                            search,
                            categoryName,
                        })
                    }
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
                    onClick={() =>
                        updateSearchParams({
                            page: page + 1,
                            sort,
                            search,
                            categoryName,
                        })
                    }
                >
                    Sonraki
                </button>
            </div>
        </div>
    );
}
