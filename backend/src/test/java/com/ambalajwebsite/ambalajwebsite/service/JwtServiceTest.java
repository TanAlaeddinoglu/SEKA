package com.ambalajwebsite.ambalajwebsite.service;

import com.ambalajwebsite.ambalajwebsite.model.Role;
import com.ambalajwebsite.ambalajwebsite.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Base64;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

//    @Test
//    void generateAndValidateToken_success() {
//        JwtService jwtService = new JwtService();
//        byte[] key = new byte[32];
//        for (int i = 0; i < key.length; i++) {
//            key[i] = (byte) i;
//        }
//        String secret = Base64.getEncoder().encodeToString(key);
//        ReflectionTestUtils.setField(jwtService, "SECRET", secret);
//
//        String token = jwtService.generateToken("user1");
//
//        User user = User.builder()
//                .username("user1")
//                .password("pass")
//                .authorities(Set.of(Role.ROLE_USER))
//                .accountNonExpired(true)
//                .credentialsNonExpired(true)
//                .isEnabled(true)
//                .accountNonLocked(true)
//                .build();
//
//        assertEquals("user1", jwtService.extractUser(token));
//        assertTrue(jwtService.validateToken(token, user));
//    }
}
