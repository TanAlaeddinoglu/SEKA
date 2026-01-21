import { useEffect, useState } from "react";
import PasswordHint from "./PasswordHint";
import "../styles/UserFormModal.css";

const STRONG_PASSWORD =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[./!]).{7,}$/;
const ROLE_OPTIONS = ["ROLE_ADMIN", "ROLE_USER"];

export default function UserFormModal({
                                          open,
                                          mode, // "create" | "edit"
                                          initialData,
                                          onClose,
                                          onSubmit,
                                          loading,
                                      }) {
    const [form, setForm] = useState({
        name: "",
        surname: "",
        username: "",
        email: "",
        password: "",
        password2: "",
        is_enabled: true,
        authorities: ["ROLE_USER"],
    });

    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setForm((f) => ({
                ...f,
                name: initialData.name ?? "",
                surname: initialData.surname ?? "",
                username: initialData.username ?? "",
                email: initialData.email ?? "",
                is_enabled: initialData.is_enabled ?? true,
                authorities: Array.isArray(initialData.authorities)
                    ? initialData.authorities
                    : ["ROLE_USER"],
                password: "",
                password2: "",
            }));
        }
    }, [initialData]);

    if (!open) return null;

    const validate = () => {
        if (mode === "create" && !form.password) {
            return "Şifre zorunludur.";
        }

        if (form.password) {
            if (!STRONG_PASSWORD.test(form.password)) {
                return "Şifre yeterince güçlü değil.";
            }
            if (form.password !== form.password2) {
                return "Şifreler eşleşmiyor.";
            }
        }
        if (!form.authorities.length) {
            return "En az bir rol seçin.";
        }

        return "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        const err = validate();
        if (err) {
            setError(err);
            return;
        }

        const payload = {
            name: form.name || null,
            surname: form.surname || null,
            email: form.email || null,
            enabled: form.is_enabled,
        };

        if (mode === "create") {
            payload.username = form.username;
            payload.password = form.password;
            payload.authorities = form.authorities;
        }

        if (mode === "edit" && form.password) {
            payload.password = form.password;
        }
        if (mode === "edit" && form.authorities.length) {
            payload.authorities = form.authorities;
        }

        onSubmit(payload, form.username);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>
                    {mode === "create"
                        ? "Yeni Kullanıcı"
                        : "Kullanıcı Düzenle"}
                </h3>

                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Ad (opsiyonel)"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />

                    <input
                        placeholder="Soyad (opsiyonel)"
                        value={form.surname}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                surname: e.target.value,
                            })
                        }
                    />

                    <input
                        placeholder="Kullanıcı adı"
                        value={form.username}
                        disabled={mode === "edit"}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                username: e.target.value,
                            })
                        }
                        required={mode === "create"}
                    />

                    <input
                        type="email"
                        placeholder="E-posta (opsiyonel)"
                        value={form.email}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                email: e.target.value,
                            })
                        }
                    />

                    <input
                        type="password"
                        placeholder={
                            mode === "edit"
                                ? "Yeni şifre (opsiyonel)"
                                : "Şifre"
                        }
                        value={form.password}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                password: e.target.value,
                            })
                        }
                    />

                    {form.password && (
                        <PasswordHint password={form.password} />
                    )}

                    <input
                        type="password"
                        placeholder="Şifre tekrar"
                        value={form.password2}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                password2: e.target.value,
                            })
                        }
                    />

                    <label className="checkbox">
                        <input
                            type="checkbox"
                            checked={form.is_enabled}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    is_enabled: e.target.checked,
                                })
                            }
                        />
                        Aktif
                    </label>

                    <div className="checkbox">
                        <div>Rol</div>
                        {ROLE_OPTIONS.map((role) => {
                            const checked = form.authorities.includes(role);
                            return (
                                <label key={role}>
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(e) => {
                                            const next = e.target.checked
                                                ? [...form.authorities, role]
                                                : form.authorities.filter((r) => r !== role);
                                            setForm({ ...form, authorities: next });
                                        }}
                                    />
                                    {role}
                                </label>
                            );
                        })}
                    </div>

                    {error && (
                        <div className="form-error">{error}</div>
                    )}

                    <div className="actions">
                        <button
                            type="button"
                            onClick={onClose}
                        >
                            İptal
                        </button>

                        <button disabled={loading}>
                            {loading
                                ? "Kaydediliyor..."
                                : "Kaydet"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
