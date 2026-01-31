package com.inventory.system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Brand is required")
    private String brand; // e.g., Tata, JSW, Ultratech

    @NotBlank(message = "Category is required")
    private String category; // Steel or Cement

    private String grade; // e.g., Fe500D, OPC53

    @NotNull(message = "Unit price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal unitPrice;

    private String unit; // e.g., kg, bag, ton

    private Double weightPerUnit; // e.g. 50kg per bag
}
