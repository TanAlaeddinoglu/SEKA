export default function PasswordHint({ password }) {
    const checks = [
        {
            label: "En az 7 karakter",
            valid: password.length >= 7,
        },
        {
            label: "En az 1 büyük harf",
            valid: /[A-Z]/.test(password),
        },
        {
            label: "En az 1 rakam",
            valid: /\d/.test(password),
        },
        {
            label: "En az 1 özel karakter (. / !)",
            valid: /[./!]/.test(password),
        },
    ];

    return (
        <ul style={{ fontSize: 13, margin: 0, paddingLeft: 16 }}>
            {checks.map((c) => (
                <li
                    key={c.label}
                    style={{
                        color: c.valid ? "green" : "#991b1b",
                    }}
                >
                    {c.label}
                </li>
            ))}
        </ul>
    );
}
