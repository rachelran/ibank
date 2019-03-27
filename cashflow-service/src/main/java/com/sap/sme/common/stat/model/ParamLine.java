/**
 * Copyright (C) 1972-2016 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.stat.model;

import java.util.Objects;

/**
 * @author I311334
 */
public class ParamLine {

    private String key;

    private String value;

    /**
     * Construct instance.
     *
     * @param key
     * @param value
     */
    public ParamLine(String key, Object value) {
        super();
        this.key = Objects.toString(key, "");
        this.value = Objects.toString(value, "");
    }

    public int getKeyLength() {
        if (key == null) {
            return 0;
        }
        return key.length();
    }

    /**
     * @return the key
     */
    public String getKey() {
        return key;
    }

    /**
     * @param key the key to set
     */
    public void setKey(String key) {
        this.key = key;
    }

    /**
     * @return the value
     */
    public String getValue() {
        return value;
    }

    /**
     * @param value the value to set
     */
    public void setValue(String value) {
        this.value = value;
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "ParamLine [key=" + key + ", value=" + value + "]";
    }

}
