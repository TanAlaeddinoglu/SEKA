package com.ambalajwebsite.ambalajwebsite.service;

import com.ambalajwebsite.ambalajwebsite.dto.CategoryDto;
import com.ambalajwebsite.ambalajwebsite.dto.CategoryDtoConverter;
import com.ambalajwebsite.ambalajwebsite.dto.CreateCategoryDto;
import com.ambalajwebsite.ambalajwebsite.model.Category;
import com.ambalajwebsite.ambalajwebsite.repository.CategoryRepository;
import com.ambalajwebsite.ambalajwebsite.util.SlugGenerator;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryDtoConverter categoryDtoConverter;

    public CategoryService(CategoryRepository categoryRepository, CategoryDtoConverter categoryDtoConverter) {
        this.categoryRepository = categoryRepository;
        this.categoryDtoConverter = categoryDtoConverter;
    }

    public CategoryDto createCategory(CreateCategoryDto categoryDto) {

        String uniqueSlug = SlugGenerator.generateUniqueSlug(
                categoryDto.getCategoryName(),
                categoryRepository::existsBySlug);

        Category category = new Category();
        category.setCategoryName(categoryDto.getCategoryName());
        category.setSlug(uniqueSlug);

        Category saved = categoryRepository.save(category);
        return categoryDtoConverter.convert(saved);
    }

    public CategoryDto getCategoryDtoById (Long id) {
        Optional<Category> category = categoryRepository.findById(id);

        return category.map(categoryDtoConverter::convert).orElseThrow();
    }

    public @Nullable List<CategoryDto> getAllCategory() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryDto> categoryDtoList = new ArrayList<>();

//        for (Category category : categories) {
//            categoryDtoList.add(categoryDtoConverter.convert(category));
//        }

        categories.stream().map(categoryDtoConverter::convert).forEach(categoryDtoList::add);
        return categoryDtoList;
    }
    @Transactional
    public CategoryDto updateCategory(CategoryDto categoryDto, Long id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Category not found with id:" + id));

        if (categoryDto.getCategoryName() != null) {
            category.setCategoryName(categoryDto.getCategoryName());
            String uniqueSlug = SlugGenerator.generateUniqueSlug(
                    categoryDto.getCategoryName(),
                    slug -> categoryRepository.existsBySlugAndIdNot(slug, id));
            category.setSlug(uniqueSlug);
        }

        return categoryDtoConverter.convert(category);
    }

    public void deleteCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Category not found with id:" + id));

        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            throw new IllegalStateException(
                    "Category has products, cannot be deleted"
            );
        }
        categoryRepository.delete(category);
    }

}
