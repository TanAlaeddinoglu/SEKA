package com.ambalajwebsite.ambalajwebsite.controller;

import com.ambalajwebsite.ambalajwebsite.dto.AuthRequest;
import com.ambalajwebsite.ambalajwebsite.dto.CreateUserRequest;
import com.ambalajwebsite.ambalajwebsite.dto.UserDto;
import com.ambalajwebsite.ambalajwebsite.dto.UserDtoConverter;
import com.ambalajwebsite.ambalajwebsite.model.Role;
import com.ambalajwebsite.ambalajwebsite.model.User;
import com.ambalajwebsite.ambalajwebsite.service.JwtService;
import com.ambalajwebsite.ambalajwebsite.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @Mock
    private UserService userService;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDtoConverter userDtoConverter;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(
                new UserController(userService, jwtService, authenticationManager, userDtoConverter)
        ).build();
    }

    @Test
    void welcome_returnsString() throws Exception {
        mockMvc.perform(get("/v1/auth/welcome"))
                .andExpect(status().isOk())
                .andExpect(content().string("Hello World! this is FOLSDEV"));
    }

    @Test
    void addUser_returnsUserDto() throws Exception {
        CreateUserRequest request = new CreateUserRequest(
                "Ad",
                "Soyad",
                "kullanici",
                "test@example.com",
                "pass",
                Set.of(Role.ROLE_USER)
        );

        User user = User.builder()
                .name("Ad")
                .surname("Soyad")
                .username("kullanici")
                .email("test@example.com")
                .authorities(Set.of(Role.ROLE_USER))
                .build();

        UserDto dto = new UserDto("Ad", "Soyad", "kullanici", "test@example.com");

        when(userService.createUser(any())).thenReturn(user);
        when(userDtoConverter.convert(user)).thenReturn(dto);

        mockMvc.perform(post("/v1/auth/addNewUser")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("kullanici"));
    }

//    @Test
//    void generateToken_returnsToken() throws Exception {
//        AuthRequest request = new AuthRequest();
//        request.username = "kullanici";
//        request.password = "pass";
//
//        Authentication authentication = mock(Authentication.class);
//        when(authentication.isAuthenticated()).thenReturn(true);
//        when(authenticationManager.authenticate(org.mockito.ArgumentMatchers.any())).thenReturn(authentication);
//        when(jwtService.generateToken("kullanici")).thenReturn("token");
//
//        mockMvc.perform(post("/v1/auth/generateToken")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(content().string("token"));
//    }

    @Test
    void userEndpoint_returnsString() throws Exception {
        mockMvc.perform(get("/v1/auth/user"))
                .andExpect(status().isOk())
                .andExpect(content().string("This is USER!"));
    }
}
