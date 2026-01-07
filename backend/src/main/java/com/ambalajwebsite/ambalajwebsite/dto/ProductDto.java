package com.ambalajwebsite.ambalajwebsite.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {

    private Long id;
    private String name;
    private String slug;
    private String brand;
    private FeatureDto productFeature;
    private String description;
    private java.util.List<ProductImageDto> images;
}
