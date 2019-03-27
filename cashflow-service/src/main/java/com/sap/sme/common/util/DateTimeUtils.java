/**
 * Copyright (C) 1972-2015 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.util;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;

import org.apache.commons.lang3.time.FastDateFormat;

import com.sap.sme.common.constant.DateTimeConstants.TimeZoneConstants;

/**
 * Date & time utilities of eShop sync task.
 *
 * @author I311334
 */
public class DateTimeUtils {

    public static final String DATE_TIME_FORMAT_UTC = "yyyyMMddHHmmss";

    private static FastDateFormat fastDateFormat;
    static {
        fastDateFormat = FastDateFormat.getInstance(DATE_TIME_FORMAT_UTC, TimeZoneConstants.UTC);
    }

    /**
     * Generate Timestamp of current time.
     *
     * @return Timestamp of current time
     */
    public static Timestamp currentTimestamp() {
        return new Timestamp(System.currentTimeMillis());
    }

    /**
     * Generate Calendar of current time.
     *
     * @return Calendar of current time
     */
    public static Calendar currentCalendar() {
        return newCalendar();
    }

    /**
     * Convert Calendar into Timestamp.
     *
     * @param calendar Calendar
     * @return Timestamp of Calendar, or current time if dateTime is null
     */
    public static Timestamp toTimestamp(Calendar calendar) {
        if (calendar != null) {
            return new Timestamp(calendar.getTimeInMillis());
        }
        return new Timestamp(System.currentTimeMillis());
    }

    /**
     * Convert Calendar into Timestamp.
     *
     * @param calendar Calendar
     * @param defaultValue default value to return if dateTime is null
     * @return Timestamp of Calendar, or defaultValue if dateTime is null
     */
    public static Timestamp toTimestamp(Calendar calendar, Timestamp defaultValue) {
        if (calendar != null) {
            return new Timestamp(calendar.getTimeInMillis());
        }
        return defaultValue;
    }

    /**
     * Convert Timestamp into Calendar.
     *
     * @param timestamp Timestamp
     * @return Calendar of timestamp, or Calendar of current time if timestamp is null
     */
    public static Calendar toCalendar(Timestamp timestamp) {
        if (timestamp != null) {
            Calendar calendar = newCalendar();
            calendar.setTimeInMillis(timestamp.getTime());
            return calendar;
        }
        return currentCalendar();
    }

    /**
     * Convert Timestamp into Calendar.
     *
     * @param timestamp Timestamp
     * @return Calendar, or defaultValue if timestamp is null
     */
    public static Calendar toCalendar(Timestamp timestamp, Calendar defaultValue) {
        if (timestamp != null) {
            Calendar calendar = newCalendar();
            calendar.setTimeInMillis(timestamp.getTime());
            return calendar;
        }
        return defaultValue;
    }

    /**
     * Format Timestamp into string representation.
     * Date time are formatted in UTC time zone.
     *
     * @param timestamp Timestamp
     * @return string representation of timestamp.
     */
    public static String formatTimestamp(Timestamp timestamp) {
        if (timestamp == null) {
            return null;
        }

        return fastDateFormat.format(timestamp);
    }

    /**
     * Format Calendar into string representation.
     * Date time are formatted in UTC time zone.
     *
     * @param calendar Calendar
     * @return string representation of calendar.
     */
    public static String formatCalendar(Calendar calendar) {
        if (calendar == null) {
            return null;
        }

        return fastDateFormat.format(calendar);
    }

    private static Calendar newCalendar() {
        return Calendar.getInstance(TimeZoneConstants.UTC, Locale.US);
    }

    public static List<String> getRecentMonths(Integer monthNum){
        List<String> list = new ArrayList<String>();
        Calendar c = Calendar.getInstance();
        for(int i = 1; i <= monthNum; i ++){
            int k = c.get(Calendar.YEAR);
            int j = c.get(Calendar.MONTH) + 1 - i;
            String date = "";
            if(j >= 1){
                date = k + "-" + (j >= 10 ? "" : "0") + j;
            } else {
                int p = 12 - 1 - i;
                int m = c.get(Calendar.YEAR) - 1;
                int n = c.get(Calendar.MONTH) + 2 + p;
                date = m + "-" + (n >= 10 ? "" : "0") + n;
            }
            list.add(0, date);
        }
        return list;
    }
}
