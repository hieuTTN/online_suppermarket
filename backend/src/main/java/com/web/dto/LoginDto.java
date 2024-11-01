package com.web.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDto {

    private String email;

    private String password;

    private Float latitude;

    private Float longitude;

    private String tokenFcm;
}
