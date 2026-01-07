package com.ambalajwebsite.ambalajwebsite.repository;

import com.ambalajwebsite.ambalajwebsite.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
//    boolean existsBySlugAndIdNot(String slug, Long id);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

//    @Override
//    Optional<Category> findById(Long aLong);
}
