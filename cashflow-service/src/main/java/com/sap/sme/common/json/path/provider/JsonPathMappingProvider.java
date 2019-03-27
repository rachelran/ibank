/**
 * Copyright (C) 1972-2017 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.json.path.provider;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.TypeRef;
import com.jayway.jsonpath.spi.mapper.JacksonMappingProvider;
import com.jayway.jsonpath.spi.mapper.MappingException;
import com.sap.sme.common.json.path.context.ParameterizedTypeRef;

/**
 * @author I311334
 */
public class JsonPathMappingProvider extends JacksonMappingProvider {

    protected ObjectMapper objectMapper;

    /**
     * Construct instance.
     *
     * @param objectMapper
     */
    public JsonPathMappingProvider(ObjectMapper objectMapper) {
        super(objectMapper);
        this.objectMapper = objectMapper;
    }

    /* (non-Javadoc)
     * @see com.jayway.jsonpath.spi.mapper.JacksonMappingProvider#map(java.lang.Object, com.jayway.jsonpath.TypeRef, com.jayway.jsonpath.Configuration)
     */
    @SuppressWarnings("unchecked")
    @Override
    public <T> T map(Object source, TypeRef<T> targetType, Configuration configuration) {
        if(source == null){
            return null;
        }

        if (targetType instanceof ParameterizedTypeRef) {
            ParameterizedTypeRef typeRef = (ParameterizedTypeRef) targetType;

            Class<?> clazz = typeRef.getClazz();
            if (clazz == null) {
                return (T) source;
            }

            Class<?>[] parameterClazzes = typeRef.getParameterClazzes();
            JavaType type = objectMapper.getTypeFactory().constructParametricType(clazz, parameterClazzes);

            try {
                return (T) objectMapper.convertValue(source, type);
            } catch (Exception e) {
                throw new MappingException(e);
            }
        } else {
            return super.map(source, targetType, configuration);
        }
    }

}
