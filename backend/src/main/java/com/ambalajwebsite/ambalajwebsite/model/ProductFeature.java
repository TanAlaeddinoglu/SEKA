package com.ambalajwebsite.ambalajwebsite.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_feature")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductFeature {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Enumerated(EnumType.STRING)
    private UnitType unit;


    @Column(name = "unit_per_pack", nullable = false)
    private Integer unitPerPack;

    @Column(name = "pack_per_carton", nullable = false)
    private Integer packPerCarton;

    private String color;
    private String size;
    private String weight;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product  product;
}
