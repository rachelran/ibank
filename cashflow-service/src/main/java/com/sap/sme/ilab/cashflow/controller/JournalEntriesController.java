package com.sap.sme.ilab.cashflow.controller;

import java.util.Properties;

import javax.annotation.Resource;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;


import com.sap.sme.common.logger.LightLogger;
import com.sap.sme.ilab.cashflow.datasource.domain.HttpHeadPack;

@RestController
public class JournalEntriesController {
 
    private static RestTemplate restTemplate =  new RestTemplate();
    private static HttpHeadPack headpack = new HttpHeadPack();
    @Resource(name="myProperties")
    private Properties myProperties;
    private final LightLogger log = LightLogger.getLogger(this);
    
    @RequestMapping(value = "/api/JournalEntries", method = RequestMethod.GET)
    public ResponseEntity<String> findJournalEntriesList(RequestEntity<?> requestParam) {
        
        try {
            HttpEntity <Object> entity = headpack.createHttpHead(requestParam);
            return restTemplate.exchange(genUrl(),HttpMethod.GET,entity, String.class);
        } catch(Exception e) {
            log.error(e, "fails to find All JournalEntries.");
            return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
        } 
    }
    
    @RequestMapping(value = "/api/JournalEntries/{id}", method = RequestMethod.GET)
    public ResponseEntity<String> findOneJournalEntrie(@PathVariable("id") String id,RequestEntity<?> requestParam) {

        try {
            HttpEntity <Object> entity = headpack.createHttpHead(requestParam);
            String Geturl = genUrl()+"/"+id;
            return restTemplate.exchange(Geturl,HttpMethod.GET,entity, String.class);
        } catch(Exception e) {
            log.error(e, "fails to find one JournalEntries.");
            return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
        } 
    }
    
    @RequestMapping(value = "/api/JournalEntries", method = RequestMethod.POST)
    public ResponseEntity<String> createJournalEntries(RequestEntity<?> requestParam) {
        
        try {
            HttpEntity <Object> entity = headpack.createHttpHeadBody(requestParam);
            return restTemplate.exchange(genUrl(),HttpMethod.POST,entity, String.class);
        } catch(Exception e) {
            log.error(e, "fails to create JournalEntries.");
            return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
        } 
    }
    
    @RequestMapping(value = "/api/JournalEntries/{id}", method = RequestMethod.DELETE)
                
    public ResponseEntity<String> deleteJournalEntries(@PathVariable("id") String id,RequestEntity<?> requestParam) {   
        
        try {
            HttpEntity <Object> entity = headpack.createHttpHead(requestParam);
            String Geturl = genUrl()+"/"+id;
            return restTemplate.exchange(Geturl,HttpMethod.DELETE,entity, String.class);
        } catch(Exception e) {
            log.error(e, "fails to delete JournalEntries.");
            return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
        } 
    }
    
    private String genUrl() {
        String dburl = "http://"+myProperties.getProperty("TENANT_SERVICE_HOST")+":"+myProperties.getProperty("TENANT_SERVICE_PORT")+"/api/JournalEntries";
        return dburl;
    }
    
}
