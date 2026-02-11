package com.ambalajwebsite.ambalajwebsite;

import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.ambalajwebsite.ambalajwebsite.config.PasswordEncoderConfig;
import com.ambalajwebsite.ambalajwebsite.model.Role;
import com.ambalajwebsite.ambalajwebsite.model.User;
import com.ambalajwebsite.ambalajwebsite.repository.CategoryRepository;
import com.ambalajwebsite.ambalajwebsite.repository.ProductFeatureRepository;
import com.ambalajwebsite.ambalajwebsite.repository.ProductRepository;
import com.ambalajwebsite.ambalajwebsite.repository.UserRepository;

import jakarta.transaction.Transactional;

@SpringBootApplication
public class AmbalajWebsiteApplication implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AmbalajWebsiteApplication.class);

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductFeatureRepository productFeatureRepository;
    private final UserRepository userRepository;
    private final PasswordEncoderConfig passwordEncoder;

    @Value("${app.bootstrap-admin.enabled:true}")
    private boolean bootstrapAdminEnabled;

    @Value("${app.bootstrap-admin.username:admin}")
    private String bootstrapAdminUsername;

    @Value("${app.bootstrap-admin.password:Admin123!}")
    private String bootstrapAdminPassword;

    @Value("${app.bootstrap-admin.email:admin@example.com}")
    private String bootstrapAdminEmail;

    @Value("${app.bootstrap-admin.name:Admin}")
    private String bootstrapAdminName;

    @Value("${app.bootstrap-admin.surname:Admin}")
    private String bootstrapAdminSurname;

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
        if (bootstrapAdminEnabled && userRepository.count() == 0) {
            User user = User.builder()
                    .name(bootstrapAdminName)
                    .surname(bootstrapAdminSurname)
                    .username(bootstrapAdminUsername)
                    .password(passwordEncoder.encode(bootstrapAdminPassword))
                    .email(bootstrapAdminEmail)
                    .accountNonExpired(true)
                    .isEnabled(true)
                    .accountNonLocked(true)
                    .credentialsNonExpired(true)
                    .authorities(Set.of(Role.ROLE_ADMIN))
                    .build();
            userRepository.save(user);
            logger.warn("Bootstrapped initial admin user '{}'. Change the password after first login.", bootstrapAdminUsername);
        }
    }
}
