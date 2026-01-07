package com.ambalajwebsite.ambalajwebsite.util;

import java.text.Normalizer;
import java.util.Locale;

public final class SlugUtil {
    private SlugUtil() {}

    public static String toSlug(String slug) {
        String normalized = Normalizer.normalize(slug, Normalizer.Form.NFD);
        return normalized.replaceAll("[^\\p{ASCII}]", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }
}

