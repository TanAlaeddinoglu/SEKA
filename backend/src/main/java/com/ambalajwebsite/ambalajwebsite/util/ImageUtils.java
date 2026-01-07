package com.ambalajwebsite.ambalajwebsite.util;

import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public final class ImageUtils {

    private ImageUtils() {
    }

    public static boolean isImage(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }

    public static String buildObjectKey(Long productId, String originalFilename) {
        String ext = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        return "products/%s/%s%s".formatted(productId, UUID.randomUUID(), ext);
    }

    public static void ensureCover(java.util.List<? extends CoverableImage> images) {
        boolean hasCover = images.stream().anyMatch(CoverableImage::isCover);
        if (!hasCover && !images.isEmpty()) {
            images.get(0).setCover(true);
        }
    }

    public interface CoverableImage {
        boolean isCover();
        void setCover(boolean cover);
    }
}
