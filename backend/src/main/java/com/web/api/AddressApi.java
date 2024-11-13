package com.web.api;

import com.web.utils.AddressUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/address")
@CrossOrigin
public class AddressApi {

    @Autowired
    private AddressUtils addressUtils;


    @GetMapping("/public/province")
    public ResponseEntity<?> getProvince() {
        return new ResponseEntity<>(addressUtils.getProvince(), HttpStatus.OK);
    }

    @GetMapping("/public/district")
    public ResponseEntity<?> getDistrict(@RequestParam Integer provinceId) {
        return new ResponseEntity<>(addressUtils.getDistrict(provinceId), HttpStatus.OK);
    }

    @GetMapping("/public/wards")
    public ResponseEntity<?> getWard(@RequestParam Integer districtId) {
        return new ResponseEntity<>(addressUtils.getWard(districtId), HttpStatus.OK);
    }
}
