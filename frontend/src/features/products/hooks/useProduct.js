import { useQuery } from "@tanstack/react-query";
import { ProductAPI } from "../api/products.api";

export function useProduct(id) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => ProductAPI.getById(id),
        enabled: !!id,
    });
}
