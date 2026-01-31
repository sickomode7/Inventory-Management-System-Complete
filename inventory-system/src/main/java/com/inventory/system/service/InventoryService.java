package com.inventory.system.service;

import com.inventory.system.model.Inventory;

import java.util.List;

public interface InventoryService {
    Inventory getInventoryByProductId(Long productId);

    Inventory updateStock(Long productId, Integer quantityChange); // quantityChange can be positive or negative

    Inventory setReorderLevel(Long productId, Integer level);

    List<Inventory> getAllInventory();
}
