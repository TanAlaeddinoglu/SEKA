package com.ambalajwebsite.ambalajwebsite.service;

import com.ambalajwebsite.ambalajwebsite.dto.FeatureDto;
import com.ambalajwebsite.ambalajwebsite.dto.FeatureDtoConverter;
import com.ambalajwebsite.ambalajwebsite.model.Product;
import com.ambalajwebsite.ambalajwebsite.model.ProductFeature;
import com.ambalajwebsite.ambalajwebsite.repository.ProductFeatureRepository;
import com.ambalajwebsite.ambalajwebsite.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductFeatureService {

    private final ProductFeatureRepository productFeatureRepository;
    private final FeatureDtoConverter featureDtoConverter;
    private final ProductRepository productRepository;

    public ProductFeatureService(ProductFeatureRepository productFeatureRepository, FeatureDtoConverter featureDtoConverter, ProductRepository productRepository) {
        this.productFeatureRepository = productFeatureRepository;
        this.featureDtoConverter = featureDtoConverter;
        this.productRepository = productRepository;
    }

    public FeatureDto createProductFeature(FeatureDto featureDto) {
        Product product = productRepository.findById(featureDto.getProductId())
                .orElseThrow(() -> (new EntityNotFoundException("Product not found")));

        if (product.getFeature() != null) {
            throw new IllegalStateException(
                    "Product already has a feature"
            );
        }

        ProductFeature feature = new ProductFeature();
        feature.setUnit(featureDto.getUnitType());
        feature.setUnitPerPack(featureDto.getUnitPerPack());
        feature.setPackPerCarton(featureDto.getUnitPerCarton());
        feature.setColor(featureDto.getColor());
        feature.setSize(featureDto.getSize());
        feature.setWeight(featureDto.getWeight());
        feature.setProduct(product);

        ProductFeature productFeature = productFeatureRepository.save(feature);
        return featureDtoConverter.convert(productFeature);
    }

    public FeatureDto getFeatureDtoById(Long id) {
        Optional<ProductFeature> productFeature = productFeatureRepository.findById(id);

        return featureDtoConverter.convert(productFeature.orElseThrow());
    }

    public List<FeatureDto> getAllProductsFeatures() {
        List<ProductFeature> productsFeatures = productFeatureRepository.findAll();
        List<FeatureDto> productFeatureDtoList = new ArrayList<>();
        productsFeatures.forEach(productFeature -> productFeatureDtoList.add(featureDtoConverter.convert(productFeature)));

        return productFeatureDtoList;

    }

    public FeatureDto updateFeature(FeatureDto featureDto, Long id) {
        ProductFeature productFeature = productFeatureRepository.findById(id)
                .orElseThrow(() -> (new EntityNotFoundException("Product Feature not found with id:" + id)));

        if (featureDto.getUnitType() != null) {
            productFeature.setUnit(featureDto.getUnitType());
        }

        if (featureDto.getUnitPerPack() != null) {
            productFeature.setUnitPerPack(featureDto.getUnitPerPack());
        }

        if (featureDto.getUnitPerCarton() != null) {
            productFeature.setPackPerCarton(featureDto.getUnitPerCarton());
        }

        if (featureDto.getColor() != null) {
            productFeature.setColor(featureDto.getColor());
        }

        if (featureDto.getSize() != null) {
            productFeature.setSize(featureDto.getSize());
        }

        if (featureDto.getWeight() != null) {
            productFeature.setWeight(featureDto.getWeight());
        }

        ProductFeature saved = productFeatureRepository.save(productFeature);
        return featureDtoConverter.convert(saved);
    }


//    public void deleteProduct(Long id) {
//        ProductFeature feature = productFeatureRepository.findById(id)
//                .orElseThrow(()-> new EntityNotFoundException("Product Feature not found with id:" + id));
//        productFeatureRepository.delete(feature);
//
//    }
}
