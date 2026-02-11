import { useQuery } from "@tanstack/react-query";
import { ProductAPI } from "../../../products/api/products.api";

export function useProductsByCategoryName(categoryName, size = 4) {
    return useQuery({
        queryKey: ["public-products", "category", categoryName, size],
        queryFn: () =>
            ProductAPI.getAll({
                page: 0,
                size,
                categoryName,
                sort: "productName,asc",
            }),
        enabled: Boolean(categoryName),
        keepPreviousData: true,
    });
}
