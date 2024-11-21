package com.web.api;
import com.web.dto.InvoiceRequest;
import com.web.entity.Category;
import com.web.entity.Invoice;
import com.web.enums.StatusInvoice;
import com.web.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.sql.Date;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/invoice")
@CrossOrigin
public class InvoiceApi {

    @Autowired
    private InvoiceService invoiceService;

    @PostMapping("/user/create")
    public ResponseEntity<?> save(@RequestBody InvoiceRequest invoiceRequest) throws Exception {
        invoiceService.create(invoiceRequest);
        return new ResponseEntity<>("success", HttpStatus.CREATED);
    }

    @GetMapping("/user/find-by-user")
    public ResponseEntity<?> findByUser(){
        List<Invoice> result = invoiceService.myInvoice();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @PostMapping("/user/cancel-invoice")
    public ResponseEntity<?> cancelInvoice(@RequestParam("idInvoice") Long idInvoice){
        invoiceService.cancelInvoice(idInvoice);
        return new ResponseEntity<>("success", HttpStatus.CREATED);
    }

    @GetMapping("/admin/find-all")
    public ResponseEntity<?> findAll(@RequestParam(value = "from",required = false) Date from,
                                     @RequestParam(value = "to",required = false) Date to,
                                     @RequestParam(value = "status",required = false) StatusInvoice statusInvoice, Pageable pageable){
        Page<Invoice> result = invoiceService.findAllFull(from, to, statusInvoice,pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/all-status")
    public ResponseEntity<?> allStatus(){
        List<StatusInvoice> result = Arrays.stream(StatusInvoice.class.getEnumConstants()).toList();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/admin/update-status")
    public ResponseEntity<?> updateStatus(@RequestParam("idInvoice") Long idInvoice){
        Invoice invoice = invoiceService.updateStatus(idInvoice);
        return new ResponseEntity<>(invoice, HttpStatus.CREATED);
    }

    @PostMapping("/admin/update-status-noreceived")
    public ResponseEntity<?> updateStatusNoReciver(@RequestParam("idInvoice") Long idInvoice){
        invoiceService.NoRECEIVED(idInvoice);
        return new ResponseEntity<>( HttpStatus.CREATED);
    }
}
