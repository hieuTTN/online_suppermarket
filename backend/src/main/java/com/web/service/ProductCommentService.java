package com.web.service;

import com.web.dto.CommentRequest;
import com.web.entity.ProductComment;
import com.web.entity.User;
import com.web.exception.MessageException;
import com.web.mapper.ProductCommentMapper;
import com.web.repository.ProductCommentRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.sql.Time;
import java.util.List;
import java.util.Optional;

@Component
public class ProductCommentService {

    @Autowired
    private ProductCommentRepository productCommentRepository;

    @Autowired
    private ProductCommentMapper productCommentMapper;

    @Autowired
    private UserUtils userUtils;

    public ProductComment create(CommentRequest commentRequest) {
        if(commentRequest.getId() != null){
           throw new MessageException("id must null");
        }
        ProductComment productComment = productCommentMapper.productCmtRequestToProductComment(commentRequest);
        productComment.setCreatedDate(new Date(System.currentTimeMillis()));
        productComment.setCreatedTime(new Time(System.currentTimeMillis()));
        productComment.setUser(userUtils.getUserWithAuthority());
        ProductComment result = productCommentRepository.save(productComment);
        return productComment;
    }

    public void delete(Long id) {
        if(id == null){
            throw new MessageException("id require");
        }
        Optional<ProductComment> optional = productCommentRepository.findById(id);
        if(optional.isEmpty()){
            throw new MessageException("comment not found");
        }
        if(optional.get().getUser().getId() != userUtils.getUserWithAuthority().getId()){
            throw new MessageException("access denied");
        }
        productCommentRepository.deleteById(id);
    }

    public void deleteByAdmin(Long id) {
        productCommentRepository.deleteById(id);
    }


    public List<ProductComment> findByProductId(Long productId) {
        List<ProductComment> list = productCommentRepository.findByProductId(productId);
        User user = userUtils.getUserWithAuthority();
        if(user != null){
            for(ProductComment p : list){
                if(p.getUser().getId() == user.getId()){
                    p.setIsMyComment(true);
                }
            }
        }
        return list;
    }
}
