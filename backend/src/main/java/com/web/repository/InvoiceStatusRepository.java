package com.web.repository;

import com.web.entity.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceStatusRepository extends JpaRepository<InvoiceStatus, Long> {
}
