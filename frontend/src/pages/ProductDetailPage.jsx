import { useParams } from "react-router-dom";
import usePageMeta from "../shared/seo/usePageMeta";
import { siteConfig } from "../shared/config/siteConfig";
import { useProduct } from "../features/products/hooks/useProduct";
import ProductDetailGallery from "../features/public/product/components/ProductDetailGallery";
import ProductFeatureGrid from "../features/public/product/components/ProductFeatureGrid";
import RelatedProductsCarousel from "../features/public/product/components/RelatedProductsCarousel";
import "./css/ProductDetailPage.css";

const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
        return "-";
    }
    return value;
};

const capitalizeFirst = (value, locale = "tr-TR") => {
    if (value === null || value === undefined) {
        return "";
    }
    const text = String(value);
    if (!text) {
        return "";
    }
    return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
};

export default function ProductDetailPage() {
    const { id } = useParams();
    const { data: product, isLoading, isError } = useProduct(id);
    const productName = capitalizeFirst(product?.name || "Ürün");

    usePageMeta({
        title: product?.name
            ? `Seka Ambalaj | ${productName}`
            : "Seka Ambalaj | Ürün Detayı",
        description: product?.description || "Ürün detayları.",
        canonical: `${siteConfig.siteUrl}/urunler/${id || ""}`,
        image: `${siteConfig.siteUrl}/Seka-Logo.png`,
    });

    if (isLoading) {
        return (
            <div className="product-detail-page">
                <div className="product-detail-loading">
                    Ürün yükleniyor...
                </div>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="product-detail-page">
                <div className="product-detail-empty">
                    Ürün bulunamadı.
                </div>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            <div className="product-detail-grid">
                <ProductDetailGallery
                    images={product.images || []}
                    name={productName}
                />

                <div className="product-detail-info">
                    <span className="product-detail-brand">
                        {formatValue(product.category?.categoryName)}
                    </span>
                    <h1 className="product-detail-title">
                        {productName}
                    </h1>

                    <div className="product-detail-meta">
                        <div className="meta-item">
                            <span>Marka</span>
                            <strong>
                                {formatValue(product.brand)}
                            </strong>
                        </div>
                        <div className="meta-item">
                            <span>Durum</span>
                            <strong>
                                {product.isActive ? "Aktif" : "Pasif"}
                            </strong>
                        </div>
                    </div>

                    {product.description ? (
                        <>
                            <h3 className="product-detail-section-title">
                                Ürün Açıklaması
                            </h3>
                            <p className="product-detail-description">
                                {product.description}
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="product-detail-section-title">
                                Ürün Açıklaması
                            </h3>
                            <p className="product-detail-description muted">
                                Ürün açıklaması bulunmamaktadır.
                            </p>
                        </>
                    )}

                    <ProductFeatureGrid feature={product.productFeature} />
                </div>
            </div>

            <RelatedProductsCarousel
                categoryName={product?.category?.categoryName}
                currentProductId={product.id}
                limit={10}
            />
        </div>
    );
}
