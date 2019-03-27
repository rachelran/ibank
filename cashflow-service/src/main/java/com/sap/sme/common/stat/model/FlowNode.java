/**
 * Copyright (C) 1972-2016 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.stat.model;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections4.CollectionUtils;

import com.sap.sme.common.stat.constant.FlowStatisticsResult;
import com.sap.sme.common.stat.util.FlowStatUtils;

/**
 * @author I311334
 */
public class FlowNode {

    private int index = -1;

    private String type;
    private String name;

    private long startTime = 0;
    private long endTime = 0;
    private long executeTime = 0;

    private long lastStartTime = 0;

    private String result = FlowStatisticsResult.RUNNING;
    private ParamList paramList = new ParamList();

    private int level = 0;

    private FlowNode parent = null;

    private List<FlowNode> childList = new ArrayList<>();

    /**
     * Construct instance.
     *
     */
    public FlowNode() {
        super();
    }

    /**
     * Construct instance.
     *
     * @param name
     * @param type
     */
    public FlowNode(int index, String type, String name) {
        super();
        this.index = index;
        this.type = type;
        this.name = name;
    }

    public void enter() {
        result = FlowStatisticsResult.RUNNING;

        long currentTime = System.currentTimeMillis();
        if (startTime == 0) {
            startTime = currentTime;
        }
        lastStartTime = currentTime;
    }

    public void exit(String result) {
        this.result = result;

        long currentTime = System.currentTimeMillis();
        endTime = currentTime;
        if (lastStartTime != 0) {
            executeTime += currentTime - lastStartTime;
            lastStartTime = 0;
        }
    }

    public void param(String key, Object value) {
        paramList.add(key, value);
    }

    public void child(FlowNode child) {
        child.level = this.level + 1;
        child.parent = this;
        childList.add(child);
    }

    public boolean isLeaf() {
        return CollectionUtils.isEmpty(childList);
    }

    public long getTotalTime() {
        if (startTime == 0) {
            return 0;
        } else if (lastStartTime != 0) {
            return System.currentTimeMillis() - startTime;
        } else {
            return endTime - startTime;
        }
    }

    public String genExecuteTime() {
        return FlowStatUtils.formatTime(getExecuteTime());
    }

    public void addTo(ParamList toParamList) {
        toParamList.add("Type", getType());
        toParamList.add("Name", getName());
        toParamList.add("Result", getResult());
        toParamList.add("Time", genExecuteTime());
        toParamList.addAllLine(paramList);
    }

    public void clear() {
        for (FlowNode child : childList) {
            child.clear();
        }
        childList.clear();
        parent = null;
    }

    /**
     * @return the index
     */
    public int getIndex() {
        return index;
    }

    /**
     * @param index the index to set
     */
    public void setIndex(int index) {
        this.index = index;
    }

    /**
     * @return the type
     */
    public String getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the startTime
     */
    public long getStartTime() {
        return startTime;
    }

    /**
     * @param startTime the startTime to set
     */
    public void setStartTime(long startTime) {
        this.startTime = startTime;
    }

    /**
     * @return the endTime
     */
    public long getEndTime() {
        return endTime;
    }

    /**
     * @param endTime the endTime to set
     */
    public void setEndTime(long endTime) {
        this.endTime = endTime;
    }

    /**
     * @return the executeTime
     */
    public long getExecuteTime() {
        return executeTime;
    }

    /**
     * @param executeTime the executeTime to set
     */
    public void setExecuteTime(long executeTime) {
        this.executeTime = executeTime;
    }

    /**
     * @return the result
     */
    public String getResult() {
        return result;
    }

    /**
     * @param result the result to set
     */
    public void setResult(String result) {
        this.result = result;
    }

    /**
     * @return the level
     */
    public int getLevel() {
        return level;
    }

    /**
     * @param level the level to set
     */
    public void setLevel(int level) {
        this.level = level;
    }

    /**
     * @return the parent
     */
    public FlowNode getParent() {
        return parent;
    }

    /**
     * @param parent the parent to set
     */
    public void setParent(FlowNode parent) {
        this.parent = parent;
    }

    /**
     * @return the childList
     */
    public List<FlowNode> getChildList() {
        return childList;
    }

    /**
     * @param childList the childList to set
     */
    public void setChildList(List<FlowNode> childList) {
        this.childList = childList;
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "FlowNode [index="
                + index
                + ", type="
                + type
                + ", name="
                + name
                + ", startTime="
                + startTime
                + ", endTime="
                + endTime
                + ", executeTime="
                + executeTime
                + ", lastStartTime="
                + lastStartTime
                + ", result="
                + result
                + ", level="
                + level
                + ", childList="
                + childList
                + "]";
    }

}
