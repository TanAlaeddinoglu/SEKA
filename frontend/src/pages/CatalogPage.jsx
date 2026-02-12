import usePageMeta from "../shared/seo/usePageMeta";
import { siteConfig } from "../shared/config/siteConfig";

export default function CatalogPage() {
    usePageMeta({
        title: "Seka Ambalaj | Katalog",
        description: "Katalog ve ürün dokümanları.",
        canonical: `${siteConfig.siteUrl}/katalog`,
        image: `${siteConfig.siteUrl}/Seka-Logo.png`,
    });

    return (
        <div style={{ padding: "32px 20px" }}>
            <h2>Katalog</h2>
            <p>Katalog sayfası hazırlanıyor.</p>
        </div>
    );
}
