package com.inventory.system.controller;

import com.inventory.system.model.Inventory;
import com.inventory.system.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    @Autowired
    InventoryService inventoryService;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('STAFF') or hasRole('ADMIN')")
    public List<Inventory> getAllInventory() {
        return inventoryService.getAllInventory();
    }

    @GetMapping("/product/{productId}")
    @PreAuthorize("hasRole('USER') or hasRole('STAFF') or hasRole('ADMIN')")
    public Inventory getInventoryByProductId(@PathVariable Long productId) {
        return inventoryService.getInventoryByProductId(productId);
    }

    @PostMapping("/update/{productId}")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<Inventory> updateStock(@PathVariable Long productId, @RequestParam Integer change) {
        return ResponseEntity.ok(inventoryService.updateStock(productId, change));
    }
}
