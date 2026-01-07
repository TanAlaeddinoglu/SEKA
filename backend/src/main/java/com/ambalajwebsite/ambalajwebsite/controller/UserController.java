package com.ambalajwebsite.ambalajwebsite.controller;

import com.ambalajwebsite.ambalajwebsite.dto.AuthRequest;
import com.ambalajwebsite.ambalajwebsite.dto.CreateUserRequest;
import com.ambalajwebsite.ambalajwebsite.dto.UserDto;
import com.ambalajwebsite.ambalajwebsite.dto.UserDtoConverter;
import com.ambalajwebsite.ambalajwebsite.service.JwtService;
import com.ambalajwebsite.ambalajwebsite.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")

public class UserController {

    private final UserService service;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    private final UserDtoConverter userDtoConverter;


    public UserController(UserService service, JwtService jwtService, AuthenticationManager authenticationManager, UserDtoConverter userDtoConverter) {
        this.service = service;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDtoConverter = userDtoConverter;
    }

    @GetMapping("/welcome")
    public String welcome() {
        return "Hello World! this is FOLSDEV";
    }

    @PostMapping("/addNewUser")
    public ResponseEntity<UserDto> addUser(@RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(userDtoConverter.convert(service.createUser(request)));
    }

    @PostMapping("/generateToken")
    public String generateToken(@RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username, request.password));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken((org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal());
        }
        throw new UsernameNotFoundException("invalid username {} " + request.username);
    }

    @GetMapping("/user")
    public String getUserString() {
        return "This is USER!";
    }

//    @GetMapping
//    public ResponseEntity<List<UserDto>> getAllUsers() {
//        return ResponseEntity.ok(service.getAllUsers());
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<UserDto> getUserById(@PathVariable("id")  Long id) {
//        return ResponseEntity.ok(service.getUserById(id));
//
//    }
//
//    @PostMapping
//    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest userRequest) {
//        return ResponseEntity.ok(service.createUser(userRequest));
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<User> updateUser(@RequestBody UpdateUserRequest updateUserRequest){
//        return ResponseEntity.ok(service.updateUser(updateUserRequest));
//    }
//
//    @PatchMapping("/{id}")
//    public ResponseEntity<User> deactivateUser(@PathVariable("id") long id) {
//        service.deactiveUser(id);
//                return ResponseEntity.ok().build();
//    }
//    @DeleteMapping("/{id}")
//    public ResponseEntity<User> deleteUser(@PathVariable("id") long id) {
//        service.deleteUser(id);
//        return ResponseEntity.ok().build();
//    }
}
