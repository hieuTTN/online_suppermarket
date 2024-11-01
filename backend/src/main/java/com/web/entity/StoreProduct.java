package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "store_product")
@Getter
@Setter
public class StoreProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Float quantity;

    @ManyToOne
    private Product product;

    @ManyToOne
    private Store store;
}
