package com.ambalajwebsite.ambalajwebsite.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record SendMailRequest(
        @NotEmpty(message = "En az bir alici gerekli.")
        List<@NotBlank(message = "Alici e-posta bos olamaz.")
        @Email(message = "Gecersiz alici e-posta adresi.") String> to,

        List<@NotBlank(message = "CC e-posta bos olamaz.")
        @Email(message = "Gecersiz CC e-posta adresi.") String> cc,

        List<@NotBlank(message = "BCC e-posta bos olamaz.")
        @Email(message = "Gecersiz BCC e-posta adresi.") String> bcc,

        @NotBlank(message = "Mail konusu bos olamaz.")
        String subject,

        String textBody,
        String htmlBody,

        @Email(message = "Gecersiz reply-to e-posta adresi.")
        String replyTo
) {
}
