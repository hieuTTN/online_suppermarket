package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

@Entity
@Table(name = "invoice")
@Getter
@Setter
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Date createdDate;

    private Time createdTime;

    private Double totalAmount;

    private String receiverName;

    private String phone;

    private String address;

    private String note;

    @ManyToOne
    private User user;
}
