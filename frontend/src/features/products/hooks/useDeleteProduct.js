import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductAPI } from "../api/products.api";

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => ProductAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]);
        },
    });
}
