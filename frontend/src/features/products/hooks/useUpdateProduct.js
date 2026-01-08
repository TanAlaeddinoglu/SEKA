import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductAPI } from "../api/products.api";

export function useUpdateProduct(id) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => ProductAPI.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]);
            queryClient.invalidateQueries(["product", id]);
        },
    });
}
