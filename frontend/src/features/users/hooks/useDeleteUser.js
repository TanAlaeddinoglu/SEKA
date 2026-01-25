import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAPI } from "../api/users.api";

export function useDeleteUser() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (username) => UserAPI.delete(username),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["users"] });
        },
    });
}
