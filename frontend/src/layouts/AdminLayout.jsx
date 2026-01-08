import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../shared/ui/AdminSidebar";
import AdminTopbar from "../shared/ui/AdminTopbar";
import "./AdminLayout.css";

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    return (
        <div className="admin-layout">
            <AdminSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="admin-main">
                <AdminTopbar
                    onMenuClick={() => setSidebarOpen(true)}
                    onLogout={handleLogout}
                />

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
