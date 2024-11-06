package com.web.mapper;

import com.web.dto.CommentRequest;
import com.web.entity.Category;
import com.web.entity.Product;
import com.web.entity.ProductComment;
import com.web.entity.User;
import com.web.utils.UserUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductCommentMapper {

    @Autowired
    private ModelMapper mapper;

    public ProductComment productCmtRequestToProductComment(CommentRequest request){
        ProductComment productComment = mapper.map(request, ProductComment.class);
        return productComment;
    }

}
