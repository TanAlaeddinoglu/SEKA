package com.ambalajwebsite.ambalajwebsite.dto;

import java.util.Set;

import com.ambalajwebsite.ambalajwebsite.model.Role;
import com.fasterxml.jackson.annotation.JsonAlias;

public record UpdateUserRequest(
        String name,
        @JsonAlias("lastname") String surname,
        String username,
        String email,
        String password,
        Set<Role> authorities,
        Boolean accountNonExpired,
        @JsonAlias("isEnabled") Boolean enabled,
        Boolean accountNonLocked,
        Boolean credentialsNonExpired
) {
}
