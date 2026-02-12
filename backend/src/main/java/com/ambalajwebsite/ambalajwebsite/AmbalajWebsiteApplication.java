package com.ambalajwebsite.ambalajwebsite;

import java.util.HashSet;
import java.util.Optional;
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
import com.ambalajwebsite.ambalajwebsite.repository.UserRepository;

import jakarta.transaction.Transactional;

@SpringBootApplication
public class AmbalajWebsiteApplication implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AmbalajWebsiteApplication.class);

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

    @Value("${app.bootstrap-admin.reset-password-on-startup:false}")
    private boolean bootstrapAdminResetPasswordOnStartup;

    public AmbalajWebsiteApplication(UserRepository userRepository, PasswordEncoderConfig passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    
    public static void main(String[] args) {
        SpringApplication.run(AmbalajWebsiteApplication.class, args);
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (!bootstrapAdminEnabled) {
            return;
        }

        boolean adminExists = userRepository.findAll().stream()
                .anyMatch(user -> user.getAuthorities() != null && user.getAuthorities().contains(Role.ROLE_ADMIN));

        Optional<User> existingBootstrapUser = userRepository.findByUsername(bootstrapAdminUsername);

        if (adminExists && !(bootstrapAdminResetPasswordOnStartup && existingBootstrapUser.isPresent())) {
            return;
        }

        if (existingBootstrapUser.isPresent()) {
            User user = existingBootstrapUser.get();
            Set<Role> updatedAuthorities = user.getAuthorities() == null
                    ? new HashSet<>()
                    : new HashSet<>(user.getAuthorities());

            updatedAuthorities.add(Role.ROLE_ADMIN);
            user.setAuthorities(updatedAuthorities);
            user.setAccountNonExpired(true);
            user.setAccountNonLocked(true);
            user.setCredentialsNonExpired(true);
            user.setEnabled(true);
            if (bootstrapAdminResetPasswordOnStartup) {
                user.setPassword(passwordEncoder.encode(bootstrapAdminPassword));
            }

            userRepository.save(user);
            if (bootstrapAdminResetPasswordOnStartup) {
                logger.warn("Ensured admin user '{}' and reset its password from bootstrap config.", bootstrapAdminUsername);
            } else {
                logger.warn("Promoted existing user '{}' to admin because no admin existed.", bootstrapAdminUsername);
            }
            return;
        }

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
        logger.warn("Bootstrapped admin user '{}'. Change the password after first login.", bootstrapAdminUsername);
    }
}
