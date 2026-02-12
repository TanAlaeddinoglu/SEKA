import { useQuery } from "@tanstack/react-query";
import { CategoryAPI } from "../../../categories/api/categories.api";

export function usePublicCategories() {
    return useQuery({
        queryKey: ["public-categories"],
        queryFn: CategoryAPI.getAll,
    });
}
