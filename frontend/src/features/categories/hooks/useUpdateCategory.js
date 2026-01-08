import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryAPI } from "../api/categories.api";

export function useUpdateCategory() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => CategoryAPI.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}
