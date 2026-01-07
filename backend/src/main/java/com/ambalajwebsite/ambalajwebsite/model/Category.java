package com.ambalajwebsite.ambalajwebsite.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Setter
@Getter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Category extends BaseEntity {

    @Column(nullable = false, name = "category_name")
    private String categoryName;

    @Column(nullable = false, unique = true)
    private String slug;

    @OneToMany(mappedBy = "category" , cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Product> products = new ArrayList<>();
}
