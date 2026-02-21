package com.ambalajwebsite.ambalajwebsite.service;

import com.ambalajwebsite.ambalajwebsite.dto.ContactMailRequest;
import com.ambalajwebsite.ambalajwebsite.dto.SendMailRequest;
import com.ambalajwebsite.ambalajwebsite.exceptions.MailDeliveryException;
import com.ambalajwebsite.ambalajwebsite.util.MailHelper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class MailService {
    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final String contactSubjectPrefix;
    private final String smtpUsername;

    public MailService(
            JavaMailSender mailSender,
            @Value("${app.mail.from}") String fromAddress,
            @Value("${app.mail.contact.subject-prefix:[Website Iletisim]}") String contactSubjectPrefix,
            @Value("${spring.mail.username:}") String smtpUsername
    ) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.contactSubjectPrefix = contactSubjectPrefix;
        this.smtpUsername = smtpUsername;
    }

    public void sendContactFormMail(ContactMailRequest request) {
        String safeFullName = MailHelper.safeTrim(request.fullName());
        String safeEmail = MailHelper.safeTrim(request.email());
        String safePhone = MailHelper.normalizePhone(request.phone());
        String safeMessage = MailHelper.safeTrim(request.message());
        String contactRecipient = MailHelper.resolveContactRecipient(smtpUsername);

        String subject = contactSubjectPrefix + " " + safeFullName;
        SendMailRequest mailRequest = new SendMailRequest(
                List.of(contactRecipient),
                List.of(),
                List.of(),
                subject,
                MailHelper.buildContactTextTemplate(safeFullName, safeEmail, safePhone, safeMessage),
                MailHelper.buildContactHtmlTemplate(safeFullName, safeEmail, safePhone, safeMessage),
                safeEmail
        );
        sendMail(mailRequest);
    }

    public void sendMail(SendMailRequest request) {
        List<String> toList = MailHelper.normalizeRecipients(request.to());
        if (toList.isEmpty()) {
            throw new IllegalArgumentException("En az bir alici e-posta adresi gerekli.");
        }

        String textBody = MailHelper.safeTrim(request.textBody());
        String htmlBody = MailHelper.safeTrim(request.htmlBody());
        String subject = MailHelper.safeTrim(request.subject());
        if (!StringUtils.hasText(subject)) {
            throw new IllegalArgumentException("Mail konusu bos olamaz.");
        }
        if (!StringUtils.hasText(textBody) && !StringUtils.hasText(htmlBody)) {
            throw new IllegalArgumentException("Mail icerigi bos olamaz.");
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    true,
                    StandardCharsets.UTF_8.name()
            );

            helper.setFrom(fromAddress);
            helper.setTo(toList.toArray(String[]::new));

            List<String> ccList = MailHelper.normalizeRecipients(request.cc());
            if (!ccList.isEmpty()) {
                helper.setCc(ccList.toArray(String[]::new));
            }

            List<String> bccList = MailHelper.normalizeRecipients(request.bcc());
            if (!bccList.isEmpty()) {
                helper.setBcc(bccList.toArray(String[]::new));
            }

            if (StringUtils.hasText(request.replyTo())) {
                helper.setReplyTo(request.replyTo().trim());
            }

            helper.setSubject(subject);
            if (StringUtils.hasText(htmlBody)) {
                helper.setText(StringUtils.hasText(textBody) ? textBody : "HTML destekli e-posta.", htmlBody);
            } else {
                helper.setText(textBody, false);
            }

            mailSender.send(mimeMessage);
        } catch (MessagingException | MailException ex) {
            throw new MailDeliveryException("E-posta gonderimi basarisiz oldu.", ex);
        }
    }

}
