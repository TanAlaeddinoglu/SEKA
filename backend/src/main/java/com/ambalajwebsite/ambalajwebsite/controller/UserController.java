package com.ambalajwebsite.ambalajwebsite.controller;

import java.util.List;

import com.ambalajwebsite.ambalajwebsite.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import com.ambalajwebsite.ambalajwebsite.service.JwtService;
import com.ambalajwebsite.ambalajwebsite.service.UserService;

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

    @PostMapping("/addNewUser")
    public ResponseEntity<UserDto> addUser(@RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(userDtoConverter.convert(service.createUser(request)));
    }

    @PostMapping("/generateToken")
    public String generateToken(@RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username, request.password));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken((UserDetails) authentication.getPrincipal());
        }
        throw new UsernameNotFoundException("invalid username {} " + request.username);
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(service.getAllUsers());
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(service.getUserByUsername(username));

    }

    @PatchMapping("/{username}")
    public ResponseEntity<UserDto> updateUser(@RequestBody UpdateUserRequest updateUserRequest, @PathVariable String username){
        return ResponseEntity.ok(service.updateUser(username, updateUserRequest));
    }

   @DeleteMapping("/{username}")
   public ResponseEntity deleteUser(@PathVariable String username) {
       service.deleteUser(username);
       return ResponseEntity.ok().build();
   }
}
