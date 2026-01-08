import { useQuery } from "@tanstack/react-query";
import { ProductAPI } from "../api/products.api";

export function useProducts(params) {
    return useQuery({
        queryKey: ["products", params],
        queryFn: () => ProductAPI.getAll(params),
        keepPreviousData: true,
    });
}
