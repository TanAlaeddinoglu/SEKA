package com.ambalajwebsite.ambalajwebsite.controller;

import com.ambalajwebsite.ambalajwebsite.dto.FeatureDto;
import com.ambalajwebsite.ambalajwebsite.model.UnitType;
import com.ambalajwebsite.ambalajwebsite.service.ProductFeatureService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ProductFeatureControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @Mock
    private ProductFeatureService productFeatureService;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(
                new ProductFeatureController(productFeatureService)
        ).build();
    }

    @Test
    void createProductFeature_returnsDto() throws Exception {
        FeatureDto request = new FeatureDto(1L, UnitType.PIECE, 10, 2, "mavi", "10x10", "1kg", 5L);
        FeatureDto response = new FeatureDto(1L, UnitType.PIECE, 10, 2, "mavi", "10x10", "1kg", 5L);

        when(productFeatureService.createProductFeature(any())).thenReturn(response);

        mockMvc.perform(post("/v1/product-feature/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.unitType").value("PIECE"));
    }

    @Test
    void getAllProductFeatures_returnsList() throws Exception {
        FeatureDto response = new FeatureDto(1L, UnitType.BOX, 1, 1, "kirmizi", "10x10", "1kg", 5L);
        when(productFeatureService.getAllProductsFeatures()).thenReturn(List.of(response));

        mockMvc.perform(get("/v1/product-feature/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void getProductFeatureById_returnsDto() throws Exception {
        FeatureDto response = new FeatureDto(1L, UnitType.BOX, 1, 1, "kirmizi", "10x10", "1kg", 5L);
        when(productFeatureService.getFeatureDtoById(1L)).thenReturn(response);

        mockMvc.perform(get("/v1/product-feature/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void partialUpdateProductFeature_returnsDto() throws Exception {
        FeatureDto request = new FeatureDto(null, UnitType.LITER, 2, 3, null, null, null, null);
        FeatureDto response = new FeatureDto(1L, UnitType.LITER, 2, 3, null, null, null, 5L);

        when(productFeatureService.updateFeature(any(), eq(1L))).thenReturn(response);

        mockMvc.perform(patch("/v1/product-feature/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.unitType").value("LITER"));
    }
}
