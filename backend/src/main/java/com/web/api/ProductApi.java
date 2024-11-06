package com.web.api;

import com.web.dto.ProductSearch;
import com.web.entity.Product;
import com.web.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/public/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id) {
        Product result = productService.findById(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/findById")
    public ResponseEntity<?> findByIdForAdmin(@RequestParam("id") Long id) {
        Product response = productService.findById(id);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/public/find-all-page")
    public ResponseEntity<?> findByAdmin(Pageable pageable) {
        Page<Product> response = productService.findAll(pageable);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/public/find-by-param")
    public ResponseEntity<?> findByParam(@RequestParam(required = false) String search, Pageable pageable) {
        List<Product> response = productService.findByParam(search, pageable);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id) {
        productService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/public/find-search-full")
    public ResponseEntity<?> searchFull(@RequestBody ProductSearch productSearch, Pageable pageable) {
        Page<Product> response = productService.searchFull(productSearch, pageable);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


}
