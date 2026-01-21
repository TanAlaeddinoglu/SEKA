import "../styles/UserTable.css";

export default function UserTable({ users, onEdit, onDelete }) {
    return (
        <>
            {/* DESKTOP TABLE */}
            <div className="user-table-wrapper desktop-only">
                <table className="user-table">
                    <thead>
                    <tr>
                        <th>Ad</th>
                        <th>Soyad</th>
                        <th>Kullanıcı Adı</th>
                        <th>E-posta</th>
                        <th>Rol</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u) => (
                        <tr key={u.username}>
                            <td>{u.name || "-"}</td>
                            <td>{u.surname || "-"}</td>
                            <td>{u.username}</td>
                            <td>{u.email || "-"}</td>
                            <td>
                                {Array.isArray(u.authorities) && u.authorities.length
                                    ? u.authorities.join(", ")
                                    : "-"}
                            </td>
                            <td>
                                    <span
                                        className={`user-status ${
                                            u.is_enabled ? "active" : "passive"
                                        }`}
                                    >
                                        {u.is_enabled ? "Aktif" : "Pasif"}
                                    </span>
                            </td>
                            <td>
                                <div className="user-actions">
                                    <button
                                        className="edit"
                                        onClick={() => onEdit(u)}
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        className="delete"
                                        onClick={() =>
                                            onDelete(u.username)
                                        }
                                    >
                                        Sil
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="user-cards mobile-only">
                {users.map((u) => (
                    <div className="user-card" key={u.username}>
                        <div className="card-title">
                            {u.username}
                        </div>

                        <div className="card-row">
                            <span>Ad</span>
                            <span>{u.name || "-"}</span>
                        </div>

                        <div className="card-row">
                            <span>Soyad</span>
                            <span>{u.surname || "-"}</span>
                        </div>

                        <div className="card-row">
                            <span>E-posta</span>
                            <span>{u.email || "-"}</span>
                        </div>

                        <div className="card-row">
                            <span>Rol</span>
                            <span>
                                {Array.isArray(u.authorities) && u.authorities.length
                                    ? u.authorities.join(", ")
                                    : "-"}
                            </span>
                        </div>

                        <div className="card-row">
                            <span>Durum</span>
                            <span
                                className={`user-status ${
                                    u.is_enabled ? "active" : "passive"
                                }`}
                            >
                                {u.is_enabled ? "Aktif" : "Pasif"}
                            </span>
                        </div>

                        <div className="card-actions">
                            <button
                                onClick={() => onEdit(u)}
                            >
                                Düzenle
                            </button>
                            <button
                                className="danger"
                                onClick={() =>
                                    onDelete(u.username)
                                }
                            >
                                Sil
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
