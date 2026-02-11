import usePageMeta from "../shared/seo/usePageMeta";
import { siteConfig } from "../shared/config/siteConfig";

export default function ReferencesPage() {
    usePageMeta({
        title: "Seka Ambalaj | Referanslar",
        description: "Referanslar ve iş ortakları.",
        canonical: `${siteConfig.siteUrl}/referanslar`,
        image: `${siteConfig.siteUrl}/Seka-Logo.png`,
    });

    return (
        <div style={{ padding: "32px 20px" }}>
            <h2>Referanslar</h2>
            <p>Referanslar sayfası hazırlanıyor.</p>
        </div>
    );
}
