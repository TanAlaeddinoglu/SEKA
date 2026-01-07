package com.ambalajwebsite.ambalajwebsite.dto;

import com.ambalajwebsite.ambalajwebsite.model.Product;
import com.ambalajwebsite.ambalajwebsite.model.ProductImage;
import org.springframework.stereotype.Component;

@Component
public class ProductDtoConverter {

    private final FeatureDtoConverter featureDtoConverter;
    private final ProductImageDtoConverter productImageDtoConverter;

    public ProductDtoConverter(FeatureDtoConverter featureDtoConverter,
                               ProductImageDtoConverter productImageDtoConverter) {
        this.featureDtoConverter = featureDtoConverter;
        this.productImageDtoConverter = productImageDtoConverter;
    }


    public ProductDto convert(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getProductName());
        dto.setSlug(product.getSlug());
        dto.setBrand(product.getBrand());
        dto.setDescription(product.getDescription());
        dto.setProductFeature(featureDtoConverter.convert(product.getFeature()));

        if (product.getImages() != null) {
            dto.setImages(product.getImages()
                    .stream()
                    .filter(ProductImage::isActive)
                    .map(productImageDtoConverter::convert)
                    .toList());
        }

        return dto;
    }

}
