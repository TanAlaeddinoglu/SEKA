package com.ambalajwebsite.ambalajwebsite.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ContactMailRequest(
        @NotBlank(message = "Ad soyad bos olamaz.")
        @Size(min = 2, max = 60, message = "Ad soyad 2 ile 60 karakter arasinda olmali.")
        String fullName,

        @NotBlank(message = "E-posta bos olamaz.")
        @Email(message = "Gecersiz e-posta adresi.")
        @Size(max = 80, message = "E-posta en fazla 80 karakter olabilir.")
        String email,

        @Size(max = 14, message = "Telefon en fazla 14 karakter olabilir.")
        @Pattern(regexp = "^[0-9+()\\-\\s]*$", message = "Telefon formati gecersiz.")
        String phone,

        @NotBlank(message = "Mesaj bos olamaz.")
        @Size(min = 10, max = 3000, message = "Mesaj 10 ile 3000 karakter arasinda olmali.")
        String message
) {
}
