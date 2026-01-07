package com.ambalajwebsite.ambalajwebsite.service;

import com.ambalajwebsite.ambalajwebsite.dto.CreateUserRequest;
import com.ambalajwebsite.ambalajwebsite.dto.UpdateUserRequest;
import com.ambalajwebsite.ambalajwebsite.dto.UserDto;
import com.ambalajwebsite.ambalajwebsite.dto.UserDtoConverter;
import com.ambalajwebsite.ambalajwebsite.exceptions.UserNotFoundException;
import com.ambalajwebsite.ambalajwebsite.model.Role;
import com.ambalajwebsite.ambalajwebsite.model.User;
import com.ambalajwebsite.ambalajwebsite.repository.UserRepository;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final UserDtoConverter userDtoConverter;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, UserDtoConverter userDtoConverter, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userDtoConverter = userDtoConverter;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        return user.orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public Optional<User> getByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(userDtoConverter::convert).collect(Collectors.toList());
    }

    public UserDto  getUserById(Long id) {
         User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User Not Found!"));
         return userDtoConverter.convert(user);
    }


    public @Nullable User updateUser(UpdateUserRequest updateUserRequest) {
        return null;
    }

    public void deactiveUser(long id) {
    }

    public void deleteUser(long id) {
    }

    public User createUser(CreateUserRequest request) {
        Set<Role> roles = userRepository.count() == 0
                ? Set.of(Role.ROLE_ADMIN)
                : Set.of(Role.ROLE_USER);

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


}
