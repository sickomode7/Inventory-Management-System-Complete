package com.inventory.system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.math.BigDecimal;
import java.util.Map;

@Service
public class CurrencyService {

    @Autowired
    private RestTemplate restTemplate;

    private static final String API_URL = "https://open.er-api.com/v6/latest/USD";

    public Map<String, Object> getExchangeRates() {
        return restTemplate.getForObject(API_URL, Map.class);
    }

    public BigDecimal convertPrice(BigDecimal priceInUsd, String targetCurrency) {
        Map<String, Object> response = getExchangeRates();
        if (response != null && response.containsKey("rates")) {
            Map<String, Number> rates = (Map<String, Number>) response.get("rates");
            if (rates.containsKey(targetCurrency)) {
                BigDecimal rate = BigDecimal.valueOf(rates.get(targetCurrency).doubleValue());
                return priceInUsd.multiply(rate);
            }
        }
        throw new RuntimeException("Currency not found or API error");
    }
}
