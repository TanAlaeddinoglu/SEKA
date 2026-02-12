package com.ambalajwebsite.ambalajwebsite.dto;

import com.ambalajwebsite.ambalajwebsite.model.UnitType;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateFeatureRequest {
    @NotNull(message = "productId is required")
    private Long productId;

    @NotNull(message = "unitType is required")
    private UnitType unitType;

    @NotNull(message = "unitPerPack is required")
    private Integer unitPerPack;

    private Integer unitPerCarton;

    private String color;
    private String size;
    private String weight;
}
