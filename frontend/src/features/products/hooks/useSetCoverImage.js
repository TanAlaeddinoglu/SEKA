import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductImagesAPI } from "../api/productImages.api";

export function useSetCoverImage(productId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (imageId) =>
            ProductImagesAPI.setCover(productId, imageId),

        onSuccess: () => {
            queryClient.invalidateQueries([
                "product-images",
                productId,
            ]);
        },
    });
}
