package com.ambalajwebsite.ambalajwebsite.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateProductRequest {
        private String name;
        private String brand;
        private Long categoryId;
        private String description;

}
