package com.web.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum StatusInvoice {

    WAITING,
    CONFIRMED, SENT, RECEIVED, CANCELED, NO_RECEIVED;
}
