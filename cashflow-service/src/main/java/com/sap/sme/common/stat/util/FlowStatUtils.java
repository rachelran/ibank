/**
 * Copyright (C) 1972-2016 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.stat.util;

/**
 * @author I311334
 */
public class FlowStatUtils {

    public static String formatTime(long time) {
        if (time / 1000 > 0) {
            return (time / 1000) + "s" + (time % 1000) + "ms";
        } else {
            return (time % 1000) + "ms";
        }
    }

}
