package com.ambalajwebsite.ambalajwebsite.dto;

import com.ambalajwebsite.ambalajwebsite.model.Category;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryDtoConverter {


    private final ProductDtoConverter productDtoConverter;

    public CategoryDtoConverter(ProductDtoConverter productDtoConverter) {
        this.productDtoConverter = productDtoConverter;
    }


    public CategoryDto convert(Category category) {

        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setCategoryName(category.getCategoryName());
        dto.setSlug(category.getSlug());
        dto.setIsActive(category.isActive());
        if (category.getProducts() != null) {
            dto.setProductCount(category.getProducts().size());
            dto.setProducts(category.getProducts()
                    .stream()
                    .map(productDtoConverter::convert)
                    .collect(Collectors.toList())

            );
        } else {
            dto.setProductCount(0);
            dto.setProducts(List.of());
        }
//        dto.setProducts(category.getProducts() == null
//                ? Collections.emptyList()
//                : category.getProducts()
//                .stream()
//                .map(productDtoConverter::convert)
//                .collect(Collectors.toList()));

        return dto;
    }
}
