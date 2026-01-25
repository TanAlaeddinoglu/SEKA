package com.ambalajwebsite.ambalajwebsite;

import com.ambalajwebsite.ambalajwebsite.model.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.ambalajwebsite.ambalajwebsite.config.PasswordEncoderConfig;
import com.ambalajwebsite.ambalajwebsite.repository.CategoryRepository;
import com.ambalajwebsite.ambalajwebsite.repository.ProductFeatureRepository;
import com.ambalajwebsite.ambalajwebsite.repository.ProductRepository;
import com.ambalajwebsite.ambalajwebsite.repository.UserRepository;

import jakarta.transaction.Transactional;

@SpringBootApplication
public class AmbalajWebsiteApplication implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductFeatureRepository productFeatureRepository;
    private final UserRepository userRepository;
    private final PasswordEncoderConfig passwordEncoder;

    public AmbalajWebsiteApplication(CategoryRepository categoryRepository, ProductRepository productRepository, ProductFeatureRepository productFeatureRepository, UserRepository userRepository, PasswordEncoderConfig passwordEncoder) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.productFeatureRepository = productFeatureRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    
    public static void main(String[] args) {
        SpringApplication.run(AmbalajWebsiteApplication.class, args);
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
//         User user = User.builder()
//                 .name("Admin")
//                 .surname("Admin")
//                 .username("admin")
//                 .password(passwordEncoder.encode("123456"))
//                 .email("admin@example.com")
//                 .accountNonExpired(true)
//                 .isEnabled(true)
//                 .accountNonLocked(true)
//                 .credentialsNonExpired(true)
//                 .authorities(Set.of(ROLE_ADMIN))
//                 .build();
//         User savedUser = userRepository.save(user);

//        Category category = Category.builder()
//                .categoryName("Kategori-2")
//                .slug("Kategori-2")
//                .build();
//
//        Category c1 = categoryRepository.save(category);
//
//        List<Product> productList = new ArrayList<>();
//        productList.add(Product.builder()
//                        .productName("Urun-1")
//                        .category(c1)
//                        .brand("tan").slug("urun-1")
//                        .build());
//        productList.add(Product.builder()
//                .productName("Urun-2")
//                .category(c1)
//                .brand("tan").slug("urun-2")
//                .build());
//
//        List<Product> a = productRepository.saveAll(productList);
//
//        List<Category> categories = categoryRepository.findAll();
//        List<Product> products = productRepository.findAll();
//
//        System.out.println(categories);
//        System.out.println(products);
//
//        Category category = Category.builder()
//                .categoryName("Kategori-4")
//                .slug("Kategori-4")
//                .build();
//
//        Category c2 = categoryRepository.save(category);
//
//        Product p1 = Product.builder()
//                        .productName("Urun-4")
//                        .brand("tan").slug("urun-4")
//                        .category(c2)
//                        .build();
//        Product p = productRepository.save(p1);
//
//
//        ProductFeature feature = ProductFeature.builder()
//                .unit(UnitType.PIECE)
//                .packPerCarton(5)
//                .unitPerPack(4)
//                .color("mavi")
//                .size("25cm x 14cm")
//                .weight("25kg")
//                .product(p1)
//                .build();
//
//        ProductFeature f1 = productFeatureRepository.save(feature);
    }
}
