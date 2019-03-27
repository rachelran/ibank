/**
 * Copyright (C) 1972-2017 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.json.util;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sap.sme.common.json.factory.ObjectMapperFactory;
import com.sap.sme.common.logger.LightLogger;

/**
 * @author I311334
 */
public class JsonUtilsToStringBuilder {

    private static final LightLogger log = LightLogger.getLogger(JsonUtilsToStringBuilder.class);

    private static final ObjectMapper JSON_MAPPER = ObjectMapperFactory.getInstance().copy();
    static {
        JSON_MAPPER.setVisibility(PropertyAccessor.ALL, Visibility.NONE);
        JSON_MAPPER.setVisibility(PropertyAccessor.FIELD, Visibility.ANY);
    }

    private Object object;

    /**
     * Construct instance.
     *
     * @param object
     */
    public JsonUtilsToStringBuilder(Object object) {
        this.object = object;
    }

    public void append(Object fieldValue) {
        // Do nothing.
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return object.getClass().getSimpleName() + " " + toJson(object);
    }

    private static String toJson(Object obj) {
        try {
            return JSON_MAPPER.writeValueAsString(obj);
        } catch (Exception e) {
            log.warn(e, "error convert object[", obj, "] to JSON");
            return Objects.toString(obj, "");
        }
    }

}
