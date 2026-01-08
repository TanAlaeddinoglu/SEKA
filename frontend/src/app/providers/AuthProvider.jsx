import { createContext, useContext, useMemo } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const token = localStorage.getItem("token");

    const auth = useMemo(() => {
        if (!token) return { isAuthenticated: false };

        try {
            const decoded = jwtDecode(token);
            const roles = decoded.roles || [];

            return {
                isAuthenticated: true,
                roles,
                isAdmin: roles.includes("ROLE_ADMIN"),
            };
        } catch {
            return { isAuthenticated: false };
        }
    }, [token]);

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
