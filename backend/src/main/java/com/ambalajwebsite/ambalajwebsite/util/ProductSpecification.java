package com.ambalajwebsite.ambalajwebsite.util;

import com.ambalajwebsite.ambalajwebsite.model.Product;
import org.springframework.data.jpa.domain.Specification;

import java.util.Locale;

public final class  ProductSpecification {
    private ProductSpecification() {}
    public static Specification<Product> search(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if(keyword == null || keyword.isBlank()) {
                return criteriaBuilder.conjunction();
            }
            String normalizedKeyword = keyword.trim().toLowerCase(Locale.ROOT);
            String like = "%" + normalizedKeyword + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("productName")), like),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("brand")), like),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("slug")), like)
            );
        };
    }

    public static Specification<Product> hasCategoryName(String categoryName) {
        return (root, query, criteriaBuilder) -> {
            if (categoryName == null || categoryName.isBlank()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(
                    criteriaBuilder.lower(root.get("category").get("categoryName")),
                    categoryName.toLowerCase()
            );
        };
    }
}
