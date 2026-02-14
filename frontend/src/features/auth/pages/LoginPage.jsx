import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
    const navigate = useNavigate();
    const loginMutation = useLogin();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = await loginMutation.mutateAsync(form);

            const decoded = jwtDecode(token);
            const roles = decoded.roles || [];

            if (roles.includes("ROLE_ADMIN")) {
                navigate("/admin", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        } catch (err) {
            alert("Login failed. Username or password incorrect.");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    width: "100%",
                    maxWidth: 360,
                    padding: 24,
                    border: "1px solid #ddd",
                    borderRadius: 8,
                }}
            >
                <h2 style={{ marginBottom: 16 }}>Login</h2>

                <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    style={{
                        width: "100%",
                        marginBottom: 12,
                        padding: 8,
                        fontSize: 16,
                    }}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{
                        width: "100%",
                        marginBottom: 16,
                        padding: 8,
                        fontSize: 16,
                    }}
                />

                <button
                    type="submit"
                    disabled={loginMutation.isLoading}
                    style={{
                        width: "100%",
                        padding: 10,
                        cursor: "pointer",
                    }}
                >
                    {loginMutation.isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
