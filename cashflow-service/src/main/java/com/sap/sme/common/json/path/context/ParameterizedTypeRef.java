/**
 * Copyright (C) 1972-2017 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.json.path.context;

import com.jayway.jsonpath.TypeRef;

/**
 * @author I311334
 */
public class ParameterizedTypeRef extends TypeRef<Object> {

    private Class<?> clazz;
    private Class<?>[] parameterClazzes;

    /**
     * Construct instance.
     *
     * @param clazz
     * @param parameterClazzes
     */
    public ParameterizedTypeRef(Class<?> clazz, Class<?>[] parameterClazzes) {
        super();
        this.clazz = clazz;
        this.parameterClazzes = parameterClazzes;
    }

    /**
     * @return the clazz
     */
    public Class<?> getClazz() {
        return clazz;
    }

    /**
     * @return the parameterClazzes
     */
    public Class<?>[] getParameterClazzes() {
        return parameterClazzes;
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "ParameterizedTypeRef [clazz="
                + clazz
                + ", parameterClazzes="
                + parameterClazzes
                + "]";
    }

}
