package com.inventory.system.service;

import com.inventory.system.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface ProductService {
    Product createProduct(Product product);

    Product updateProduct(Long id, Product product);

    void deleteProduct(Long id);

    Product getProductById(Long id);

    Page<Product> getAllProducts(Specification<Product> spec, Pageable pageable);
}
