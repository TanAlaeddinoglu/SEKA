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
public class CategoryDto {
    private Long id;
    private String categoryName;
    private String slug;
    private Integer productCount;
    private List<ProductDto> products;
    private Boolean isActive;
}
