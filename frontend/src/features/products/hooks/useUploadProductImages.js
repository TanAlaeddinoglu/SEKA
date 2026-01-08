import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductImagesAPI } from "../api/productImages.api";

export function useUploadProductImages(productId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (files) =>
            ProductImagesAPI.upload(productId, files),

        onSuccess: () => {
            queryClient.invalidateQueries([
                "product-images",
                productId,
            ]);
        },
    });
}
