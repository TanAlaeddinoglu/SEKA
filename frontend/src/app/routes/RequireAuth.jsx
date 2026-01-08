import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function RequireAuth({ children }) {
    const auth = useAuth();
    if (!auth.isAuthenticated) return <Navigate to="/login" />;
    return children;
}
