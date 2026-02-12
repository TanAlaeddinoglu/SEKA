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
                        Kategoriler
                    </NavLink>
                    <NavLink to="/admin/products">
                        Ürünler
                    </NavLink>
                    <NavLink to="/admin/users" className="sidebar-link" onClick={onClose}>
                        Kullanıcılar
                    </NavLink>
                    <NavLink to="/">
                        Siteye Git
                    </NavLink>
                </nav>
            </aside>
        </>
    );
}
