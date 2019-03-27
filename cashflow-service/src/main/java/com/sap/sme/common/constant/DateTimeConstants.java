/**
 * Copyright (C) 1972-2018 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.constant;

import java.time.ZoneId;
import java.util.TimeZone;

/**
 * @author I311334
 */
public interface DateTimeConstants {

    interface TimeZoneConstants {
        TimeZone UTC = TimeZone.getTimeZone("UTC");
        ZoneId UTC_ZoneId = UTC.toZoneId();
    }

}
