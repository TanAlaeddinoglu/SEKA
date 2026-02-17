import {useEffect, useState} from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function RequireAuth({ children }) {
    const auth = useAuth();
    const setToken = auth?.setToken;
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, []);

    const isExpired =
        typeof auth.expiresAt === "number" && auth.expiresAt <= now;

    useEffect(() => {
        if (isExpired) {
            setToken?.(null);
        }
    }, [isExpired, setToken]);

    if (!auth.isAuthenticated || isExpired) return <Navigate to="/login" replace/>;
    return children;
}
