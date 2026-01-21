package com.ambalajwebsite.ambalajwebsite.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateCategoryDto {
    private String categoryName;
    private Boolean isActive;
}
