package com.web.api;

import com.web.entity.Category;
import com.web.entity.Store;
import com.web.service.CategoryService;
import com.web.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/store")
@CrossOrigin
public class StoreApi {

    @Autowired
    private StoreService storeService;

    @GetMapping("/public/findAll-list")
    public ResponseEntity<?> findAll(){
        List<Store> result = storeService.findAllList();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/public/findAll-page")
    public ResponseEntity<?> findAllPage(Pageable pageable){
        Page<Store> result = storeService.findAll(pageable);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }


    @PostMapping("/admin/create")
    public ResponseEntity<?> save(@RequestBody Store store){
        Store result = storeService.save(store);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        storeService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/admin/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        Store result = storeService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
