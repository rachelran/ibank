/**
 * Copyright (C) 1972-2015 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.sql;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Objects;

import com.sap.sme.common.exception.InternalException;
import com.sap.sme.common.logger.LightLogger;
import com.sap.sme.common.util.DateTimeUtils;

/**
 * Utility to perform native SQL query.
 *
 * @author I311334
 */
public class NativeSqlUtils {

    private static final LightLogger log = LightLogger.getLogger(NativeSqlUtils.class);

    /**
     * Convert native SQL query result into Integer.
     *
     * @param obj query result object
     * @return Long value
     */
    public static Integer toInteger(Object obj) {
        Integer result = null;
        if (obj == null) {
            result = null;
        } else if (obj instanceof Long) {
            result = ((Long) obj).intValue();
        } else if (obj instanceof Integer) {
            result = (Integer) obj;
        } else if (obj instanceof Short) {
            result = ((Short) obj).intValue();
        } else if (obj instanceof Byte) {
            result = ((Byte) obj).intValue();
        } else if (obj instanceof BigDecimal) {
            result = ((BigDecimal) obj).intValue();
        } else if (obj instanceof BigInteger) {
            result = ((BigInteger) obj).intValue();
        } else if (obj instanceof String) {
            result = Integer.valueOf((String) obj);
        } else if (obj instanceof Boolean) {
            result = Boolean.TRUE.equals(obj) ? 1 : 0;
        } else {
            log.error("Unknown data type[", obj.getClass(), "] object value[", obj, "].");
            throw new InternalException("Unknown data type[", obj.getClass(), "].");
        }
        return result;
    }

    /**
     * Convert native SQL query result into Long.
     *
     * @param obj query result object
     * @return Long value
     */
    public static Long toLong(Object obj) {
        Long result = null;
        if (obj == null) {
            result = null;
        } else if (obj instanceof Long) {
            result = (Long) obj;
        } else if (obj instanceof Integer) {
            result = ((Integer) obj).longValue();
        } else if (obj instanceof Short) {
            result = ((Short) obj).longValue();
        } else if (obj instanceof Byte) {
            result = ((Byte) obj).longValue();
        } else if (obj instanceof BigDecimal) {
            result = ((BigDecimal) obj).longValue();
        } else if (obj instanceof BigInteger) {
            result = ((BigInteger) obj).longValue();
        } else if (obj instanceof String) {
            result = Long.valueOf((String) obj);
        } else if (obj instanceof Boolean) {
            result = Boolean.TRUE.equals(obj) ? 1L : 0L;
        } else {
            log.error("Unknown data type[", obj.getClass(), "] object value[", obj, "].");
            throw new InternalException("Unknown data type[", obj.getClass(), "].");
        }
        return result;
    }

    /**
     * Convert native SQL query result into BigDecimal.
     *
     * @param obj query result object
     * @return BigDecimal value
     */
    public static BigDecimal toBigDecimal(Object obj) {
        BigDecimal result = null;
        if (obj == null) {
            result = null;
        } else if (obj instanceof BigDecimal) {
            result = (BigDecimal) obj;
        } else if (obj instanceof Double) {
            result = BigDecimal.valueOf((Double) obj);
        } else if (obj instanceof Float) {
            result = BigDecimal.valueOf((Float) obj);
        } else if (obj instanceof Long) {
            result = BigDecimal.valueOf((Long) obj);
        } else if (obj instanceof Integer) {
            result = BigDecimal.valueOf(((Integer) obj).longValue());
        } else if (obj instanceof Short) {
            result = BigDecimal.valueOf(((Short) obj).longValue());
        } else if (obj instanceof Byte) {
            result = BigDecimal.valueOf(((Byte) obj).longValue());
        } else if (obj instanceof BigInteger) {
            result = new BigDecimal((BigInteger) obj);
        } else if (obj instanceof String) {
            result = new BigDecimal((String) obj);
        } else if (obj instanceof Boolean) {
            result = Boolean.TRUE.equals(obj) ? BigDecimal.valueOf(1) : BigDecimal.valueOf(0);
        } else {
            log.error("Unknown data type[", obj.getClass(), "] object value[", obj, "].");
            throw new InternalException("Unknown data type[", obj.getClass(), "].");
        }
        return result;
    }

    /**
     * Convert native SQL query result into Boolean.
     *
     * @param obj query result object
     * @return Boolean value
     */
    public static Boolean toBoolean(Object obj) {
        if (obj instanceof Boolean) {
            return (Boolean) obj;
        } else {
            Integer value = toInteger(obj);
            if (value != null) {
                return !value.equals(0);
            }
        }

        log.error("Unknown data type[", obj.getClass(), "] object value[", obj, "].");
        throw new InternalException("Unknown data type[", obj.getClass(), "].");
    }

    /**
     * Convert native SQL query result into String.
     *
     * @param obj query result object
     * @return String value
     */
    public static String toString(Object obj) {
        if (obj instanceof Timestamp) {
            return DateTimeUtils.formatTimestamp((Timestamp) obj);
        }
        return Objects.toString(obj, "");
    }

}
