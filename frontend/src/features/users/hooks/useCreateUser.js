import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAPI } from "../api/users.api";

export function useCreateUser() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: UserAPI.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["users"] });
        },
    });
}
