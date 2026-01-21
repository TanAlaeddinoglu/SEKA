package com.ambalajwebsite.ambalajwebsite.dto;

import com.ambalajwebsite.ambalajwebsite.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserDtoConverter {
    public UserDto convert(User from) {
        return new UserDto(
                from.getName(),
                from.getSurname(),
                from.getUsername(),
                from.getEmail(),
                from.isEnabled(),
                from.getAuthorities()
        );
    }
}
