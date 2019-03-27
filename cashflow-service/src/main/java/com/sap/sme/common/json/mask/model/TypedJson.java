/**
 * Copyright (C) 1972-2018 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.json.mask.model;

/**
 * @author I311334
 */
public class TypedJson {

    private String type;

    private String json;

    /**
     * Construct instance.
     *
     */
    public TypedJson() {
        super();
    }

    /**
     * Construct instance.
     *
     * @param type
     * @param json
     */
    public TypedJson(String type, String json) {
        super();
        this.type = type;
        this.json = json;
    }

    /**
     * Construct instance.
     *
     * @param clazz
     * @param json
     */
    public TypedJson(Class<?> clazz, String json) {
        super();
        this.type = clazz.getName();
        this.json = json;
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
     * @return the json
     */
    public String getJson() {
        return json;
    }

    /**
     * @param json the json to set
     */
    public void setJson(String json) {
        this.json = json;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String toString() {
        return "TypedJson [type=" + type + ", json=" + json + "]";
    }

}
