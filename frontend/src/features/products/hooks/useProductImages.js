import { useQuery } from "@tanstack/react-query";
import { ProductImagesAPI } from "../api/productImages.api";

export function useProductImages(productId) {
    return useQuery({
        queryKey: ["product-images", productId],
        queryFn: () => ProductImagesAPI.getAll(productId),
        enabled: !!productId,
    });
}
