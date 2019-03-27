package com.sap.sme.ilab.cashflow.datasource.domain;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;

import com.sap.sme.common.logger.LightLogger;
import com.sap.sme.ilab.cashflow.constant.GlobalConstants.HttpHeader;

public class HttpHeadPack {

    private final LightLogger log = LightLogger.getLogger(this);
    public HttpHeaders createHeader() {
        HttpHeaders headers = new HttpHeaders();
        MediaType type = MediaType.parseMediaType("application/json; charset=UTF-8");
        headers.setContentType(type);
        headers.add("Accept", MediaType.APPLICATION_JSON.toString());
        return headers;
    }

    public HttpHeaders createHeaderwithTenantId(String tenantid) {
        HttpHeaders headers = createHeader();
        if(null == headers) {
            log.error("fails to create HttpHead.");
            return null;
        }
        headers.set(HttpHeader.TENANT_ID,tenantid);
        return headers;
    }

    public HttpEntity<Object> createHttpHead() {
        HttpHeaders headers = createHeader();
        if(null == headers) {
            log.error("fails to create HttpHead.");
            return null;
        }

        return new HttpEntity<Object>(headers);

    }

    public HttpEntity <Object> createHttpHead(RequestEntity<?> requestParam) {
        String tenantid = requestParam.getHeaders().getFirst(HttpHeader.TENANT_ID);
        if(null == tenantid) {
            log.error("invalid tenantid.");
            return null;
        }
        HttpHeaders headers = createHeaderwithTenantId(tenantid);
        if(null == headers) {
            log.error("fails to create HttpHead by tenantid.");
            return null;
        }
        HttpEntity <Object> entity = new HttpEntity<Object>(headers);
        return entity;
    }

    public HttpEntity <Object> createHttpHeadBody(RequestEntity<?> requestParam) {
        String tenantid = requestParam.getHeaders().getFirst(HttpHeader.TENANT_ID);
        Object jebody = requestParam.getBody();
        if(null == tenantid || null == jebody) {
            log.error("invalid tenantid or requestbody.");
            return null;
        }

        HttpHeaders headers = createHeaderwithTenantId(tenantid);
        if(null == headers) {
            log.error("fails to create HttpHead by tenantid.");
            return null;
        }
        HttpEntity <Object> entity = new HttpEntity<Object>(jebody,headers);
        return entity;
    }
}
