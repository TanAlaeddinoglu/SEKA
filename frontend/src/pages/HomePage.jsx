import { NavLink } from "react-router-dom";
import AboutSection from "../features/public/about/components/AboutSection";
import { siteConfig } from "../shared/config/siteConfig";
import usePageMeta from "../shared/seo/usePageMeta";
import JsonLd from "../shared/seo/JsonLd";
import { usePublicCategories } from "../features/public/category/hooks/usePublicCategories";
import { useState } from "react";
import { usePublicProducts } from "../features/public/product/hooks/usePublicProducts";
import HomeProductSection from "../features/public/home/components/HomeProductSection";
import ImageGallery from "../features/public/home/components/ImageGallery";
import CategoryGrid from "../features/public/category/components/CategoryGrid";
import "./css/HomePage.css";

const galleryCopy = [
    {
        kicker: "Ambalaj Çözümleri",
        title: "Markanız İçin Güçlü Sunum",
        text: "Ürünlerinizi güvende tutan, raflarda fark yaratan ambalaj tasarımları.",
    },
    {
        kicker: "Kurumsal Üretim",
        title: "Kalite ve Süreklilik",
        text: "Her aşamada kontrol edilen üretim ile güvenilir tedarik.",
    },
    {
        kicker: "Yeni Koleksiyon",
        title: "Modern ve İşlevsel",
        text: "Estetik, dayanıklı ve ihtiyaçlara uygun ambalaj çözümleri.",
    },
];

const gallerySizes = "(min-width: 1200px) 1200px, 100vw";

const galleryImages = import.meta.glob(
    "../assets/imageGallery/*.{jpg,jpeg,png,webp,avif}",
    { eager: true, import: "default" }
);

const galleryEntries = Object.entries(galleryImages).sort(([a], [b]) =>
    a.localeCompare(b, undefined, { numeric: true })
);

const galleryGroups = new Map();

const getTitle = (value) => {
    const cleaned = value.replace(/[-_]+/g, " ").trim();
    return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : "Galeri";
};

const parseVariant = (name) => {
    const densityMatch = name.match(/(.+?)@(\d)x$/);
    if (densityMatch) {
        return {
            base: densityMatch[1],
            density: Number(densityMatch[2]),
        };
    }
    const sizeMatch = name.match(/(.+?)[-_](\d{2,4})$/);
    if (sizeMatch) {
        return {
            base: sizeMatch[1],
            width: Number(sizeMatch[2]),
        };
    }
    return { base: name };
};

const buildSrcSet = (items) => {
    if (!items || !items.length) return undefined;
    const withDensity = items.filter((item) => item.density);
    if (withDensity.length) {
        return withDensity
            .sort((a, b) => (a.density || 1) - (b.density || 1))
            .map((item) => `${item.src} ${item.density}x`)
            .join(", ");
    }
    const withWidth = items.filter((item) => item.width);
    if (!withWidth.length) return undefined;
    return withWidth
        .sort((a, b) => a.width - b.width)
        .map((item) => `${item.src} ${item.width}w`)
        .join(", ");
};

galleryEntries.forEach(([path, src], index) => {
    const fileName = path.split("/").pop() || "";
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    const rawName = fileName.replace(/\.[^/.]+$/, "");
    const parsed = parseVariant(rawName);
    const key = parsed.base;

    if (!galleryGroups.has(key)) {
        galleryGroups.set(key, {
            key,
            order: index,
            sources: {},
            fallback: null,
        });
    }

    const group = galleryGroups.get(key);
    if (!group.sources[ext]) {
        group.sources[ext] = [];
    }
    group.sources[ext].push({
        src,
        width: parsed.width,
        density: parsed.density,
    });

    if (!group.fallback && ["jpg", "jpeg", "png"].includes(ext)) {
        group.fallback = src;
    }
    if (!group.fallback) {
        group.fallback = src;
    }
});

const gallerySlides = Array.from(galleryGroups.values())
    .sort((a, b) => a.order - b.order)
    .map((group, index) => {
        const copy = galleryCopy[index % galleryCopy.length];
        const title = getTitle(group.key);
        const sources = [];
        const avifSet = buildSrcSet(group.sources.avif);
        if (avifSet) {
            sources.push({ type: "image/avif", srcSet: avifSet, sizes: gallerySizes });
        }
        const webpSet = buildSrcSet(group.sources.webp);
        if (webpSet) {
            sources.push({ type: "image/webp", srcSet: webpSet, sizes: gallerySizes });
        }
        const fallbackItems =
            group.sources.jpg ||
            group.sources.jpeg ||
            group.sources.png ||
            [];
        const fallbackSrcSet = buildSrcSet(fallbackItems);

        return {
            src: group.fallback,
            srcSet: fallbackSrcSet,
            sizes: gallerySizes,
            sources,
            alt: copy?.title || title,
            ...copy,
        };
    });

const aboutImages = import.meta.glob(
    "../assets/aboutImage/*.{jpg,jpeg,png,webp,avif}",
    { eager: true, import: "default" }
);

const aboutImageSrc =
    Object.entries(aboutImages)
        .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
        .map(([, src]) => src)[0] || undefined;

export default function HomePage() {
    usePageMeta({
        title: "Seka Ambalaj | Ana Sayfa",
        description:
            "Seka Ambalaj ürünleri, ambalaj çözümleri ve kurumsal hizmetler.",
        canonical: `${siteConfig.siteUrl}/`,
        image: `${siteConfig.siteUrl}/Seka-Logo.png`,
    });

    const normalizedText = siteConfig.about.text
        .replace(/\\\\n/g, "\n")
        .replace(/\\n/g, "\n");
    const firstParagraph =
        normalizedText.split(/\r?\n/).filter(Boolean)[0] ||
        siteConfig.about.text;

    const orgJson = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Seka Ambalaj",
        url: siteConfig.siteUrl,
        logo: `${siteConfig.siteUrl}/Seka-Logo.png`,
        contactPoint: [
            {
                "@type": "ContactPoint",
                telephone: siteConfig.contact.phone,
                contactType: "customer service",
                email: siteConfig.contact.email,
            },
        ],
        address: {
            "@type": "PostalAddress",
            addressLocality: siteConfig.contact.address,
        },
    };
    const websiteJson = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Seka Ambalaj",
        url: siteConfig.siteUrl,
        potentialAction: {
            "@type": "SearchAction",
            target: `${siteConfig.siteUrl}/urunler?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };

    const {
        data: categories = [],
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = usePublicCategories();
    const [selectedCategory, setSelectedCategory] = useState("");

    const { data: productData, isLoading, isFetching } = usePublicProducts({
        page: 0,
        size: 8,
        sort: "productName,asc",
        categoryName: selectedCategory || undefined,
    });

    const products = productData?.content || [];

    return (
        <div className="home-about">
            <JsonLd data={orgJson} />
            <JsonLd data={websiteJson} />
            <ImageGallery slides={gallerySlides} />
            <div className="home-category-strip">
                <CategoryGrid
                    categories={categories}
                    loading={categoriesLoading}
                    error={categoriesError}
                    rows={1}
                    columns={5}
                />
            </div>
            <AboutSection
                title={siteConfig.about.title}
                text={firstParagraph}
                imageSrc={aboutImageSrc}
                imageAlt="Seka Ambalaj hakkımızda görseli"
            />
            <div className="home-about-cta">
                <NavLink to="/hakkimizda" className="read-more-btn">
                    Devamını Oku
                </NavLink>
            </div>

            <HomeProductSection
                title="Ürünlerimiz"
                categories={categories}
                activeCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                products={products}
                loading={isLoading || isFetching}
            />
        </div>
    );
}
