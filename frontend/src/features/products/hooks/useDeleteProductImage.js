import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductImagesAPI } from "../api/productImages.api";

export function useDeleteProductImage(productId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (imageId) =>
            ProductImagesAPI.delete(productId, imageId),

        onSuccess: () => {
            queryClient.invalidateQueries([
                "product-images",
                productId,
            ]);
        },
    });
}
