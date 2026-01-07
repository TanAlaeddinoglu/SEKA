package com.ambalajwebsite.ambalajwebsite.service;

import com.ambalajwebsite.ambalajwebsite.dto.FeatureDto;
import com.ambalajwebsite.ambalajwebsite.dto.FeatureDtoConverter;
import com.ambalajwebsite.ambalajwebsite.model.Product;
import com.ambalajwebsite.ambalajwebsite.model.ProductFeature;
import com.ambalajwebsite.ambalajwebsite.model.UnitType;
import com.ambalajwebsite.ambalajwebsite.repository.ProductFeatureRepository;
import com.ambalajwebsite.ambalajwebsite.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductFeatureServiceTest {

    @Mock
    private ProductFeatureRepository productFeatureRepository;

    @Mock
    private FeatureDtoConverter featureDtoConverter;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductFeatureService productFeatureService;

    @Test
    void createProductFeature_savesWhenMissing() {
        Product product = new Product();
        product.setId(5L);

        FeatureDto request = new FeatureDto(null, UnitType.PIECE, 10, 2, "mavi", "10x10", "1kg", 5L);
        ProductFeature saved = ProductFeature.builder()
                .id(1L)
                .unit(UnitType.PIECE)
                .unitPerPack(10)
                .packPerCarton(2)
                .color("mavi")
                .size("10x10")
                .weight("1kg")
                .product(product)
                .build();

        when(productRepository.findById(5L)).thenReturn(Optional.of(product));
        when(productFeatureRepository.save(org.mockito.ArgumentMatchers.any(ProductFeature.class))).thenReturn(saved);
        when(featureDtoConverter.convert(saved)).thenReturn(new FeatureDto(1L, UnitType.PIECE, 10, 2, "mavi", "10x10", "1kg", 5L));

        FeatureDto result = productFeatureService.createProductFeature(request);

        assertEquals(1L, result.getId());
        assertEquals(UnitType.PIECE, result.getUnitType());
    }

    @Test
    void createProductFeature_throwsWhenAlreadyExists() {
        Product product = new Product();
        product.setId(5L);
        product.setFeature(new ProductFeature());

        when(productRepository.findById(5L)).thenReturn(Optional.of(product));

        FeatureDto request = new FeatureDto(null, UnitType.PIECE, 10, 2, "mavi", "10x10", "1kg", 5L);

        assertThrows(IllegalStateException.class, () -> productFeatureService.createProductFeature(request));
    }

    @Test
    void updateFeature_updatesAndSaves() {
        ProductFeature feature = new ProductFeature();
        feature.setId(1L);
        feature.setUnit(UnitType.PIECE);

        when(productFeatureRepository.findById(1L)).thenReturn(Optional.of(feature));
        when(productFeatureRepository.save(feature)).thenReturn(feature);
        when(featureDtoConverter.convert(feature)).thenReturn(new FeatureDto(1L, UnitType.LITER, 2, 3, null, null, null, 5L));

        FeatureDto request = new FeatureDto(null, UnitType.LITER, 2, 3, null, null, null, null);
        FeatureDto result = productFeatureService.updateFeature(request, 1L);

        assertEquals(UnitType.LITER, feature.getUnit());
        assertEquals(1L, result.getId());
    }

    @Test
    void getAllProductFeatures_returnsList() {
        ProductFeature feature = new ProductFeature();
        feature.setId(1L);
        when(productFeatureRepository.findAll()).thenReturn(List.of(feature));
        when(featureDtoConverter.convert(feature)).thenReturn(new FeatureDto(1L, UnitType.PIECE, 1, 1, null, null, null, 5L));

        List<FeatureDto> result = productFeatureService.getAllProductsFeatures();
        assertEquals(1, result.size());
    }
}
