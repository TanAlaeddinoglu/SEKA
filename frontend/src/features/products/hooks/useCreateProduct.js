import { useMutation } from "@tanstack/react-query";
import { ProductAPI } from "../api/products.api";

export function useCreateProduct() {
    return useMutation({
        mutationFn: (payload) =>
            ProductAPI.create(payload),
    });
}
