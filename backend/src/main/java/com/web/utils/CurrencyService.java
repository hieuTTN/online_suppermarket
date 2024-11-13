package com.web.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;

@Service
public class CurrencyService {

    private final String apiUrl = "https://api.exchangerate-api.com/v4/latest/USD";

    @Autowired
    private RestTemplate restTemplate;

    public double convertUsdToVnd(double usdAmount) {
        ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);
        JSONObject jsonResponse = new JSONObject(response.getBody());
        System.out.println("usd rate vnd: "+jsonResponse.getJSONObject("rates"));
        double exchangeRate = jsonResponse.getJSONObject("rates").getDouble("VND");
        return usdAmount * exchangeRate;
    }
}

