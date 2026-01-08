import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function RequireAdmin({ children }) {
    const auth = useAuth();
    if (!auth.isAdmin) return <Navigate to="/unauthorized" />;
    return children;
}
