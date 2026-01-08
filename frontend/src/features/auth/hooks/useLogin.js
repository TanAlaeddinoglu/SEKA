import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/auth.api";

export function useLogin() {
    return useMutation({
        mutationFn: loginRequest,
        onSuccess: (token) => {
            localStorage.setItem("token", token);
        },
    });
}
