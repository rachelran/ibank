/**
 * Copyright (C) 1972-2015 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.json.util;

import java.util.Arrays;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sap.sme.common.exception.InternalException;
import com.sap.sme.common.json.factory.ObjectMapperFactory;
import com.sap.sme.common.logger.LightLogger;

/**
 * Helper utilities to easier JSON convert.
 *
 * @author I311334
 */
public class JsonUtils {

    private static final LightLogger log = LightLogger.getLogger(JsonUtils.class);
    private static final ObjectMapper JSON_MAPPER = ObjectMapperFactory.getInstance();

    /**
     * Convert object to JSON text.
     *
     * @param obj object
     * @return JSON text
     */
    public static String toJson(Object obj) {
        try {
            return JSON_MAPPER.writeValueAsString(obj);
        } catch (Exception e) {
            String errMsg = "error convert object[" + obj + "] to JSON";
            log.error(e, errMsg);

            throw new InternalException(e, errMsg);
        }
    }

    /**
     * Convert JSON text to object.
     *
     * @param json JSON text
     * @param clazz object class
     * @param parameterClazzes template class
     * @return object
     */
    @SuppressWarnings("unchecked")
    public static <T> T toObject(String json, Class<?> clazz, Class<?>... parameterClazzes) {
        try {
            if (StringUtils.isBlank(json)) {
                return null;
            }

            if (parameterClazzes.length > 0) {
                JavaType javaType = JSON_MAPPER.getTypeFactory().constructParametricType(clazz, parameterClazzes);
                return (T) JSON_MAPPER.readValue(json, javaType);
            } else {
                return (T) JSON_MAPPER.readValue(json, clazz);
            }
        } catch (Exception e) {
            String errMsg = "error convert JSON[" + json + "] to object of class[" + clazz + "]T" + Arrays.toString(parameterClazzes);
            log.error(e, errMsg);

            throw new InternalException(e, errMsg);
        }
    }

    /**
     * Convert JSON text to object.
     *
     * @param json JSON text
     * @param clazz object class
     * @param parameterClazzes template class
     * @return object
     */
    @SuppressWarnings("unchecked")
    public static <T> T toObject(byte[] json, Class<?> clazz, Class<?>... parameterClazzes) {
        try {
            if (isBlank(json)) {
                return null;
            }

            if (parameterClazzes.length > 0) {
                JavaType javaType = JSON_MAPPER.getTypeFactory().constructParametricType(clazz, parameterClazzes);
                return (T) JSON_MAPPER.readValue(json, javaType);
            } else {
                return (T) JSON_MAPPER.readValue(json, clazz);
            }
        } catch (Exception e) {
            String errMsg = "error convert JSON[" + new String(json) + "] to object of class[" + clazz + "]T" + Arrays.toString(parameterClazzes);
            log.error(e, errMsg);

            throw new InternalException(e, errMsg);
        }
    }

    /**
     * Check whether string looks like a JSON.
     *
     * @param str string
     * @return true if string looks like a JSON, false otherwise
     */
    public static boolean looksLikeJson(String str) {
        str = StringUtils.trimToEmpty(str);
        return (str.startsWith("{") && str.endsWith("}"))
                || (str.startsWith("[") && str.endsWith("]"));
    }

    private static boolean isBlank(byte[] bytes) {
        for (byte b : bytes) {
            if (!Character.isSpaceChar(b)) {
                return false;
            }
        }
        return true;
    }

    public static ObjectMapper getObjectMapper() {
        return JSON_MAPPER;
    }

}
