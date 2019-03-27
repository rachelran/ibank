/**
 * Copyright (C) 1972-2018 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.ilab.cashflow.domain;

import java.util.Date;

import org.springframework.http.HttpStatus;

/**
 * @author I311334
 */
public class ErrorResponseBody {

    private Date timestamp = new Date();

    private String path;

    private int status;

    private String message;

    /**
     * Construct instance.
     *
     * @param status
     * @param message
     */
    public ErrorResponseBody(int status, String message) {
        super();
        this.status = status;
        this.message = message;
    }

    /**
     * Construct instance.
     *
     * @param httpStatus
     * @param message
     */
    public ErrorResponseBody(HttpStatus httpStatus, String message) {
        super();
        this.status = httpStatus.value();
        this.message = (message != null) ? message : httpStatus.getReasonPhrase();
    }

    public void setHttpStatus(HttpStatus httpStatus) {
        status = httpStatus.value();
        if (message == null) {
            message = httpStatus.getReasonPhrase();
        }
    }

    /**
     * @return the timestamp
     */
    public Date getTimestamp() {
        return timestamp;
    }

    /**
     * @param timestamp the timestamp to set
     */
    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * @return the path
     */
    public String getPath() {
        return path;
    }

    /**
     * @param path the path to set
     */
    public void setPath(String path) {
        this.path = path;
    }

    /**
     * @return the status
     */
    public int getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(int status) {
        this.status = status;
    }

    /**
     * @return the message
     */
    public String getMessage() {
        return message;
    }

    /**
     * @param message the message to set
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String toString() {
        return "ErrorResponseBody [timestamp="
                + timestamp
                + ", path="
                + path
                + ", status="
                + status
                + ", message="
                + message
                + "]";
    }

}
