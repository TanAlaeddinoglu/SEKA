package com.ambalajwebsite.ambalajwebsite.dto;

import com.ambalajwebsite.ambalajwebsite.model.Category;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CategoryDtoConverter {


    private final ProductDtoConverter productDtoConverter;

    public CategoryDtoConverter(ProductDtoConverter productDtoConverter) {
        this.productDtoConverter = productDtoConverter;
    }


    public CategoryDto convert(Category category) {

        /**
         * İçine category alıp ProductDtoConverter ile birlikte CategoryDTO ya cevirir.
         * Service içine çağırılıp objeyi CategoryDTO yapıp, dış dünyaya açar.
         */

        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setCategoryName(category.getCategoryName());
        dto.setSlug(category.getSlug());
        dto.setProducts(category.getProducts()
                .stream()
                .map(productDtoConverter::convert)
                .collect(Collectors.toList())

        );
//        dto.setProducts(category.getProducts() == null
//                ? Collections.emptyList()
//                : category.getProducts()
//                .stream()
//                .map(productDtoConverter::convert)
//                .collect(Collectors.toList()));

        return dto;
    }
}
