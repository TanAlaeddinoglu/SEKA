import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryAPI } from "../api/categories.api";

export function useDeleteCategory() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: CategoryAPI.remove,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}
