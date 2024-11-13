package com.web.api;

import com.nimbusds.openid.connect.sdk.assurance.evidences.Voucher;
import com.web.dto.PaymentDto;
import com.web.dto.ResponsePayment;
import com.web.service.CartService;
import com.web.utils.CurrencyService;
import com.web.vnpay.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/vnpay")
@CrossOrigin
public class VnpayApi {

    @Autowired
    private CartService cartService;

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private CurrencyService currencyService;


    @PostMapping("/urlpayment")
    public ResponsePayment getUrlPayment(@RequestBody PaymentDto paymentDto){
        Double totalAmount = cartService.totalAmountCart();
        Double vnd = currencyService.convertUsdToVnd(totalAmount);
        String orderId = String.valueOf(System.currentTimeMillis());
        String vnpayUrl = vnPayService.createOrder(vnd.intValue(), orderId, paymentDto.getReturnUrl());
        ResponsePayment responsePayment = new ResponsePayment(vnpayUrl,orderId,null);
        return responsePayment;
    }
}
