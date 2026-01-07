package com.ambalajwebsite.ambalajwebsite.model;

import org.springframework.security.core.GrantedAuthority;


public enum Role  implements GrantedAuthority {
    ROLE_USER("USER"),
    ROLE_ADMIN("ADMIN"),
    ROLE_MODERATOR("MODERATOR");

    private final String value;
    Role(String value) {
        this.value = value;
    }

    @Override
    public String getAuthority() {
        return name();
    }

}
