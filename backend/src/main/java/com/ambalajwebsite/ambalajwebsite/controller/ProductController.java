package com.ambalajwebsite.ambalajwebsite.controller;

import com.ambalajwebsite.ambalajwebsite.dto.CreateProductRequest;
import com.ambalajwebsite.ambalajwebsite.dto.ProductDto;
import com.ambalajwebsite.ambalajwebsite.dto.ProductImageDto;
import com.ambalajwebsite.ambalajwebsite.service.ProductImageService;
import com.ambalajwebsite.ambalajwebsite.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// TODO: product delete calismiyor, update e bak

@RestController
@RequestMapping("/v1/products/")
public class ProductController {
    private final ProductService productService;
    private final ProductImageService productImageService;

    public ProductController(ProductService productService, ProductImageService productImageService) {
        this.productService = productService;
        this.productImageService = productImageService;
    }

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody CreateProductRequest createProductRequest) {
        return ResponseEntity.ok(productService.createProduct(createProductRequest));
    }

    @GetMapping
    public ResponseEntity<Page<ProductDto>> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String categoryName,
             Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(search, categoryName, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductDtoById(id));
    }

    @PatchMapping({"{id}"})
    public ResponseEntity<ProductDto> PartialUpdateProduct (@PathVariable Long id, @RequestBody ProductDto productDto) {
        return ResponseEntity.ok(productService.updateProduct(productDto, id));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateProduct(@PathVariable Long id) {
        productService.deactivateProduct(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) throws Exception {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<List<ProductImageDto>> uploadProductImages(@PathVariable Long id,
                                                                     @RequestParam("files") List<MultipartFile> files) throws Exception {
        return ResponseEntity.ok(productImageService.uploadImages(id, files));
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<ProductImageDto>> getProductImages(@PathVariable Long id) {
        return ResponseEntity.ok(productImageService.getImages(id));
    }

    @DeleteMapping("/{productId}/images/{imageId}")
    public ResponseEntity<Void> deleteProductImage(@PathVariable Long productId, @PathVariable Long imageId) throws Exception {
        productImageService.deleteImage(productId, imageId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{productId}/images/{imageId}/cover")
    public ResponseEntity<Void> setCoverImage(@PathVariable Long productId, @PathVariable Long imageId) {
        productImageService.setCover(productId, imageId);
        return ResponseEntity.ok().build();
    }
}
