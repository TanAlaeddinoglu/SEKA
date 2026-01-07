package com.ambalajwebsite.ambalajwebsite.dto;

import com.ambalajwebsite.ambalajwebsite.model.Role;
import lombok.Builder;

import java.util.Set;

@Builder
public record CreateUserRequest ( String name,
                                  String surname,
                                  String username,
                                  String email,
                                  String password,
                                  Set<Role> authorities
) {

}
