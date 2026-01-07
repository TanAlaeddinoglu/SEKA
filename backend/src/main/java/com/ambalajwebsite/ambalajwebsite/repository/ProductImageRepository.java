package com.ambalajwebsite.ambalajwebsite.repository;

import com.ambalajwebsite.ambalajwebsite.model.ProductImage;
import com.ambalajwebsite.ambalajwebsite.util.ImageUtils;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findAllByProductIdAndIsActiveTrue(Long productId);

    long countByProductIdAndIsActiveTrue(Long productId);

    Optional<ProductImage> findByIdAndProductId(Long id, Long productId);

    List<? extends ImageUtils.CoverableImage> findByProductIdAndIsActiveTrue(Long productId);
}
