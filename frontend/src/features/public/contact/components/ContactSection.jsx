import "../styles/ContactSection.css";
import { siteConfig } from "../../../../shared/config/siteConfig";
import ContactForm from "./ContactForm";

export default function ContactSection() {
    const { contact, maps } = siteConfig;
    const phoneHref = `tel:${contact.phone.replace(/[^\d+]/g, "")}`;
    const emailHref = `mailto:${contact.email.trim()}`;

    return (
        <section className="contact-section">
            <div className="contact-top">
                <div className="contact-form-wrap">
                    <ContactForm />
                </div>
                <div className="contact-info">
                    <h2>İletişim</h2>
                    <div className="contact-details">
                        <div className="contact-item">
                            <span className="contact-label">Adres:</span>
                            <span className="contact-value">{contact.address}</span>
                        </div>
                        <div className="contact-item">
                            <span className="contact-label">Telefon:</span>
                            <a className="contact-value contact-value-link" href={phoneHref}>
                                {contact.phone}
                            </a>
                        </div>
                        <div className="contact-item">
                            <span className="contact-label">E-posta:</span>
                            <a className="contact-value contact-value-link" href={emailHref}>
                                {contact.email}
                            </a>
                        </div>
                    </div>
                </div>
                
            </div>
            <div className="contact-map">
                <div className="map-frame">
                    <iframe
                        title="Seka Harita"
                        src={maps.embedUrl}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        </section>
    );
}
