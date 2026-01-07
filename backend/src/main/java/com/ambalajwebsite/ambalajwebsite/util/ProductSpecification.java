package com.ambalajwebsite.ambalajwebsite.util;

import com.ambalajwebsite.ambalajwebsite.model.Product;
import org.springframework.data.jpa.domain.Specification;

public final class  ProductSpecification {
    private ProductSpecification() {}
    public static Specification<Product> search(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if(keyword == null || keyword.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            String like = "%" + keyword + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("productName")), like),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("brand")), like),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("slug")), like)
            );
        };
    }
}
