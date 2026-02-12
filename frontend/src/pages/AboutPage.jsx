import AboutSection from "../features/public/about/components/AboutSection";
import { siteConfig } from "../shared/config/siteConfig";
import usePageMeta from "../shared/seo/usePageMeta";

const aboutImages = import.meta.glob(
    "../assets/aboutImage/*.{jpg,jpeg,png,webp,avif}",
    { eager: true, import: "default" }
);

const aboutImageSrc =
    Object.entries(aboutImages)
        .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
        .map(([, src]) => src)[0] || undefined;

export default function AboutPage() {
    usePageMeta({
        title: "Seka Ambalaj | Hakkımızda",
        description: siteConfig.about.text,
        canonical: `${siteConfig.siteUrl}/hakkimizda`,
        image: `${siteConfig.siteUrl}/Seka-Logo.png`,
    });

    return (
        <AboutSection
            title={siteConfig.about.title}
            text={siteConfig.about.text}
            imageSrc={aboutImageSrc}
            imageAlt="Seka Ambalaj hakkımızda görseli"
        />
    );
}
