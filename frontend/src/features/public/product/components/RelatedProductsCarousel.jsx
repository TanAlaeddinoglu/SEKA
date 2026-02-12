import { useMemo } from "react";
import { useProducts } from "../../../products/hooks/useProducts";
import ProductCarousel from "../../home/components/ProductCarousel";

export default function RelatedProductsCarousel({
    categoryName,
    currentProductId,
    limit = 10,
}) {
    const { data } = useProducts({
        page: 0,
        size: limit + 1,
        ...(categoryName ? { categoryName } : {}),
    });

    const relatedProducts = useMemo(() => {
        return (data?.content || [])
            .filter((item) => item.id !== currentProductId)
            .slice(0, limit);
    }, [data, currentProductId, limit]);

    if (!relatedProducts.length) {
        return null;
    }

    return (
        <div className="product-detail-related">
            <h3 className="product-detail-related-title">İlgili Ürünler</h3>
            <ProductCarousel products={relatedProducts} />
        </div>
    );
}
