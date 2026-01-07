package com.ambalajwebsite.ambalajwebsite.util;

import org.springframework.stereotype.Component;

import java.util.function.Predicate;

@Component
public class SlugGenerator {

    public static String generateUniqueSlug(String source,
                                            Predicate<String> existsBySlug) {

        String baseSlug = SlugUtil.toSlug(source);
        String slug = baseSlug;
        int counter = 1;

        while (existsBySlug.test(slug)) {
            slug = baseSlug + "-" + counter;
            counter++;
        }

        return slug;
    }
}
