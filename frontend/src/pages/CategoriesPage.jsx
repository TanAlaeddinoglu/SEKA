import usePageMeta from "../shared/seo/usePageMeta";
import { siteConfig } from "../shared/config/siteConfig";
import { useCategories } from "../features/categories/hooks/useCategories";
import CategoryGrid from "../features/public/category/components/CategoryGrid";
import "./css/CategoriesPage.css";

export default function CategoriesPage() {
    usePageMeta({
        title: "Seka Ambalaj | Kategoriler",
        description: "Ürün kategorileri listesi.",
        canonical: `${siteConfig.siteUrl}/kategoriler`,
        image: `${siteConfig.siteUrl}/Seka-Logo.png`,
    });

    const { data: categories = [], isLoading, isError } = useCategories();
    const activeCategories = categories.filter((category) => category.isActive);
    const visibleCategories =
        activeCategories.length > 0 ? activeCategories : categories;

    return (
        <div className="categories-page">
            <div className="categories-header">
                <h2>KATEGORİLER</h2>
                <p>Ürünlerimizi kategoriler halinde keşfedin.</p>
            </div>

            <CategoryGrid
                categories={visibleCategories}
                loading={isLoading}
                error={isError}
            />
        </div>
    );
}
