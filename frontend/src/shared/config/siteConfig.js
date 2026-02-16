export const siteConfig = {
    siteUrl: import.meta.env.VITE_SITE_URL || "https://sekaticaret.com.tr",
    contact: {
        address: import.meta.env.VITE_CONTACT_ADDRESS || "İstanbul, Türkiye",
        phone: import.meta.env.VITE_CONTACT_PHONE || "+90 212 000 00 00",
        email: import.meta.env.VITE_CONTACT_EMAIL || "info@seka.com",
    },
    maps: {
        embedUrl:
            import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL ||
            "https://maps.google.com/maps?q=Istanbul&t=&z=13&ie=UTF8&iwloc=&output=embed",
    },
    about: {
        title: import.meta.env.VITE_ABOUT_TITLE || "Hakkımızda",
        text:
            import.meta.env.VITE_ABOUT_TEXT ||
            "Ambalaj alanında yenilikçi ve güvenilir çözümler sunuyoruz. Kalite, süreklilik ve müşteri memnuniyeti odaklı çalışıyoruz.",
    },
};
