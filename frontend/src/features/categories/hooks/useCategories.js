import { useQuery } from "@tanstack/react-query";
import { CategoryAPI } from "../api/categories.api";

export function useCategories(options = {}) {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const data = await CategoryAPI.getAll();
            return data.map(normalizeCategory);
        },
        ...options,
    });
}
export function normalizeCategory(raw) {
    return {
        ...raw,
        isActive: raw.isActive ?? raw.active ?? false,
    };
}
