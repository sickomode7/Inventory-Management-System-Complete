package com.inventory.system.service;

import com.inventory.system.exception.ResourceNotFoundException;
import com.inventory.system.model.Product;
import com.inventory.system.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    ProductRepository productRepository;

    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product productRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setName(productRequest.getName());
        product.setBrand(productRequest.getBrand());
        product.setCategory(productRequest.getCategory());
        product.setGrade(productRequest.getGrade());
        product.setUnitPrice(productRequest.getUnitPrice());
        product.setUnit(productRequest.getUnit());
        product.setWeightPerUnit(productRequest.getWeightPerUnit());

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    public Page<Product> getAllProducts(Specification<Product> spec, Pageable pageable) {
        return productRepository.findAll(spec, pageable);
    }
}
