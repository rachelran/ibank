/**
 * Copyright (C) 1972-2018 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.json.mask;

/**
 * JSON mask that can be configured based on context.
 *
 * @author I311334
 */
public class ContextJsonMask {

    private static JsonMask jsonMaskDefault = new JsonMask();

    public static String maskToString(Object obj) {
        return jsonMaskDefault.maskToString(obj);
    }

    /**
     * @return the jsonMaskDefault
     */
    public static JsonMask getDefault() {
        return jsonMaskDefault;
    }

    /**
     * @param jsonMaskDefault the jsonMaskDefault to set
     */
    public static void setDefault(JsonMask jsonMaskDefault) {
        ContextJsonMask.jsonMaskDefault = jsonMaskDefault;
    }

}
