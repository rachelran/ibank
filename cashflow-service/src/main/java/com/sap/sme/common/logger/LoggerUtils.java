/**
 * Copyright (C) 1972-2016 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.logger;

import org.slf4j.MDC;

import com.sap.sme.common.json.mask.ContextJsonMask;

/**
 * @author I311334
 */
public class LoggerUtils {

    /**
     * Convert object into string.
     *
     * @param obj object
     * @return string of object
     */
    public static String toString(Object obj) {
        return ContextJsonMask.maskToString(obj);
    }

    /**
     * @return the firstLineMaxLength
     */
    public static int getFirstLineMaxLength() {
        return LightLogger.getFirstLineMaxLength();
    }

    /**
     * @param firstLineMaxLength the firstLineMaxLength to set
     */
    public static void setFirstLineMaxLength(int firstLineMaxLength) {
        LightLogger.setFirstLineMaxLength(firstLineMaxLength);
    }

    public static void setLoggerTaskContext(String value) {
        MDC.put("taskContext", value);
    }

    public static void clearLoggerTaskContext() {
        MDC.remove("taskContext");
    }

}
