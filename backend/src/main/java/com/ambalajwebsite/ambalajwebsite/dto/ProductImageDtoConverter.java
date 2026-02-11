package com.ambalajwebsite.ambalajwebsite.dto;

import com.ambalajwebsite.ambalajwebsite.model.ProductImage;
import com.ambalajwebsite.ambalajwebsite.service.StorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ProductImageDtoConverter {

    private static final Logger log = LoggerFactory.getLogger(ProductImageDtoConverter.class);

    private final StorageService storageService;

    public ProductImageDtoConverter(StorageService storageService) {
        this.storageService = storageService;
    }

    public ProductImageDto convert(ProductImage image) {
        ProductImageDto dto = new ProductImageDto();
        dto.setId(image.getId());
        dto.setObjectKey(image.getObjectKey());
        dto.setCover(image.isCover());
        try {
            dto.setUrl(storageService.presign(image.getObjectKey()));
        } catch (Exception e) {
            log.error("Failed to generate presigned URL for objectKey={}", image.getObjectKey(), e);
            dto.setUrl(null);
        }
        return dto;
    }
}
