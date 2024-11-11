package com.web.service;

import com.nimbusds.openid.connect.sdk.assurance.evidences.Voucher;
import com.web.dto.InvoiceRequest;
import com.web.entity.*;
import com.web.enums.PayType;
import com.web.enums.StatusInvoice;
import com.web.exception.MessageException;
import com.web.repository.*;
import com.web.utils.UserUtils;
import com.web.vnpay.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InvoiceDetailRepository invoiceDetailRepository;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private InvoiceStatusRepository invoiceStatusRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private HistoryPayRepository historyPayRepository;

    @Autowired
    private VNPayService vnPayService;

    public void create(InvoiceRequest invoiceRequest) throws Exception {
        if(invoiceRequest.getPayType() != null && invoiceRequest.getPayType().equals(PayType.VNPAY)){
            if(invoiceRequest.getVnpOrderInfo() == null){
                throw new MessageException("vnpay order infor require");
            }
            if(historyPayRepository.findByOrderIdAndRequestId(invoiceRequest.getVnpOrderInfo(), invoiceRequest.getVnpOrderInfo()).isPresent()){
                throw new MessageException("Payment paid");
            }
            int paymentStatus = vnPayService.orderReturnByUrl(invoiceRequest.getUrlVnpay());
            if(paymentStatus != 1){
                throw new MessageException("Payment error");
            }
        }
        Double totalAmount = 0D;
        User user = userUtils.getUserWithAuthority();
        for(Cart p : cartRepository.findByUser(user.getId())){
            totalAmount += p.getProduct().getPrice() * p.getQuantity();
            if(p.getQuantity() > p.getProduct().getQuantity()){
                throw new MessageException("Product "+p.getProduct().getName()+" only has "+p.getProduct().getQuantity()+" product left");
            }
        }
        Invoice invoice = new Invoice();
        invoice.setNote(invoiceRequest.getNote());
        invoice.setReceiverName(invoiceRequest.getFullname());
        invoice.setPhone(invoiceRequest.getPhone());
        invoice.setAddress(invoiceRequest.getAddress());
        invoice.setCreatedDate(new Date(System.currentTimeMillis()));
        invoice.setCreatedTime(new Time(System.currentTimeMillis()));
        invoice.setUser(userUtils.getUserWithAuthority());
        invoice.setStatusInvoice(StatusInvoice.WAITING);
        invoice.setTotalAmount(totalAmount);
        invoice.setPayType(invoiceRequest.getPayType());
        Invoice result = invoiceRepository.save(invoice);

        for(Cart p : cartRepository.findByUser(user.getId())){
            InvoiceDetail invoiceDetail = new InvoiceDetail();
            invoiceDetail.setInvoice(result);
            invoiceDetail.setProduct(p.getProduct());
            invoiceDetail.setPrice(p.getProduct().getPrice());
            invoiceDetail.setQuantity(p.getQuantity());
            invoiceDetailRepository.save(invoiceDetail);
            p.getProduct().setQuantity(p.getProduct().getQuantity() - p.getQuantity());
            productRepository.save(p.getProduct());
        }

        InvoiceStatus invoiceStatus = new InvoiceStatus();
        invoiceStatus.setInvoice(invoice);
        invoiceStatus.setStatusInvoice(StatusInvoice.WAITING);
        invoiceStatus.setCreatedBy(userUtils.getUserWithAuthority());
        invoiceStatus.setCreatedDate(LocalDateTime.now());
        invoiceStatusRepository.save(invoiceStatus);

        if(invoiceRequest.getPayType().equals(PayType.VNPAY)){
            HistoryPay historyPay = new HistoryPay();
            historyPay.setInvoice(result);
            historyPay.setRequestId(invoiceRequest.getVnpOrderInfo());
            historyPay.setOrderId(invoiceRequest.getVnpOrderInfo());
            historyPay.setCreatedTime(new Time(System.currentTimeMillis()));
            historyPay.setCreatedDate(new Date(System.currentTimeMillis()));
            historyPay.setTotalAmount(totalAmount);
            historyPayRepository.save(historyPay);
        }
        cartService.deleteByUser();
    }

    public List<Invoice> myInvoice(){
        List<Invoice> list = invoiceRepository.findByUser(userUtils.getUserWithAuthority().getId());
        return list;
    }

    public List<Invoice> allInvoice(){
        List<Invoice> list = invoiceRepository.findAll();
        return list;
    }

    public void cancelInvoice(Long invoiceId) {
        Optional<Invoice> invoice = invoiceRepository.findById(invoiceId);
        if(invoice.isEmpty()){
            throw new MessageException("invoice id not found");
        }
        if(invoice.get().getUser().getId() != userUtils.getUserWithAuthority().getId()){
            throw new MessageException("access denied");
        }
        if(invoice.get().getStatusInvoice() != StatusInvoice.WAITING && invoice.get().getStatusInvoice() != StatusInvoice.CONFIRMED){
            throw new MessageException("Orders cannot be canceled");
        }
        invoice.get().setStatusInvoice(StatusInvoice.CANCELED);
        invoiceRepository.save(invoice.get());
        InvoiceStatus invoiceStatus = new InvoiceStatus();
        invoiceStatus.setInvoice(invoice.get());
        invoiceStatus.setStatusInvoice(StatusInvoice.CANCELED);
        invoiceStatus.setCreatedBy(userUtils.getUserWithAuthority());
        invoiceStatus.setCreatedDate(LocalDateTime.now());
        invoiceStatusRepository.save(invoiceStatus);
        List<InvoiceDetail> invoiceDetails = invoiceDetailRepository.findByInvoiceId(invoiceId);
        for(InvoiceDetail i : invoiceDetails){
            i.getProduct().setQuantity(i.getProduct().getQuantity() + i.getQuantity());
            productRepository.save(i.getProduct());
        }
    }

    public Page<Invoice> findAllFull(Date from, Date to, StatusInvoice statusInvoice, Pageable pageable) {
        Page<Invoice> list = null;
        if(from == null || to == null){
            from = Date.valueOf("2000-01-01");
            to = Date.valueOf("2200-01-01");
        }
        if(statusInvoice == null){
            list = invoiceRepository.findByDate(from, to,pageable);
        }
        if(statusInvoice != null){
            list = invoiceRepository.findByDateAndStatus(from, to, statusInvoice,pageable);
        }
        return list;
    }

    public void updateStatus(Long idInvoice, StatusInvoice statusInvoice) {
        Optional<Invoice> invoice = invoiceRepository.findById(idInvoice);
        if(invoice.isEmpty()){
            throw new MessageException("invoice id not found");
        }
        invoice.get().setStatusInvoice(statusInvoice);
        invoiceRepository.save(invoice.get());
    }

}
