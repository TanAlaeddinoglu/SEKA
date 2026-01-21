import { useQuery } from "@tanstack/react-query";
import { UserAPI } from "../api/users.api";

export function useUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: UserAPI.getAll,
    });
}
