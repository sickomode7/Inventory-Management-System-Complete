package com.inventory.system.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired(required = false)
    private JavaMailSender emailSender;

    @Override
    public void sendSimpleMessage(String to, String subject, String text) {
        if (emailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("noreply@inventory.com");
                message.setTo(to);
                message.setSubject(subject);
                message.setText(text);
                emailSender.send(message);
                logger.info("Email sent to {}", to);
            } catch (Exception e) {
                logger.error("Failed to send email: {}", e.getMessage());
            }
        } else {
            logger.info("Mock Email Sent to: {}, Subject: {}, Text: {}", to, subject, text);
        }
    }
}
