package com.ambalajwebsite.ambalajwebsite.service;

import com.ambalajwebsite.ambalajwebsite.dto.CreateProductRequest;
import com.ambalajwebsite.ambalajwebsite.dto.ProductDto;
import com.ambalajwebsite.ambalajwebsite.dto.ProductDtoConverter;
import com.ambalajwebsite.ambalajwebsite.model.Category;
import com.ambalajwebsite.ambalajwebsite.model.Product;
import com.ambalajwebsite.ambalajwebsite.repository.CategoryRepository;
import com.ambalajwebsite.ambalajwebsite.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductDtoConverter productDtoConverter;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductImageService productImageService;

    @InjectMocks
    private ProductService productService;

    @Test
    void createProduct_setsFieldsAndReturnsDto() {
        Category category = new Category();
        category.setId(2L);
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(category));
        when(productRepository.existsBySlug("urun")).thenReturn(false);

        Product saved = new Product();
        saved.setId(1L);
        saved.setProductName("Urun");
        saved.setSlug("urun");
        saved.setBrand("Marka");
        saved.setCategory(category);
        saved.setDescription("Aciklama");

        when(productRepository.save(org.mockito.ArgumentMatchers.any(Product.class))).thenReturn(saved);
        ProductDto createdDto = new ProductDto();
        createdDto.setId(1L);
        createdDto.setName("Urun");
        createdDto.setSlug("urun");
        createdDto.setBrand("Marka");
        createdDto.setDescription("Aciklama");
        createdDto.setImages(List.of());
        when(productDtoConverter.convert(saved)).thenReturn(createdDto);

        ProductDto result = productService.createProduct(new CreateProductRequest("Urun", "Marka", 2L, "Aciklama"));

        ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository).save(captor.capture());
        assertEquals("Urun", captor.getValue().getProductName());
        assertEquals("urun", captor.getValue().getSlug());
        assertEquals("Aciklama", captor.getValue().getDescription());
        assertEquals(1L, result.getId());
    }

    @Test
    void getProductDtoById_returnsDto() {
        Product product = new Product();
        product.setId(1L);
        product.setProductName("Urun");

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        ProductDto dto = new ProductDto();
        dto.setId(1L);
        dto.setName("Urun");
        when(productDtoConverter.convert(product)).thenReturn(dto);

        ProductDto result = productService.getProductDtoById(1L);
        assertEquals(1L, result.getId());
    }

    @Test
    void updateProduct_updatesFieldsAndSaves() {
        Product product = new Product();
        product.setId(1L);
        product.setProductName("Eski");
        product.setSlug("eski");

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.existsBySlugAndIdNot("yeni", 1L)).thenReturn(false);
        when(productRepository.save(product)).thenReturn(product);
        ProductDto updatedDto = new ProductDto();
        updatedDto.setId(1L);
        updatedDto.setName("Yeni");
        updatedDto.setSlug("yeni");
        updatedDto.setBrand("Marka");
        updatedDto.setDescription("Aciklama");
        updatedDto.setImages(List.of());
        when(productDtoConverter.convert(product)).thenReturn(updatedDto);

        ProductDto request = new ProductDto();
        request.setName("Yeni");
        request.setBrand("Marka");
        request.setDescription("Aciklama");

        ProductDto result = productService.updateProduct(request, 1L);

        assertEquals("Yeni", product.getProductName());
        assertEquals("yeni", product.getSlug());
        assertEquals("Marka", product.getBrand());
        assertEquals("Aciklama", product.getDescription());
        assertEquals(1L, result.getId());
    }

    @Test
    void deactivateProduct_setsInactiveAndDeactivatesImages() {
        Product product = new Product();
        product.setId(1L);
        product.setActive(true);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(product)).thenReturn(product);
        doNothing().when(productImageService).deactivateImages(1L);

        productService.deactivateProduct(1L);

        assertEquals(false, product.isActive());
        verify(productImageService).deactivateImages(1L);
        verify(productRepository).save(product);
    }

    @Test
    void deleteProduct_deletesImagesAndProduct() throws Exception {
        Product product = new Product();
        product.setId(1L);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        doNothing().when(productImageService).deleteAllForProduct(1L);
        doNothing().when(productRepository).delete(product);

        productService.deleteProduct(1L);

        verify(productImageService).deleteAllForProduct(1L);
        verify(productRepository).delete(product);
    }
}
