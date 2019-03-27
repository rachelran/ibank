package com.sap.sme.common.json.factory;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.util.StdDateFormat;

/**
 * @author i311667 on 10/28/16.
 */
public final class ObjectMapperFactory {

    static final ObjectMapper objectMapper = create(new JsonFactory());

    private static ObjectMapper create(JsonFactory jsonFactory) {
        ObjectMapper objectMapper = new ObjectMapper(jsonFactory);
        objectMapper.setDateFormat(new StdDateFormat());

        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        objectMapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);

        return objectMapper;
    }

    public static ObjectMapper getInstance() {
        return objectMapper;
    }

}
