import { NavLink } from "react-router-dom";
import "./Footer.css";
import { siteConfig } from "../../config/siteConfig";

const QUICK_LINKS = [
    { label: "KATEGORİLER", to: "/kategoriler" },
    { label: "ÜRÜNLER", to: "/urunler" },
    { label: "İLETİŞİM", to: "/iletisim" },
    { label: "KATALOG", to: "/katalog" },
    { label: "GİRİŞ YAP", to: "/login" },
];

const { contact, maps } = siteConfig;

export default function Footer() {
    const phoneHref = `tel:${contact.phone.replace(/[^\d+]/g, "")}`;
    const emailHref = `mailto:${contact.email.trim()}`;

    return (
        <footer className="site-footer">
            <div className="footer-main">
                <NavLink className="footer-logo" to="/">
                    <img
                        src="/Header-Logo.png"
                        alt="Seka Logo"
                        width="250"
                        height="125"
                        loading="lazy"
                        decoding="async"
                    />
                </NavLink>

                <div className="footer-menu">
                    <h4>HIZLI MENÜ</h4>
                    <ul>
                        {QUICK_LINKS.map((link) => (
                            <li key={link.label}>
                                <NavLink to={link.to}>{link.label}</NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="footer-contact">
                    <h4>İLETİŞİM</h4>
                    <div className="contact-item">
                        <strong>Adres:</strong> {contact.address}
                    </div>
                    <div className="contact-item">
                        <strong>Telefon:</strong>{" "}
                        <a className="contact-link" href={phoneHref}>
                            {contact.phone}
                        </a>
                    </div>
                    <div className="contact-item">
                        <strong>E-posta:</strong>{" "}
                        <a className="contact-link" href={emailHref}>
                            {contact.email}
                        </a>
                    </div>
                </div>

                <div className="footer-map">
                    <h4>HARİTA</h4>
                    <div className="map-frame">
                        <iframe
                            title="Seka Harita"
                            src={maps.embedUrl}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <span>
                    SEKA Ambalaj 2026 © Tüm Hakları Saklıdır.
                </span>
                <div className="footer-actions">
                    <button type="button">Çerez Politikası</button>
                    <button type="button">Gizlilik Politikası</button>
                    <button type="button">KVKK Politikası</button>
                </div>
            </div>
        </footer>
    );
}
