/**
 * Copyright (C) 1972-2016 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.sql;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.HashMap;

import com.sap.sme.common.util.DateTimeUtils;

/**
 * Native SQL Query result.
 *
 * @author I311334
 */
public class QueryResult extends HashMap<String, Object> {

    private static final long serialVersionUID = 4012368388219439039L;

    /**
     * Remove value by key.
     *
     * @param key key
     * @return removed value, return null if key not exist
     */
    @SuppressWarnings("unchecked")
    public <T> T remove(String key) {
        return (T) super.remove(key);
    }

    /**
     * Get value by key.
     *
     * @param key key
     * @return value, return null if key not exist
     */
    @SuppressWarnings("unchecked")
    public <T> T get(String key) {
        return (T) super.get(key);
    }

    /**
     * Get value by key.
     *
     * @param key key
     * @return value, return null if key not exist
     */
    public String getString(String key) {
        return NativeSqlUtils.toString(super.get(key));
    }

    /**
     * Get value by key.
     *
     * @param key key
     * @return value, return null if key not exist
     */
    public Integer getInteger(String key) {
        return NativeSqlUtils.toInteger(super.get(key));
    }

    /**
     * Get value by key.
     *
     * @param key key
     * @return value, return null if key not exist
     */
    public Long getLong(String key) {
        return NativeSqlUtils.toLong(super.get(key));
    }

    /**
     * Get value by key.
     *
     * @param key key
     * @return value, return null if key not exist
     */
    public BigDecimal getBigDecimal(String key) {
        return NativeSqlUtils.toBigDecimal(super.get(key));
    }

    /**
     * Get value by key.
     *
     * @param key key
     * @return value, return null if key not exist
     */
    public Boolean getBoolean(String key) {
        return NativeSqlUtils.toBoolean(super.get(key));
    }

    /**
     * Get value by key.
     *
     * @param key key
     * @return value, return null if key not exist
     */
    public Timestamp getTimestamp(String key) {
        Long result = NativeSqlUtils.toLong(super.get(key));
        return (result != null) ? new Timestamp(result) : null;
    }

    /**
     * Get value by key.
     *
     * @param key key
     * @return value, return null if key not exist
     */
    public Calendar getCalendar(String key) {
        Long result = NativeSqlUtils.toLong(super.get(key));
        if (result != null) {
            Calendar calendar = DateTimeUtils.currentCalendar();
            calendar.setTimeInMillis(result);
            return calendar;
        } else {
            return null;
        }
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "QueryResult [, super()=" + super.toString() + "]";
    }

}
