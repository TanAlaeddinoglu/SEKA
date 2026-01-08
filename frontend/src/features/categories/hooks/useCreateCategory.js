import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryAPI } from "../api/categories.api";

export function useCreateCategory() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: CategoryAPI.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}
