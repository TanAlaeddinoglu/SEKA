package com.ambalajwebsite.ambalajwebsite.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BulkCreateProductRequest {
    private String name;
    private String brand;
    private Long categoryId;
    private String description;
    private BulkProductFeatureRequest feature;
}
