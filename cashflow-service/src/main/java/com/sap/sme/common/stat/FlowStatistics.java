/**
 * Copyright (C) 1972-2016 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.stat;

import com.sap.sme.common.stat.constant.FlowStatisticsResult;
import com.sap.sme.common.stat.util.FlowStatUtils;

/**
 * <pre>
 * int statIndex = FlowStatistics.enter("EShopSync", "Product.UPDATE");
 * try {
 *     // Execute business.
 *
 *     FlowStatistics.exit(statIndex, true);
 * } catch (Exception e) {
 *     FlowStatistics.exit(statIndex, false);
 *     // Handle exception.
 * } finally {
 *     FlowStatistics.finish(statIndex);
 * }
 * <pre>
 * @author I311334
 */
public class FlowStatistics {

    private static ThreadLocal<FlowStatisticsManager> flowStatisticsManagerHolder = new ThreadLocal<>();

    public static int enter(String type, String name) {
        FlowStatisticsManager stat = flowStatisticsManagerHolder.get();
        if (stat == null) {
            stat = new FlowStatisticsManager();
            flowStatisticsManagerHolder.set(stat);
        }

        return stat.enter(type, name);
    }

    public static int enterInFlow(String type, String name) {
        FlowStatisticsManager stat = flowStatisticsManagerHolder.get();
        if (stat == null) {
            return -1;
        }

        return stat.enter(type, name);
    }

    public static void exit(int statIndex, boolean success) {
        exit(statIndex, success ? FlowStatisticsResult.SUCCESS : FlowStatisticsResult.ERROR);
    }

    public static void exit(int statIndex, String result) {
        FlowStatisticsManager stat = flowStatisticsManagerHolder.get();
        if (stat == null) {
            return;
        }

        stat.exit(statIndex, result);
    }

    public static void reEnter(int statIndex) {
        FlowStatisticsManager stat = flowStatisticsManagerHolder.get();
        if (stat == null) {
            return;
        }

        stat.reEnter(statIndex);
    }

    public static void reExit(int statIndex, String result) {
        FlowStatisticsManager stat = flowStatisticsManagerHolder.get();
        if (stat == null) {
            return;
        }

        stat.reExit(statIndex, result);
    }

    public static void param(int statIndex, String key, Object value) {
        FlowStatisticsManager stat = flowStatisticsManagerHolder.get();
        if (stat == null) {
            return;
        }

        stat.param(statIndex, key, value);
    }

    public static boolean isInFlow() {
        return flowStatisticsManagerHolder.get() != null;
    }

    public static long getExecuteTime(int statIndex) {
        FlowStatisticsManager stat = flowStatisticsManagerHolder.get();
        if (stat == null) {
            return -1;
        }

        return stat.getExecuteTime(statIndex);
    }

    public static String getExecuteTimeAsStr(int statIndex) {
        return FlowStatUtils.formatTime(getExecuteTime(statIndex));
    }

    public static long getTotalTime(int statIndex) {
        FlowStatisticsManager stat = flowStatisticsManagerHolder.get();
        if (stat == null) {
            return -1;
        }

        return stat.getTotalTime(statIndex);
    }

    public static String getTotalTimeAsStr(int statIndex) {
        return FlowStatUtils.formatTime(getTotalTime(statIndex));
    }

    public static void logStatistics() {
        FlowStatisticsManager stat = flowStatisticsManagerHolder.get();
        if (stat == null) {
            return;
        }
        stat.logStatistics();
    }

    public static void finish(int statIndex) {
        finish(statIndex, true);
    }

    public static void finish(int statIndex, boolean logStat) {
        FlowStatisticsManager stat = flowStatisticsManagerHolder.get();
        if (stat == null) {
            return;
        }

        if (stat.isRootIndex(statIndex)) {
            if (logStat) {
                stat.logStatistics();
            }

            clear();
        }
    }

    public static void clear() {
        FlowStatisticsManager stat = flowStatisticsManagerHolder.get();
        if (stat == null) {
            return;
        }

        stat.clear();
        flowStatisticsManagerHolder.set(null);
    }

    public static FlowStatisticsManager getFlowStatistics() {
        return flowStatisticsManagerHolder.get();
    }

}
