import { useQuery } from "@tanstack/react-query";
import { ProductAPI } from "../../../products/api/products.api";

export function usePublicProducts(params) {
    return useQuery({
        queryKey: ["public-products", params],
        queryFn: () => ProductAPI.getAll(params),
        keepPreviousData: true,
    });
}
