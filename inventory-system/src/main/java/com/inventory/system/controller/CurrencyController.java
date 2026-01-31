package com.inventory.system.controller;

import com.inventory.system.service.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/currency")
public class CurrencyController {

    @Autowired
    CurrencyService currencyService;

    @GetMapping("/convert")
    @PreAuthorize("hasRole('USER') or hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<?> convertCurrency(
            @RequestParam BigDecimal amount,
            @RequestParam String to) {

        try {
            BigDecimal convertedAmount = currencyService.convertPrice(amount, to.toUpperCase());
            Map<String, Object> response = new HashMap<>();
            response.put("originalAmount", amount);
            response.put("targetCurrency", to.toUpperCase());
            response.put("convertedAmount", convertedAmount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error converting currency: " + e.getMessage());
        }
    }
}
