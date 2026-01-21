import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAPI } from "../api/users.api";

export function useUpdateUser() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: UserAPI.update,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["users"] });
        },
    });
}
