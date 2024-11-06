package com.web.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.web.enums.StatusInvoice;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoice_status")
@Getter
@Setter
public class InvoiceStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private LocalDateTime createdDate;

    @Enumerated(EnumType.STRING)
    private StatusInvoice statusInvoice;

    @ManyToOne
    @JsonBackReference
    private Invoice invoice;

    @ManyToOne
    private User createdBy;
}
