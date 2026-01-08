import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductFeatureAPI } from "../api/productFeature.api";

export function useUpdateProductFeature(featureId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) =>
            ProductFeatureAPI.update(featureId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]);
            queryClient.invalidateQueries(["product"]);
        },
    });
}
