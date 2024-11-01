package com.web.api;

import com.web.entity.Product;
import com.web.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/product")
@CrossOrigin
public class ProductApi {

    @Autowired
    private ProductService productService;


    @PostMapping("/admin/create")
    public ResponseEntity<?> save(@RequestBody Product productRequest) {
        Product response = productService.save(productRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/admin/findById")
    public ResponseEntity<?> findByIdForAdmin(@RequestParam("id") Long id) {
        Product response = productService.findById(id);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/public/find-all-page")
    public ResponseEntity<?> findByAdmin(Pageable pageable) {
        Page<Product> response = productService.findAll(pageable);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id) {
        productService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
