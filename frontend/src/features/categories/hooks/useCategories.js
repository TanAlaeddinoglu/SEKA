import { useQuery } from "@tanstack/react-query";
import { CategoryAPI } from "../api/categories.api";

export function useCategories() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const data = await CategoryAPI.getAll();
            return data.map(normalizeCategory);
        },
    });
}
export function normalizeCategory(raw) {
    return {
        ...raw,
        isActive: raw.active,
    };
}
