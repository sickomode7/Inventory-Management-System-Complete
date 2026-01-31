package com.inventory.system.controller;

import com.inventory.system.model.Product;
import com.inventory.system.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    ProductService productService;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('STAFF') or hasRole('ADMIN')")
    public Page<Product> getAllProducts(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String grade,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String[] sort) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(getSortOrders(sort)));

        Specification<Product> spec = (root, query, cb) -> cb.conjunction();
        if (brand != null)
            spec = spec.and((root, query, cb) -> cb.equal(root.get("brand"), brand));
        if (category != null)
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), category));
        if (grade != null)
            spec = spec.and((root, query, cb) -> cb.equal(root.get("grade"), grade));

        return productService.getAllProducts(spec, pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('STAFF') or hasRole('ADMIN')")
    public Product getProductById(@PathVariable("id") Long id) {
        return productService.getProductById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Product createProduct(@Valid @RequestBody Product product) {
        return productService.createProduct(product);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Product updateProduct(@PathVariable("id") Long id, @Valid @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProduct(@PathVariable("id") Long id) {
        productService.deleteProduct(id);
    }

    private Sort.Order[] getSortOrders(String[] sort) {
        // simple parsing: sort=field,desc or sort=field (default asc)
        if (sort.length < 2) {
            return new Sort.Order[] { new Sort.Order(Sort.Direction.ASC, sort[0]) };
        }
        return new Sort.Order[] { new Sort.Order(getSortDirection(sort[1]), sort[0]) };
    }

    private Sort.Direction getSortDirection(String direction) {
        if (direction.equals("desc")) {
            return Sort.Direction.DESC;
        }
        return Sort.Direction.ASC;
    }
}
