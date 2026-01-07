package com.ambalajwebsite.ambalajwebsite.service;

import com.ambalajwebsite.ambalajwebsite.dto.ProductImageDto;
import com.ambalajwebsite.ambalajwebsite.dto.ProductImageDtoConverter;
import com.ambalajwebsite.ambalajwebsite.model.Product;
import com.ambalajwebsite.ambalajwebsite.model.ProductImage;
import com.ambalajwebsite.ambalajwebsite.repository.ProductRepository;
import com.ambalajwebsite.ambalajwebsite.repository.ProductImageRepository;
import com.ambalajwebsite.ambalajwebsite.util.ImageUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductImageService {

    private static final int MAX_IMAGES = 10;

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final StorageService storageService;
    private final ProductImageDtoConverter productImageDtoConverter;

    public ProductImageService(ProductRepository productRepository,
                               ProductImageRepository productImageRepository,
                               StorageService storageService,
                               ProductImageDtoConverter productImageDtoConverter) {
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.storageService = storageService;
        this.productImageDtoConverter = productImageDtoConverter;
    }

    public List<ProductImageDto> uploadImages(Long productId, List<MultipartFile> files) throws Exception {
        Product product = productRepository.findById(productId).orElseThrow(() ->
                new EntityNotFoundException("Product not found with id: " + productId)
        );
        long activeCount = productImageRepository.countByProductIdAndIsActiveTrue(productId);
        if (activeCount + files.size() > MAX_IMAGES) {
            throw new IllegalArgumentException("Max " + MAX_IMAGES + " images allowed per product");
        }

        List<ProductImage> toSave = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }
            if (!ImageUtils.isImage(file)) {
                throw new IllegalArgumentException("Only image uploads are allowed");
            }
            String objectKey = ImageUtils.buildObjectKey(productId, file.getOriginalFilename());
            storageService.upload(objectKey, file);

            ProductImage image = ProductImage.builder()
                    .objectKey(objectKey)
                    .cover(false)
                    .product(product)
                    .build();
            toSave.add(image);
        }

        List<ProductImage> savedImages = productImageRepository.saveAll(toSave);

        List<ProductImage> activeImages = productImageRepository.findAllByProductIdAndIsActiveTrue(productId);
        ImageUtils.ensureCover(activeImages);
        productImageRepository.saveAll(activeImages);

        return savedImages.stream().map(productImageDtoConverter::convert).toList();
    }

    public List<ProductImageDto> getImages(Long productId) {
        return productImageRepository.findAllByProductIdAndIsActiveTrue(productId).stream()
                .map(productImageDtoConverter::convert)
                .toList();
    }

    public void setCover(Long productId, Long imageId) {
        Product product = productRepository.findById(productId).orElseThrow();
        product.getImages().forEach(img -> img.setCover(img.getId().equals(imageId)));
        productRepository.save(product);
    }

    public void deleteImage(Long productId, Long imageId) throws Exception {
        Product product = productRepository.findById(productId).orElseThrow();
        ProductImage image = productImageRepository.findByIdAndProductId(imageId, productId).orElseThrow();

        storageService.delete(image.getObjectKey());
        product.getImages().removeIf(img -> img.getId().equals(imageId));
        ImageUtils.ensureCover(product.getImages().stream().filter(ProductImage::isActive).toList());
        productRepository.save(product);
    }

    public void deleteAllForProduct(Long productId) throws Exception {
        Product product = productRepository.findById(productId).orElseThrow();
        for (ProductImage image : new ArrayList<>(product.getImages())) {
            storageService.delete(image.getObjectKey());
        }
        product.getImages().clear();
        productRepository.save(product);
    }

    public void deactivateImages(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow();
        product.getImages().forEach(img -> img.setActive(false));
        productRepository.save(product);
    }

}
