package com.web.dto;

import com.web.dto.UserDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenDto {

    private String token;

    private UserDto user;
}
