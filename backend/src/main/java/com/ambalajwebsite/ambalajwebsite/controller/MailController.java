package com.ambalajwebsite.ambalajwebsite.controller;

import com.ambalajwebsite.ambalajwebsite.dto.ContactMailRequest;
import com.ambalajwebsite.ambalajwebsite.service.ContactMailRateLimiter;
import com.ambalajwebsite.ambalajwebsite.service.MailService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/v1/mail")
public class MailController {

    private final MailService mailService;
    private final ContactMailRateLimiter contactMailRateLimiter;

    public MailController(MailService mailService, ContactMailRateLimiter contactMailRateLimiter) {
        this.mailService = mailService;
        this.contactMailRateLimiter = contactMailRateLimiter;
    }

    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> sendContactMail(
            @Valid @RequestBody ContactMailRequest request,
            HttpServletRequest httpServletRequest
    ) {
        contactMailRateLimiter.validate(extractClientIp(httpServletRequest));
        mailService.sendContactFormMail(request);
        return ResponseEntity.ok(Map.of("message", "Mesaj basariyla gonderildi."));
    }

    private String extractClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(xForwardedFor)) {
            String[] parts = xForwardedFor.split(",");
            if (parts.length > 0 && StringUtils.hasText(parts[0])) {
                return parts[0].trim();
            }
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (StringUtils.hasText(xRealIp)) {
            return xRealIp.trim();
        }
        return request.getRemoteAddr();
    }
}
