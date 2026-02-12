import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/auth.api";
import { useAuth } from "../../../app/providers/AuthProvider";

export function useLogin() {
    const auth = useAuth();

    return useMutation({
        mutationFn: loginRequest,
        onSuccess: (token) => {
            if (auth?.setToken) {
                auth.setToken(token);
            } else {
                localStorage.setItem("token", token);
            }
        },
    });
}
