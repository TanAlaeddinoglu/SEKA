package com.ambalajwebsite.ambalajwebsite.service;

import com.ambalajwebsite.ambalajwebsite.dto.ProductImageDto;
import com.ambalajwebsite.ambalajwebsite.dto.ProductImageDtoConverter;
import com.ambalajwebsite.ambalajwebsite.model.Product;
import com.ambalajwebsite.ambalajwebsite.model.ProductImage;
import com.ambalajwebsite.ambalajwebsite.repository.ProductImageRepository;
import com.ambalajwebsite.ambalajwebsite.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductImageServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductImageRepository productImageRepository;

    @Mock
    private StorageService storageService;

    @Mock
    private ProductImageDtoConverter productImageDtoConverter;

    @InjectMocks
    private ProductImageService productImageService;

    @Test
    void uploadImages_savesAndReturnsDtos() throws Exception {
        Product product = new Product();
        product.setId(1L);

        MockMultipartFile file = new MockMultipartFile(
                "files",
                "image.png",
                "image/png",
                "data".getBytes()
        );

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productImageRepository.countByProductIdAndIsActiveTrue(1L)).thenReturn(0L);
        doNothing().when(storageService).upload(org.mockito.ArgumentMatchers.anyString(), org.mockito.ArgumentMatchers.any());

        ProductImage savedImage = ProductImage.builder()
                .objectKey("key")
                .cover(false)
                .product(product)
                .build();

        List<ProductImage> savedImages = List.of(savedImage);
        when(productImageRepository.saveAll(org.mockito.ArgumentMatchers.anyList())).thenReturn(savedImages);

        List<ProductImage> activeImages = new ArrayList<>(savedImages);
        when(productImageRepository.findAllByProductIdAndIsActiveTrue(1L)).thenReturn(activeImages);
        when(productImageRepository.saveAll(activeImages)).thenReturn(activeImages);

        when(productImageDtoConverter.convert(savedImage))
                .thenReturn(ProductImageDto.builder().id(1L).objectKey("key").cover(true).build());

        List<ProductImageDto> result = productImageService.uploadImages(1L, List.of(file));

        assertEquals(1, result.size());
        assertTrue(activeImages.get(0).isCover());
        verify(storageService).upload(org.mockito.ArgumentMatchers.anyString(), org.mockito.ArgumentMatchers.eq(file));
    }

    @Test
    void deleteImage_removesAndDeletesObject() throws Exception {
        Product product = new Product();
        product.setId(1L);

        ProductImage image = ProductImage.builder().objectKey("key").product(product).build();
        image.setId(2L);
        product.setImages(new ArrayList<>(List.of(image)));

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productImageRepository.findByIdAndProductId(2L, 1L)).thenReturn(Optional.of(image));
        doNothing().when(storageService).delete("key");

        productImageService.deleteImage(1L, 2L);

        assertEquals(0, product.getImages().size());
        verify(storageService).delete("key");
        verify(productRepository).save(product);
    }

    @Test
    void deactivateImages_setsInactive() {
        Product product = new Product();
        product.setId(1L);

        ProductImage image1 = ProductImage.builder().objectKey("k1").product(product).build();
        ProductImage image2 = ProductImage.builder().objectKey("k2").product(product).build();
        product.setImages(new ArrayList<>(List.of(image1, image2)));

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(product)).thenReturn(product);

        productImageService.deactivateImages(1L);

        assertEquals(false, image1.isActive());
        assertEquals(false, image2.isActive());
        verify(productRepository).save(product);
    }
}
