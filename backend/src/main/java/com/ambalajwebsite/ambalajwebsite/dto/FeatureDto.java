package com.ambalajwebsite.ambalajwebsite.dto;

import com.ambalajwebsite.ambalajwebsite.model.UnitType;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FeatureDto {
    private Long id;
    private UnitType unitType;
    private Integer unitPerPack;
    private Integer unitPerCarton;
    private String color;
    private String size;
    private String weight;

    // TODO ileride sil CreateFeatureDto ya tasi
    private Long productId;
}
