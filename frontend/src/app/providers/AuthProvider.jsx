import { createContext, useContext, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({
    isAuthenticated: false,
    roles: [],
    isAdmin: false,
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
        <AuthContext.Provider value={{ ...auth, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
