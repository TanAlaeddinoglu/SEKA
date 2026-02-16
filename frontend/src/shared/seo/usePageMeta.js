import { useEffect } from "react";

const DEFAULT_ROBOTS =
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const SITE_NAME = import.meta.env.VITE_SITE_NAME || "Seka Ticaret";

function setMetaAttr(attr, key, value) {
    if (!value) return;
    let element = document.querySelector(`meta[${attr}="${key}"]`);
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, key);
        document.head.appendChild(element);
    }
    element.setAttribute("content", value);
}

function setCanonical(href) {
    if (!href) return;
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
    }
    link.setAttribute("href", href);
}

export default function usePageMeta({
    title,
    description,
    canonical,
    image,
    robots = DEFAULT_ROBOTS,
}) {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
        if (description) {
            setMetaAttr("name", "description", description);
        }

        setCanonical(canonical);

        setMetaAttr("property", "og:title", title || "");
        setMetaAttr("property", "og:description", description || "");
        setMetaAttr("property", "og:type", "website");
        setMetaAttr("property", "og:site_name", SITE_NAME);
        setMetaAttr("property", "og:locale", "tr_TR");
        setMetaAttr("property", "og:url", canonical || "");
        if (image) {
            setMetaAttr("property", "og:image", image);
            setMetaAttr("property", "og:image:alt", title || SITE_NAME);
            setMetaAttr("name", "twitter:image", image);
        }

        setMetaAttr("name", "robots", robots);
        setMetaAttr("name", "twitter:card", "summary_large_image");
        setMetaAttr("name", "twitter:title", title || "");
        setMetaAttr("name", "twitter:description", description || "");
        setMetaAttr("name", "twitter:url", canonical || "");
    }, [title, description, canonical, image, robots]);
}
