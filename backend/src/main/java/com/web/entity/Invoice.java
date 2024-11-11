package com.web.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.web.enums.PayType;
import com.web.enums.StatusInvoice;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;

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

    @Enumerated(EnumType.STRING)
    private StatusInvoice statusInvoice;

    @Enumerated(EnumType.STRING)
    private PayType payType;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.REMOVE)
    @JsonManagedReference
    private List<InvoiceStatus> invoiceStatuses;
}
