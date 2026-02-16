import { siteConfig } from "../../config/siteConfig";
import "./WhatsAppFloatButton.css";

function toWhatsappNumber(phone = "") {
    const digitsOnly = phone.replace(/\D/g, "");
    if (!digitsOnly) {
        return "";
    }

    if (digitsOnly.startsWith("00")) {
        return digitsOnly.slice(2);
    }

    if (digitsOnly.startsWith("0")) {
        return `90${digitsOnly.slice(1)}`;
    }

    return digitsOnly;
}

export default function WhatsAppFloatButton() {
    const phone = siteConfig.contact.phone || "";
    const whatsappNumber = toWhatsappNumber(phone);

    if (!whatsappNumber) {
        return null;
    }

    return (
        <a
            className="whatsapp-float"
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp ile iletişime geç"
            title="WhatsApp ile iletişime geç"
        >
            <span className="whatsapp-float-ring" aria-hidden="true">
                <svg className="whatsapp-ring-svg" viewBox="0 0 100 100" focusable="false">
                    <defs>
                        <path
                            id="whatsapp-text-circle"
                            d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                        />
                    </defs>
                    <text className="whatsapp-ring-text">
                        <textPath href="#whatsapp-text-circle" startOffset="50%" textAnchor="middle">
                            BIZE ULASIN • BIZE ULASIN • BIZE ULASIN •
                        </textPath>
                    </text>
                </svg>
            </span>

            <span className="whatsapp-float-icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" focusable="false">
                    <path d="M16 2.8C8.73 2.8 2.83 8.71 2.83 16c0 2.58.75 5.08 2.16 7.24L2.5 29.2l6.14-2.45A13.1 13.1 0 0 0 16 29.2c7.27 0 13.17-5.91 13.17-13.2S23.27 2.8 16 2.8Zm0 24.16c-2.11 0-4.16-.57-5.94-1.66l-.42-.25-3.65 1.45 1.46-3.56-.28-.44A10.92 10.92 0 0 1 5.06 16c0-6.04 4.9-10.95 10.94-10.95 2.92 0 5.66 1.14 7.72 3.21A10.85 10.85 0 0 1 26.94 16c0 6.04-4.9 10.95-10.94 10.95Zm6.01-8.22c-.33-.17-1.96-.97-2.27-1.08-.3-.11-.52-.17-.74.17-.22.33-.85 1.08-1.04 1.3-.19.22-.39.25-.72.09-.33-.17-1.39-.51-2.64-1.61a9.97 9.97 0 0 1-1.84-2.29c-.19-.33-.02-.51.14-.68.15-.15.33-.39.49-.58.16-.19.22-.33.33-.55.11-.22.06-.41-.03-.58-.08-.17-.74-1.8-1.02-2.46-.27-.65-.54-.56-.74-.57l-.63-.01c-.22 0-.58.08-.88.41-.3.33-1.16 1.13-1.16 2.76 0 1.63 1.19 3.2 1.35 3.42.17.22 2.33 3.57 5.64 5 .79.34 1.41.54 1.89.69.8.25 1.53.21 2.1.13.64-.09 1.96-.8 2.24-1.58.28-.78.28-1.44.2-1.58-.08-.14-.3-.22-.63-.39Z" />
                </svg>
            </span>
        </a>
    );
}
