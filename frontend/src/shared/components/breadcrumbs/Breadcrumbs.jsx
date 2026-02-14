import { NavLink, useLocation } from "react-router-dom";
import { siteConfig } from "../../config/siteConfig";
import JsonLd from "../../seo/JsonLd";
import "./Breadcrumbs.css";

const LABEL_MAP = {
    "": "Ana Sayfa",
    kategoriler: "Kategoriler",
    urunler: "Ürünler",
    hakkimizda: "Hakkımızda",
    referanslar: "Referanslar",
    katalog: "Katalog",
    iletisim: "İletişim",
    login: "Giriş Yap",
};

export default function Breadcrumbs() {
    const location = useLocation();
    const segments = location.pathname.split("/").filter(Boolean);
    const productsListSearch =
        location.pathname.startsWith("/urunler/") && location.search
            ? location.search
            : "";

    const crumbs = segments.map((segment, index) => {
        const baseTo = `/${segments.slice(0, index + 1).join("/")}`;
        const to =
            baseTo === "/urunler" ? `${baseTo}${productsListSearch}` : baseTo;
        return {
            label: LABEL_MAP[segment] || segment,
            to,
        };
    });

    const breadcrumbJson = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Ana Sayfa",
                item: `${siteConfig.siteUrl}/`,
            },
            ...crumbs.map((crumb, index) => ({
                "@type": "ListItem",
                position: index + 2,
                name: crumb.label,
                item: `${siteConfig.siteUrl}${crumb.to}`,
            })),
        ],
    };

    return (
        <div className="breadcrumbs">
            <div className="breadcrumbs-inner">
                <NavLink to="/">Ana Sayfa</NavLink>
                {crumbs.map((crumb) => (
                    <span key={crumb.to} className="breadcrumb-item">
                        <span className="breadcrumb-separator">/</span>
                        <NavLink to={crumb.to}>{crumb.label}</NavLink>
                    </span>
                ))}
            </div>
            <JsonLd data={breadcrumbJson} />
        </div>
    );
}
