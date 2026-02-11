import ContactSection from "../features/public/contact/components/ContactSection";
import usePageMeta from "../shared/seo/usePageMeta";
import { siteConfig } from "../shared/config/siteConfig";
import JsonLd from "../shared/seo/JsonLd";

export default function ContactPage() {
    usePageMeta({
        title: "Seka Ambalaj | İletişim",
        description: "İletişim bilgileri ve harita.",
        canonical: `${siteConfig.siteUrl}/iletisim`,
        image: `${siteConfig.siteUrl}/Seka-Logo.png`,
    });

    const localBusinessJson = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Seka Ambalaj",
        url: siteConfig.siteUrl,
        telephone: siteConfig.contact.phone,
        email: siteConfig.contact.email,
        address: {
            "@type": "PostalAddress",
            addressLocality: siteConfig.contact.address,
        },
    };

    return (
        <>
            <JsonLd data={localBusinessJson} />
            <ContactSection />
        </>
    );
}
