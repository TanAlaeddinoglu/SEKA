import "./AdminTopbar.css";

export default function AdminTopbar({ onMenuClick, onLogout }) {
    return (
        <header className="admin-topbar">
            <div className="admin-topbar-left">
                <button className="menu-btn" onClick={onMenuClick}>
                    ☰
                </button>
                <span className="admin-topbar-title">Admin Panel</span>
            </div>

            <div className="admin-topbar-right">
                <button onClick={onLogout}>Logout</button>
            </div>
        </header>
    );
}
