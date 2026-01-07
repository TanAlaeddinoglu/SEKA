package com.ambalajwebsite.ambalajwebsite.controller;

import com.ambalajwebsite.ambalajwebsite.dto.CreateProductRequest;
import com.ambalajwebsite.ambalajwebsite.dto.ProductDto;
import com.ambalajwebsite.ambalajwebsite.dto.ProductDtoConverter;
import com.ambalajwebsite.ambalajwebsite.dto.ProductImageDto;
import com.ambalajwebsite.ambalajwebsite.model.Product;
import com.ambalajwebsite.ambalajwebsite.repository.ProductRepository;
import com.ambalajwebsite.ambalajwebsite.service.ProductImageService;
import com.ambalajwebsite.ambalajwebsite.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductService productService;
    @Mock
    private ProductDtoConverter productDtoConverter;
    @Mock
    private ProductImageService productImageService;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(
                new ProductController(productService, productImageService)
        ).build();
    }

    @Test
    void createProduct_returnsDto() throws Exception {
        CreateProductRequest request = new CreateProductRequest("Urun", "Marka", 2L, "Aciklama");
        ProductDto response = new ProductDto();
        response.setId(1L);
        response.setName("Urun");
        response.setSlug("urun");

        when(productService.createProduct(any())).thenReturn(response);

        mockMvc.perform(post("/v1/products/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.slug").value("urun"));
    }
//    @Test
//    void getAllProducts_returnsMappedPage() {
//
//        Product product = new Product();
//        product.setId(1L);
//        product.setProductName("Urun");
//
//        ProductDto dto = new ProductDto();
//        dto.setId(1L);
//        dto.setName("Urun");
//
//        Pageable pageable = PageRequest.of(0, 10);
//        Page<Product> productPage =
//                new PageImpl<>(List.of(product), pageable, 1);
//
//        when(productRepository.findAll(
//                ArgumentMatchers.<Specification<Product>>any(),
//                any(Pageable.class)
//        )).thenReturn(productPage);
//
//
//        when(productDtoConverter.convert(product))
//                .thenReturn(dto);
//
//        Page<ProductDto> result =
//                productService.getAllProducts("urun", pageable);
//
//        assertNotNull(result);
//        assertEquals(1, result.getTotalElements());
//        assertEquals("Urun", result.getContent().get(0).getName());
//    }


    @Test
    void getProductById_returnsDto() throws Exception {
        ProductDto response = new ProductDto();
        response.setId(1L);
        response.setName("Urun");

        when(productService.getProductDtoById(1L)).thenReturn(response);

        mockMvc.perform(get("/v1/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void partialUpdateProduct_returnsDto() throws Exception {
        ProductDto request = new ProductDto();
        request.setName("Yeni");
        ProductDto response = new ProductDto();
        response.setId(1L);
        response.setName("Yeni");

        when(productService.updateProduct(any(), eq(1L))).thenReturn(response);

        mockMvc.perform(patch("/v1/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Yeni"));
    }

    @Test
    void deactivateProduct_returnsOk() throws Exception {
        doNothing().when(productService).deactivateProduct(1L);

        mockMvc.perform(patch("/v1/products/1/deactivate"))
                .andExpect(status().isOk());
    }

    @Test
    void deleteProduct_returnsOk() throws Exception {
        doNothing().when(productService).deleteProduct(1L);

        mockMvc.perform(delete("/v1/products/1"))
                .andExpect(status().isOk());
    }

    @Test
    void uploadProductImages_returnsDtos() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "files",
                "image.png",
                "image/png",
                "data".getBytes()
        );
        ProductImageDto dto = ProductImageDto.builder().id(1L).objectKey("key").cover(false).build();
        when(productImageService.uploadImages(eq(1L), anyList())).thenReturn(List.of(dto));

        mockMvc.perform(MockMvcRequestBuilders.multipart("/v1/products/1/images")
                .file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void getProductImages_returnsList() throws Exception {
        ProductImageDto dto = ProductImageDto.builder().id(1L).objectKey("key").cover(true).build();
        when(productImageService.getImages(1L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/v1/products/1/images"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].cover").value(true));
    }

    @Test
    void deleteProductImage_returnsOk() throws Exception {
        doNothing().when(productImageService).deleteImage(1L, 2L);

        mockMvc.perform(delete("/v1/products/1/images/2"))
                .andExpect(status().isOk());
    }

    @Test
    void setCoverImage_returnsOk() throws Exception {
        doNothing().when(productImageService).setCover(1L, 2L);

        mockMvc.perform(post("/v1/products/1/images/2/cover"))
                .andExpect(status().isOk());
    }
}
