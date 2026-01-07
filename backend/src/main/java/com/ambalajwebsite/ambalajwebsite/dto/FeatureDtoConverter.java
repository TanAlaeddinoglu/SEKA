package com.ambalajwebsite.ambalajwebsite.dto;

import com.ambalajwebsite.ambalajwebsite.model.ProductFeature;
import org.springframework.stereotype.Component;

@Component
public class FeatureDtoConverter {

    public FeatureDto convert(ProductFeature feature) {
        if (feature == null) {
            return null;
        }

        FeatureDto dto = new FeatureDto();
        dto.setId(feature.getId());
        dto.setUnitType(feature.getUnit());
        dto.setUnitPerPack(feature.getUnitPerPack());
        dto.setUnitPerCarton(feature.getPackPerCarton());
        dto.setSize(feature.getSize());
        dto.setColor(feature.getColor());
        dto.setSize(feature.getSize());
        dto.setWeight(feature.getWeight());

        return dto;
    }
}
