/**
 * Copyright (C) 1972-2018 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.ilab.cashflow.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.datasource.lookup.DataSourceLookupFailureException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.sap.sme.common.exception.BusinessException;
import com.sap.sme.common.logger.LightLogger;
import com.sap.sme.ilab.cashflow.constant.GlobalConstants.HttpHeader;
import com.sap.sme.ilab.cashflow.domain.ErrorResponseBody;

/**
 * @author I311334
 */
@RestControllerAdvice
public class GlobalControllerExceptionHandler {

    private final LightLogger log = LightLogger.getLogger(this);

    @ExceptionHandler({ Exception.class })
    public ResponseEntity<ErrorResponseBody> handleException(HttpServletRequest request, Exception ex) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = null;

        if (isCausedByDataSourceLookupFailureException(ex)) {
            String tenantId = request.getHeader(HttpHeader.TENANT_ID);
            if (tenantId == null) {
                status = HttpStatus.BAD_REQUEST;
                message = HttpHeader.TENANT_ID + " not exist in HTTP request header, required by business.";

                log.error(ex, message);
            } else {
                status = HttpStatus.BAD_REQUEST;
                message = "Invalid " + HttpHeader.TENANT_ID + " in HTTP request header.";

                log.error(ex, message);
            }
        } else if (ex instanceof BusinessException) {
            status = HttpStatus.BAD_REQUEST;
            message = "Error process request: " + ex.getMessage();

            log.error(ex, "Error process request.");
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = "Internal Server Error.";

            log.error(ex, "Unexpected error occur.");
        }

        ErrorResponseBody rspBody = new ErrorResponseBody(status, message);
        rspBody.setPath(request.getServletPath());

        return new ResponseEntity<>(rspBody, status);
    }

    private boolean isCausedByDataSourceLookupFailureException(Exception ex) {
        Throwable t = ex;

        while (t != null) {
            if (t instanceof DataSourceLookupFailureException) {
                return true;
            }
            t = t.getCause();
        }

        return false;
    }

}
