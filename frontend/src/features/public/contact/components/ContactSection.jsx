import "../styles/ContactSection.css";
import { siteConfig } from "../../../../shared/config/siteConfig";
import ContactForm from "./ContactForm";

export default function ContactSection() {
    const { contact, maps } = siteConfig;

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
                            Adres: {contact.address}
                        </div>
                        <div className="contact-item">
                            Telefon: {contact.phone}
                        </div>
                        <div className="contact-item">
                            E-posta: {contact.email}
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
