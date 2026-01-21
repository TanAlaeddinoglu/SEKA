package com.ambalajwebsite.ambalajwebsite.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {

    private Long id;
    private String name;
    private String slug;
    private String brand;
    private CategoryDto category;
    private Long categoryId;
    private FeatureDto productFeature;
    private String description;
    private List<ProductImageDto> images;
    private Boolean isActive;
}
