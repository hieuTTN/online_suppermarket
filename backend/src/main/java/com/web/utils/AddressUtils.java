package com.web.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class AddressUtils {

    private String apiKey = "9ce1bd74-9fc8-11ef-819a-9e59fa82dda0";

    private String shopId = "5448630";

    @Autowired
    private RestTemplate restTemplate;


    public Map<String, Object> getProvince() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", apiKey);
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
                HttpMethod.POST,
                request,
                Map.class
        );
        return response.getBody();
    }


    public Map<String, Object> getDistrict(Integer provinceId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", apiKey);
        headers.set("Content-Type", "application/json");
        Map<String, Object> data = new HashMap<>();
        data.put("province_id", provinceId);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(data,headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
                HttpMethod.POST,
                request,
                Map.class
        );
        return response.getBody();
    }

    public Map<String, Object> getWard(Integer districtId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", apiKey);
        headers.set("Content-Type", "application/json");
        Map<String, Object> data = new HashMap<>();
        data.put("district_id", districtId);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(data,headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id",
                HttpMethod.POST,
                request,
                Map.class
        );
        return response.getBody();
    }
}
