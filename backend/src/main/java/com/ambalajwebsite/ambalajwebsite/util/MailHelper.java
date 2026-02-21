package com.ambalajwebsite.ambalajwebsite.util;

import org.springframework.util.StringUtils;
import org.springframework.web.util.HtmlUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public final class MailHelper {
    private static final DateTimeFormatter MAIL_DATE_FORMAT =
            DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");

    private MailHelper() {
    }

    public static List<String> normalizeRecipients(List<String> recipients) {
        if (recipients == null || recipients.isEmpty()) {
            return List.of();
        }

        return recipients.stream()
                .filter(StringUtils::hasText)
                .map(String::trim)
                .distinct()
                .toList();
    }

    public static String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }

    public static String normalizePhone(String phone) {
        return StringUtils.hasText(phone) ? phone.trim() : "-";
    }

    public static String resolveContactRecipient(String smtpUsername) {
        if (StringUtils.hasText(smtpUsername)) {
            return smtpUsername.trim();
        }
        throw new IllegalStateException("Contact mail alicisi tanimli degil. SPRING_MAIL_USERNAME ayarlanmali.");
    }

    public static String buildContactHtmlTemplate(String fullName, String email, String phone, String message) {
        String sentAt = MAIL_DATE_FORMAT.format(LocalDateTime.now());
        String escapedName = HtmlUtils.htmlEscape(fullName);
        String escapedEmail = HtmlUtils.htmlEscape(email);
        String escapedPhone = HtmlUtils.htmlEscape(phone);
        String escapedMessage = HtmlUtils.htmlEscape(message).replace("\n", "<br/>");

        return """
                <div style="font-family:Arial,sans-serif;line-height:1.5;color:#222;">
                  <h2 style="margin:0 0 12px;">Yeni Iletisim Formu Mesaji</h2>
                  <p style="margin:0 0 16px;">Web sitesindeki "Bize Ulasin" formundan yeni bir mesaj alindi.</p>
                  <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;border-color:#ddd;">
                    <tr><td><strong>Ad Soyad</strong></td><td>%s</td></tr>
                    <tr><td><strong>E-posta</strong></td><td>%s</td></tr>
                    <tr><td><strong>Telefon</strong></td><td>%s</td></tr>
                    <tr><td><strong>Gonderim Zamani</strong></td><td>%s</td></tr>
                    <tr><td><strong>Mesaj</strong></td><td>%s</td></tr>
                  </table>
                </div>
                """.formatted(escapedName, escapedEmail, escapedPhone, sentAt, escapedMessage);
    }

    public static String buildContactTextTemplate(String fullName, String email, String phone, String message) {
        String sentAt = MAIL_DATE_FORMAT.format(LocalDateTime.now());
        return """
                Yeni Iletisim Formu Mesaji
                
                Ad Soyad: %s
                E-posta: %s
                Telefon: %s
                Gonderim Zamani: %s
                
                Mesaj:
                %s
                """.formatted(fullName, email, phone, sentAt, message);
    }
}
