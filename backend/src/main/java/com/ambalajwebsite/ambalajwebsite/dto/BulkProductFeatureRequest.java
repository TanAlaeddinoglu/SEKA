package com.ambalajwebsite.ambalajwebsite.dto;

import com.ambalajwebsite.ambalajwebsite.model.UnitType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

@Getter
@Setter
public class BulkProductFeatureRequest {
    private UnitType unitType;
    private Integer unitPerPack;
    private Integer unitPerCarton;
    private String color;
    private String size;
    private String weight;

    public boolean hasAnyValue() {
        return unitType != null
                || unitPerPack != null
                || unitPerCarton != null
                || StringUtils.hasText(color)
                || StringUtils.hasText(size)
                || StringUtils.hasText(weight);
    }
}
