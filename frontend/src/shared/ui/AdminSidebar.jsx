import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

export default function AdminSidebar({ open, onClose }) {
    return (
        <>
            {open && <div className="sidebar-overlay" onClick={onClose} />}

            <aside className={`sidebar ${open ? "open" : ""}`}>
                <h2>Admin</h2>

                <nav>
                    <NavLink to="/admin" end>
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/categories">
                        Categories
                    </NavLink>
                    <NavLink to="/admin/products">
                        Products
                    </NavLink>
                </nav>
            </aside>
        </>
    );
}
