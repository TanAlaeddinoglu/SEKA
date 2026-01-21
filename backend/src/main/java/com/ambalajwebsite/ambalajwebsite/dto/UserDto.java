package com.ambalajwebsite.ambalajwebsite.dto;

import java.util.Set;

import com.ambalajwebsite.ambalajwebsite.model.Role;
import lombok.Builder;

@Builder
public record UserDto (String name,
                       String surname,
                       String username,
                       String email,
                       boolean is_enabled,
                       Set<Role> authorities
                       
) {

}
