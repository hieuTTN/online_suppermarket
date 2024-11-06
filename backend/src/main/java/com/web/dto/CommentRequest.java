package com.web.dto;

import com.web.entity.Product;
import com.web.entity.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CommentRequest {

    private Long id;

    private String content;

    private Product product;

}
