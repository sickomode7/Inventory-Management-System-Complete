package com.inventory.system.service;

import com.inventory.system.exception.ResourceNotFoundException;
import com.inventory.system.model.Inventory;
import com.inventory.system.model.Product;
import com.inventory.system.repository.InventoryRepository;
import com.inventory.system.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    InventoryRepository inventoryRepository;

    @Autowired
    ProductRepository productRepository;

    @Override
    public Inventory getInventoryByProductId(Long productId) {
        return inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product id: " + productId));
    }

    @Override
    @Transactional
    public Inventory updateStock(Long productId, Integer quantityChange) {
        // Find existing inventory or create one if not exists (but generally should
        // exist)
        // I'll assume it might not exist and create it if product exists.

        Inventory inventory = inventoryRepository.findByProductId(productId).orElse(null);

        if (inventory == null) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
            inventory = Inventory.builder()
                    .product(product)
                    .quantity(0)
                    .warehouseLocation("Default Warehouse")
                    .reorderLevel(10)
                    .build();
        }

        int newQuantity = inventory.getQuantity() + quantityChange;
        if (newQuantity < 0) {
            throw new IllegalArgumentException("Insufficient stock! Current: " + inventory.getQuantity());
        }
        inventory.setQuantity(newQuantity);

        // Simple analytics or check reorder level could be here (send email if low)

        return inventoryRepository.save(inventory);
    }

    @Override
    public Inventory setReorderLevel(Long productId, Integer level) {
        Inventory inventory = getInventoryByProductId(productId);
        inventory.setReorderLevel(level);
        return inventoryRepository.save(inventory);
    }

    @Override
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }
}
