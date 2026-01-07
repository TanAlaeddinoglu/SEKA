package com.ambalajwebsite.ambalajwebsite.dto;

public record UpdateUserRequest(
        String name,
        String lastname,
        String username
) {
}
