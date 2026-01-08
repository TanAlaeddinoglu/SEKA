package com.ambalajwebsite.ambalajwebsite.service;

import com.ambalajwebsite.ambalajwebsite.dto.CategoryDto;
import com.ambalajwebsite.ambalajwebsite.dto.CategoryDtoConverter;
import com.ambalajwebsite.ambalajwebsite.dto.CreateCategoryDto;
import com.ambalajwebsite.ambalajwebsite.model.Category;
import com.ambalajwebsite.ambalajwebsite.model.Product;
import com.ambalajwebsite.ambalajwebsite.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryDtoConverter categoryDtoConverter;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void createCategory_generatesSlugAndReturnsDto() {
        CreateCategoryDto request = new CreateCategoryDto("Koli Kutular");
        when(categoryRepository.existsBySlug("koli-kutular")).thenReturn(false);

        Category saved = new Category();
        saved.setId(1L);
        saved.setCategoryName("Koli Kutular");
        saved.setSlug("koli-kutular");

        when(categoryRepository.save(org.mockito.ArgumentMatchers.any(Category.class))).thenReturn(saved);
        when(categoryDtoConverter.convert(saved)).thenReturn(new CategoryDto(1L, "Koli Kutular", "koli-kutular", List.of(), true));

        CategoryDto result = categoryService.createCategory(request);

        ArgumentCaptor<Category> captor = ArgumentCaptor.forClass(Category.class);
        verify(categoryRepository).save(captor.capture());
        assertEquals("Koli Kutular", captor.getValue().getCategoryName());
        assertEquals("koli-kutular", captor.getValue().getSlug());
        assertEquals(1L, result.getId());
    }

    @Test
    void getCategoryDtoById_returnsDto() {
        Category category = new Category();
        category.setId(1L);
        category.setCategoryName("Koli");
        category.setSlug("koli");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryDtoConverter.convert(category)).thenReturn(new CategoryDto(1L, "Koli", "koli", List.of(), true));

        CategoryDto result = categoryService.getCategoryDtoById(1L);
        assertEquals("koli", result.getSlug());
    }

    @Test
    void updateCategory_updatesNameAndSlug() {
        Category category = new Category();
        category.setId(1L);
        category.setCategoryName("Eski");
        category.setSlug("eski");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.existsBySlugAndIdNot("yeni", 1L)).thenReturn(false);
        when(categoryDtoConverter.convert(category)).thenReturn(new CategoryDto(1L, "Yeni", "yeni", List.of(),true));

        CategoryDto request = new CategoryDto(null, "Yeni", null, null,true);
        CategoryDto result = categoryService.updateCategory(request, 1L);

        assertEquals("Yeni", category.getCategoryName());
        assertEquals("yeni", category.getSlug());
        assertEquals("yeni", result.getSlug());
    }

    @Test
    void deleteCategory_throwsWhenHasProducts() {
        Category category = new Category();
        category.setId(1L);
        category.setProducts(List.of(new Product()));

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        assertThrows(IllegalStateException.class, () -> categoryService.deleteCategoryById(1L));
    }

    @Test
    void deleteCategory_deletesWhenEmpty() {
        Category category = new Category();
        category.setId(1L);
        category.setProducts(List.of());

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        doNothing().when(categoryRepository).delete(category);

        categoryService.deleteCategoryById(1L);
        verify(categoryRepository).delete(category);
    }
}
