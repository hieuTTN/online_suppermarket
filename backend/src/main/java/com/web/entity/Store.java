package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "stores")
@Getter
@Setter
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String street;

    private String city;

    private String state;

    private String country;

    private Float latitude;

    private Float longitude;
}
