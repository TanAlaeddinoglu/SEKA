import { useEffect } from "react";

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
        setMetaAttr("property", "og:url", canonical || "");
        if (image) {
            setMetaAttr("property", "og:image", image);
            setMetaAttr("name", "twitter:image", image);
        }

        setMetaAttr("name", "twitter:card", "summary_large_image");
        setMetaAttr("name", "twitter:title", title || "");
        setMetaAttr("name", "twitter:description", description || "");
    }, [title, description, canonical, image]);
}
