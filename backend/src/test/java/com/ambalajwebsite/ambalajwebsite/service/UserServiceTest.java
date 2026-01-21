package com.ambalajwebsite.ambalajwebsite.service;

import com.ambalajwebsite.ambalajwebsite.dto.CreateUserRequest;
import com.ambalajwebsite.ambalajwebsite.dto.UserDto;
import com.ambalajwebsite.ambalajwebsite.dto.UserDtoConverter;
import com.ambalajwebsite.ambalajwebsite.model.Role;
import com.ambalajwebsite.ambalajwebsite.model.User;
import com.ambalajwebsite.ambalajwebsite.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserDtoConverter userDtoConverter;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void loadUserByUsername_throwsWhenMissing() {
        when(userRepository.findByUsername("missing")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.loadUserByUsername("missing"));
    }

    @Test
    void createUser_firstUserBecomesAdmin() {
        when(userRepository.count()).thenReturn(0L);
        when(passwordEncoder.encode("pass")).thenReturn("hash");

        CreateUserRequest request = new CreateUserRequest(
                "Ad",
                "Soyad",
                "kullanici",
                "test@example.com",
                "pass",
                Set.of(Role.ROLE_USER)
        );

        when(userRepository.save(org.mockito.ArgumentMatchers.any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.createUser(request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertEquals(Set.of(Role.ROLE_ADMIN), captor.getValue().getAuthorities());
        assertEquals("hash", result.getPassword());
    }

    @Test
    void createUser_nextUserBecomesUser() {
        when(userRepository.count()).thenReturn(1L);
        when(passwordEncoder.encode("pass")).thenReturn("hash");

        CreateUserRequest request = new CreateUserRequest(
                "Ad",
                "Soyad",
                "kullanici",
                "test@example.com",
                "pass",
                Set.of(Role.ROLE_ADMIN)
        );

        when(userRepository.save(org.mockito.ArgumentMatchers.any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.createUser(request);
        assertEquals(Set.of(Role.ROLE_USER), result.getAuthorities());
    }

//    @Test
//    void getAllUsers_returnsDtos() {
//        User user = User.builder().username("u").build();
//        when(userRepository.findAll()).thenReturn(List.of(user));
//        when(userDtoConverter.convert(user)).thenReturn(new UserDto("Ad", "Soyad", "u", "e",true));
//
//        List<UserDto> result = userService.getAllUsers();
//        assertEquals(1, result.size());
//    }
}
