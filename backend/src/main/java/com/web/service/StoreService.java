package com.web.service;

import com.web.entity.Category;
import com.web.entity.Store;
import com.web.exception.MessageException;
import com.web.repository.CategoryRepository;
import com.web.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StoreService {

    @Autowired
    private StoreRepository storeRepository;


    public List<Store> findAllList() {
        return storeRepository.findAll();
    }


    public Store save(Store store) {
        Store result = storeRepository.save(store);
        return result;
    }



    public void delete(Long id) {
        storeRepository.deleteById(id);
    }


    public Store findById(Long id) {
        Optional<Store> store = storeRepository.findById(id);
        if(store.isEmpty()){
            throw new MessageException("Not found store :"+id);
        }
        return store.get();
    }


    public Page<Store> findAll(Pageable pageable) {
        Page<Store> page = storeRepository.findAll(pageable);
        return page;
    }


}
