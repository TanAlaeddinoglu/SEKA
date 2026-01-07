package com.ambalajwebsite.ambalajwebsite.dto;

import com.ambalajwebsite.ambalajwebsite.model.ProductImage;
import com.ambalajwebsite.ambalajwebsite.service.StorageService;
import org.springframework.stereotype.Component;

@Component
public class ProductImageDtoConverter {

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
            dto.setUrl(null);
        }
        return dto;
    }
}
