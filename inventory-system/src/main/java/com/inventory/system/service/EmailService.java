package com.inventory.system.service;

public interface EmailService {
    void sendSimpleMessage(String to, String subject, String text);
}
