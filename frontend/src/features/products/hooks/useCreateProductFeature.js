import { useMutation } from "@tanstack/react-query";
import { ProductFeatureAPI } from "../api/productFeature.api";

export function useCreateProductFeature() {
    return useMutation({
        mutationFn: (payload) =>
            ProductFeatureAPI.create(payload),
    });
}
