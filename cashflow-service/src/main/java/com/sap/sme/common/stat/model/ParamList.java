/**
 * Copyright (C) 1972-2016 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.stat.model;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

/**
 * @author I311334
 */
public class ParamList {

    private List<ParamLine> paramLineList = new ArrayList<>();
    private int maxParamKeyLength = 0;

    public void add(String key, Object value) {
        addLine(new ParamLine(key, value));
    }

    public void add(Object value) {
        add("", value);
    }

    public void addSplit() {
        add("", "--------------------");
    }

    public void addLine(ParamLine paramLine) {
        paramLineList.add(paramLine);
        maxParamKeyLength = Math.max(maxParamKeyLength, paramLine.getKeyLength());
    }

    public void addAllLine(ParamList paramList) {
        for (ParamLine paramLine : paramList.getParamLineList()) {
            addLine(paramLine);
        }
    }

    public void genLog(StringBuilder buf, int level) {
        for (ParamLine paramLine : paramLineList) {
            String key = paramLine.getKey();
            String value = paramLine.getValue();

            for (int i = 0; i < level; i++) {
                buf.append("  ");
            }

            if (StringUtils.isBlank(key) && StringUtils.isBlank(value)) {
                buf.append("\n");
            } else if (StringUtils.isBlank(key)) {
                buf.append(value).append("\n");
            } else {
                buf.append(StringUtils.rightPad(paramLine.getKey(), maxParamKeyLength)).append(": ").append(value).append("\n");
            }
        }
    }

    /**
     * @return the paramLineList
     */
    public List<ParamLine> getParamLineList() {
        return paramLineList;
    }

    /**
     * @return the maxParamKeyLength
     */
    public int getMaxParamKeyLength() {
        return maxParamKeyLength;
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "ParamList [paramLineList="
                + paramLineList
                + ", maxParamKeyLength="
                + maxParamKeyLength
                + "]";
    }

}
