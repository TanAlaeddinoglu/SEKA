package com.ambalajwebsite.ambalajwebsite.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.ambalajwebsite.ambalajwebsite.dto.CreateProductRequest;
import com.ambalajwebsite.ambalajwebsite.dto.ProductDto;
import com.ambalajwebsite.ambalajwebsite.dto.ProductDtoConverter;
import com.ambalajwebsite.ambalajwebsite.model.Category;
import com.ambalajwebsite.ambalajwebsite.model.Product;
import com.ambalajwebsite.ambalajwebsite.repository.CategoryRepository;
import com.ambalajwebsite.ambalajwebsite.repository.ProductRepository;
import com.ambalajwebsite.ambalajwebsite.util.ProductSpecification;
import com.ambalajwebsite.ambalajwebsite.util.SlugGenerator;

import jakarta.persistence.EntityNotFoundException;


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

}
