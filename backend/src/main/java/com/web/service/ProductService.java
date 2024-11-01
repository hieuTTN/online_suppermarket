package com.web.service;

import com.web.entity.*;
import com.web.exception.MessageException;
import com.web.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Component
@Repository
public class ProductService {


    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    public Product save(Product product) {
        Product result = productRepository.save(product);
        for (String link : product.getLinkImages()) {
            ProductImage productImage = new ProductImage();
            productImage.setProduct(result);
            productImage.setLinkImage(link);
            productImageRepository.save(productImage);
        }
        return product;
    }

    public void delete(Long idProduct) {
        Product p = productRepository.findById(idProduct).get();
        try {
            productRepository.deleteById(idProduct);
        } catch (Exception e) {
            throw new MessageException("This product can't delete");
        }
    }

    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Product findById(Long id) {
        Optional<Product> exist = productRepository.findById(id);
        if (exist.isEmpty()) {
            throw new MessageException("product not found");
        }
        return exist.get();
    }

    
}
