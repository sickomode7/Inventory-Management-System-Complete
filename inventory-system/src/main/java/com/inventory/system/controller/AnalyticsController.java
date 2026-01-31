package com.inventory.system.controller;

import com.inventory.system.model.Inventory;
import com.inventory.system.model.Product;
import com.inventory.system.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    @Autowired
    InventoryRepository inventoryRepository;

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardMetrics() {
        List<Inventory> allInventory = inventoryRepository.findAll();

        long totalProducts = allInventory.size();

        List<Inventory> lowStock = allInventory.stream()
                .filter(i -> i.getQuantity() <= i.getReorderLevel())
                .collect(Collectors.toList());

        BigDecimal totalValue = allInventory.stream()
                .map(i -> i.getProduct().getUnitPrice().multiply(new BigDecimal(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalUniqueProducts", totalProducts);
        metrics.put("lowStockCount", lowStock.size());
        metrics.put("totalInventoryValue", totalValue);
        metrics.put("lowStockItems", lowStock.stream()
                .map(i -> Map.of("product", i.getProduct().getName(), "qty", i.getQuantity()))
                .collect(Collectors.toList()));

        return metrics;
    }
}
