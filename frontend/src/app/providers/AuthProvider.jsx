import { createContext, useContext, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({
    isAuthenticated: false,
    roles: [],
    isAdmin: false,
    expiresAt: null,
    setToken: () => {},
});

export function AuthProvider({ children }) {
    const [token, setTokenState] = useState(() =>
        localStorage.getItem("token")
    );

    const setToken = (nextToken) => {
        if (nextToken) {
            localStorage.setItem("token", nextToken);
        } else {
            localStorage.removeItem("token");
        }
        setTokenState(nextToken || null);
    };

    const auth = useMemo(() => {
        if (!token) {
            return {
                isAuthenticated: false,
                roles: [],
                isAdmin: false,
                expiresAt: null,
            };
        }

        try {
            const decoded = jwtDecode(token);
            const roles = decoded.roles || [];
            const expiresAt =
                typeof decoded.exp === "number" ? decoded.exp * 1000 : null;
            const isExpired = typeof expiresAt === "number" && expiresAt <= Date.now();

            return {
                isAuthenticated: !isExpired,
                roles: isExpired ? [] : roles,
                isAdmin: !isExpired && roles.includes("ROLE_ADMIN"),
                expiresAt,
            };
        } catch {
            return {
                isAuthenticated: false,
                roles: [],
                isAdmin: false,
                expiresAt: null,
            };
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ ...auth, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
