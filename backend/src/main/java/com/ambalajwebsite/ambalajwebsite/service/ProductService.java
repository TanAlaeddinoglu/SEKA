package com.ambalajwebsite.ambalajwebsite.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.ambalajwebsite.ambalajwebsite.dto.BulkCreateProductRequest;
import com.ambalajwebsite.ambalajwebsite.dto.BulkProductFeatureRequest;
import com.ambalajwebsite.ambalajwebsite.dto.CreateProductRequest;
import com.ambalajwebsite.ambalajwebsite.dto.ProductDto;
import com.ambalajwebsite.ambalajwebsite.dto.ProductDtoConverter;
import com.ambalajwebsite.ambalajwebsite.model.Category;
import com.ambalajwebsite.ambalajwebsite.model.Product;
import com.ambalajwebsite.ambalajwebsite.model.ProductFeature;
import com.ambalajwebsite.ambalajwebsite.repository.CategoryRepository;
import com.ambalajwebsite.ambalajwebsite.repository.ProductRepository;
import com.ambalajwebsite.ambalajwebsite.util.ProductSpecification;
import com.ambalajwebsite.ambalajwebsite.util.SlugGenerator;
import com.ambalajwebsite.ambalajwebsite.util.SlugUtil;

import jakarta.persistence.EntityNotFoundException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;


@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductDtoConverter productDtoConverter;
    private final CategoryRepository categoryRepository;
    private final ProductImageService productImageService;

    public ProductService(ProductRepository productRepository,
                          ProductDtoConverter productDtoConverter,
                          CategoryRepository categoryRepository,
                          ProductImageService productImageService) {
        this.productRepository = productRepository;
        this.productDtoConverter = productDtoConverter;
        this.categoryRepository = categoryRepository;
        this.productImageService = productImageService;
    }

    public ProductDto createProduct(CreateProductRequest createProductRequest) {
        Long categoryId = createProductRequest.getCategoryId();
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id:" + categoryId));
        Product product = new Product();
        product.setProductName(createProductRequest.getName());

        String uniqueSlug = SlugGenerator.generateUniqueSlug(
                createProductRequest.getName(),
                productRepository::existsBySlug);
        product.setSlug(uniqueSlug);

        product.setBrand(createProductRequest.getBrand());
        product.setCategory(category);
        product.setDescription(createProductRequest.getDescription());

        Product savedProduct = productRepository.save(product);
        return productDtoConverter.convert(savedProduct);
    }

    @Transactional
    public List<ProductDto> createProductsBulk(List<BulkCreateProductRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new IllegalArgumentException("Request list cannot be empty.");
        }

        List<ProductDto> createdProducts = new ArrayList<>();
        Set<String> reservedSlugs = new HashSet<>();
        Map<Long, Category> categoryCache = new HashMap<>();

        for (int i = 0; i < requests.size(); i++) {
            BulkCreateProductRequest request = requests.get(i);
            int rowNumber = i + 1;

            if (request == null) {
                throw new IllegalArgumentException("Row " + rowNumber + ": product payload is missing.");
            }
            if (!StringUtils.hasText(request.getName())) {
                throw new IllegalArgumentException("Row " + rowNumber + ": name is required.");
            }
            if (request.getCategoryId() == null) {
                throw new IllegalArgumentException("Row " + rowNumber + ": categoryId is required.");
            }

            Category category = categoryCache.computeIfAbsent(
                    request.getCategoryId(),
                    categoryId -> categoryRepository.findById(categoryId)
                            .orElseThrow(() -> new EntityNotFoundException("Category not found with id:" + categoryId))
            );

            Product product = new Product();
            product.setProductName(request.getName().trim());
            product.setSlug(generateUniqueSlugForBulk(request.getName(), reservedSlugs));
            product.setBrand(request.getBrand());
            product.setCategory(category);
            product.setDescription(request.getDescription());

            BulkProductFeatureRequest featureRequest = request.getFeature();
            if (featureRequest != null && featureRequest.hasAnyValue()) {
                validateFeature(featureRequest, rowNumber);

                ProductFeature feature = new ProductFeature();
                feature.setUnit(featureRequest.getUnitType());
                feature.setUnitPerPack(featureRequest.getUnitPerPack());
                feature.setPackPerCarton(featureRequest.getUnitPerCarton());
                feature.setColor(featureRequest.getColor());
                feature.setSize(featureRequest.getSize());
                feature.setWeight(featureRequest.getWeight());
                feature.setProduct(product);

                product.setFeature(feature);
            }

            Product savedProduct = productRepository.save(product);
            createdProducts.add(productDtoConverter.convert(savedProduct));
        }

        return createdProducts;
    }

    public ProductDto getProductDtoById(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found with id:" + id));

        return productDtoConverter.convert(product);
    }

    public Page<ProductDto> getAllProducts(String search, String categoryName, Pageable pageable) {
        Specification<Product> specification = ProductSpecification.search(search)
                .and(ProductSpecification.hasCategoryName(categoryName));
        return productRepository.findAll(specification, pageable)
                .map(productDtoConverter::convert);
    }

    public ProductDto updateProduct(ProductDto productDto, Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id:" + id));

        if (productDto.getName() != null) {
            product.setProductName(productDto.getName());
            String uniqueSlug = SlugGenerator.generateUniqueSlug(
                    productDto.getName(),
                    slug -> productRepository.existsBySlugAndIdNot(slug, id));
            product.setSlug(uniqueSlug);
        }

        if (productDto.getBrand() != null) {
            product.setBrand(productDto.getBrand());
        }

        if (productDto.getDescription() != null) {
            product.setDescription(productDto.getDescription());
        }
        if (productDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found with id:" + productDto.getCategoryId()));
            product.setCategory(category);
        }
        if (productDto.getIsActive() != null) {
            product.setActive(productDto.getIsActive());
        }

        Product savedProduct = productRepository.save(product);
        return productDtoConverter.convert(savedProduct);
    }


    public void deactivateProduct(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found with id:" + id));
        product.setActive(false);
        productImageService.deactivateImages(id);
        productRepository.save(product);
    }

    public void deleteProduct(Long id) throws Exception {
        Product product = productRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Product not found with id:" + id));

        productImageService.deleteAllForProduct(id);
        productRepository.delete(product);
    }

    private void validateFeature(BulkProductFeatureRequest featureRequest, int rowNumber) {
        if (featureRequest.getUnitType() == null
                || featureRequest.getUnitPerPack() == null
                || featureRequest.getUnitPerCarton() == null) {
            throw new IllegalArgumentException(
                    "Row " + rowNumber + ": feature.unitType, feature.unitPerPack and feature.unitPerCarton are required when feature is provided."
            );
        }
    }

    private String generateUniqueSlugForBulk(String source, Set<String> reservedSlugs) {
        String baseSlug = SlugUtil.toSlug(source);
        if (!StringUtils.hasText(baseSlug)) {
            baseSlug = "urun";
        }

        String slug = baseSlug;
        int counter = 1;
        while (reservedSlugs.contains(slug) || productRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter;
            counter++;
        }

        reservedSlugs.add(slug);
        return slug;
    }

}
