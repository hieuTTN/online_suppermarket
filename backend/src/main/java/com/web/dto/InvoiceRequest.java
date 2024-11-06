package com.web.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class InvoiceRequest {

    private String address;

    private String fullname;

    private String phone;

    private String note;

}
