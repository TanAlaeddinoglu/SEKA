package com.ambalajwebsite.ambalajwebsite.service;

import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.key}")
    private String SECRET;

    // token validity in milliseconds (24 hours)
    private static final long TOKEN_VALIDITY_MS = 1000L * 60 * 60 * 6;

    public Boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUser(token);
        Date expirationDate = extractExpiration(token);
        return userDetails.getUsername().equals(username)
                && expirationDate.after(new Date());
    }

    private Date extractExpiration(String token) {
        Claims claims = Jwts
                .parser()
                .setSigningKey(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
            return claims.getExpiration();
    }

    public String extractUser(String token) {
        Claims claims = Jwts
                .parser()
                .setSigningKey(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();

    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", extractRoles(userDetails.getAuthorities()));
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String username) {
        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY_MS))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Collection<String> extractRoles(Collection<? extends org.springframework.security.core.GrantedAuthority> authorities) {
        return authorities.stream()
                .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
