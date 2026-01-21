package com.ambalajwebsite.ambalajwebsite.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ambalajwebsite.ambalajwebsite.config.PasswordEncoderConfig;
import com.ambalajwebsite.ambalajwebsite.dto.CreateUserRequest;
import com.ambalajwebsite.ambalajwebsite.dto.UpdateUserRequest;
import com.ambalajwebsite.ambalajwebsite.dto.UserDto;
import com.ambalajwebsite.ambalajwebsite.dto.UserDtoConverter;
import com.ambalajwebsite.ambalajwebsite.exceptions.UserNotFoundException;
import com.ambalajwebsite.ambalajwebsite.model.Role;
import com.ambalajwebsite.ambalajwebsite.model.User;
import com.ambalajwebsite.ambalajwebsite.repository.UserRepository;

@Service
public class UserService implements UserDetailsService {
    private static final Pattern STRONG_PASSWORD = Pattern.compile("^(?=.*[A-Z])(?=.*\\d)(?=.*[./!]).{7,}$");

    private final UserRepository userRepository;
    private final UserDtoConverter userDtoConverter;
    private final PasswordEncoderConfig passwordEncoder;

    public UserService(UserRepository userRepository, UserDtoConverter userDtoConverter, PasswordEncoderConfig  passwordEncoder) {
        this.userRepository = userRepository;
        this.userDtoConverter = userDtoConverter;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public @NonNull UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        return user.orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public User createUser(CreateUserRequest request) {
        if(!userRepository.findByUsername(request.username()).isEmpty()) {
            throw new IllegalStateException("This username has taken!: " + request.username());
        }
        if (request.password() == null || request.password().isBlank()) {
            throw new IllegalStateException("Password must not be blank.");
        }
        validatePassword(request.password());
         Set<Role> roles = (request.authorities() != null && !request.authorities().isEmpty())
                ? request.authorities()
                : (userRepository.count() == 0
                        ? Set.of(Role.ROLE_ADMIN)
                        : Set.of(Role.ROLE_USER));

        User newUser =  User.builder()
                .name(request.name())
                .surname(request.surname())
                .email(request.email())
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .authorities(roles)
                .accountNonExpired(true)
                .credentialsNonExpired(true)
                .isEnabled(true)
                .accountNonLocked(true)
                .build();
        return userRepository.save(newUser);
    }

    public UserDto getUserByUsername(String username) {
        return userDtoConverter.convert(userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User not found: " + username)));
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(userDtoConverter::convert).collect(Collectors.toList());
    }


    public UserDto updateUser(String username, UpdateUserRequest updateUserRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        if (updateUserRequest.username() != null && !updateUserRequest.username().equals(user.getUsername())) {
            throw new IllegalArgumentException("Username cannot be changed in update request.");
        }

        setIfPresent(updateUserRequest.name(), user::setName);
        setIfPresent(updateUserRequest.surname(), user::setSurname);
        setIfPresent(updateUserRequest.email(), user::setEmail);
        setIfPresent(updateUserRequest.accountNonExpired(), user::setAccountNonExpired);
        setIfPresent(updateUserRequest.enabled(), user::setEnabled);
        setIfPresent(updateUserRequest.accountNonLocked(), user::setAccountNonLocked);
        setIfPresent(updateUserRequest.credentialsNonExpired(), user::setCredentialsNonExpired);

        if (updateUserRequest.password() != null && !updateUserRequest.password().isBlank()) {
            validatePassword(updateUserRequest.password());
            user.setPassword(passwordEncoder.encode(updateUserRequest.password()));
        }
        if (updateUserRequest.authorities() != null && !updateUserRequest.authorities().isEmpty()) {
            user.setAuthorities(updateUserRequest.authorities());
        }

        User savedUser = userRepository.save(user);
        return userDtoConverter.convert(savedUser);
    }


    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
        userRepository.delete(user);

    }

    private void validatePassword(String password) {
        if (!STRONG_PASSWORD.matcher(password).matches()) {
            throw new IllegalStateException("Password must be at least 7 characters and include 1 uppercase, 1 number, and one of (./!).");
        }
    }

    private <T> void setIfPresent(T value, java.util.function.Consumer<T> setter) {
        if (value != null) {
            setter.accept(value);
        }
    }

}
