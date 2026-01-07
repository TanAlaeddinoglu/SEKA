package com.ambalajwebsite.ambalajwebsite.dto;

import lombok.Builder;

@Builder
public record UserDto (String name,
                       String surname,
                       String username,
                       String email
) {

}
