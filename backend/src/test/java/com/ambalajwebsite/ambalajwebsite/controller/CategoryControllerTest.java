package com.ambalajwebsite.ambalajwebsite.controller;

import com.ambalajwebsite.ambalajwebsite.dto.CategoryDto;
import com.ambalajwebsite.ambalajwebsite.dto.CreateCategoryDto;
import com.ambalajwebsite.ambalajwebsite.service.CategoryService;
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
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class CategoryControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @Mock
    private CategoryService categoryService;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(new CategoryController(categoryService)).build();
    }

    @Test
    void createCategory_returnsDto() throws Exception {
        CreateCategoryDto request = new CreateCategoryDto("Koli");
        CategoryDto response = new CategoryDto(1L, "Koli", "koli", List.of(),true);

        when(categoryService.createCategory(any())).thenReturn(response);

        mockMvc.perform(post("/v1/category/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.categoryName").value("Koli"))
                .andExpect(jsonPath("$.slug").value("koli"));
    }

    @Test
    void getAllCategories_returnsList() throws Exception {
        CategoryDto response = new CategoryDto(1L, "Koli", "koli", List.of(), true);
        when(categoryService.getAllCategory()).thenReturn(List.of(response));

        mockMvc.perform(get("/v1/category/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].slug").value("koli"));
    }

    @Test
    void getCategoryById_returnsDto() throws Exception {
        CategoryDto response = new CategoryDto(1L, "Koli", "koli", List.of(),true);
        when(categoryService.getCategoryDtoById(1L)).thenReturn(response);

        mockMvc.perform(get("/v1/category/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.categoryName").value("Koli"));
    }

    @Test
    void partialUpdateCategory_returnsDto() throws Exception {
        CategoryDto request = new CategoryDto(null, "Yeni", null, null,true);
        CategoryDto response = new CategoryDto(1L, "Yeni", "yeni", List.of(),true);

        when(categoryService.updateCategory(any(), org.mockito.ArgumentMatchers.eq(1L))).thenReturn(response);

        mockMvc.perform(patch("/v1/category/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.slug").value("yeni"));
    }
    @Test
    void deleteCategory_returnsNotFound() throws Exception {
        doNothing().when(categoryService).deleteCategoryById(1L);

        mockMvc.perform(delete("/v1/category/1"))
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));
    }
}
