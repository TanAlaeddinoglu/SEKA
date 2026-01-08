package com.ambalajwebsite.ambalajwebsite.controller;

import com.ambalajwebsite.ambalajwebsite.dto.CreateFeatureRequest;
import com.ambalajwebsite.ambalajwebsite.dto.FeatureDto;
import com.ambalajwebsite.ambalajwebsite.service.ProductFeatureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/v1/product-feature/")
public class ProductFeatureController {
    private final ProductFeatureService productFeatureService;

    public ProductFeatureController(ProductFeatureService productFeatureService) {
        this.productFeatureService = productFeatureService;
    }

    @PostMapping
    public ResponseEntity<FeatureDto> createProductFeature(@Valid @RequestBody CreateFeatureRequest featureRequest) {
        return ResponseEntity.ok(productFeatureService.createProductFeature(featureRequest));
    }

    @GetMapping
    public ResponseEntity<List<FeatureDto>> getAllProductFeatures() {
        return ResponseEntity.ok(productFeatureService.getAllProductsFeatures());
    }

    @GetMapping("{id}")
    public ResponseEntity<FeatureDto> getFeatureDtoById(@PathVariable Long id) {
        return ResponseEntity.ok(productFeatureService.getFeatureDtoById(id));
    }

    @PatchMapping({"{id}"})
    public ResponseEntity<FeatureDto> PartialUpdateProductFeature (@PathVariable Long id, @RequestBody FeatureDto featureDto) {
        return ResponseEntity.ok(productFeatureService.updateFeature(featureDto, id));
    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteProductFeature(@PathVariable Long id)  {
//        productFeatureService.deleteProduct(id);
//        return ResponseEntity.ok().build();
//    }
}
