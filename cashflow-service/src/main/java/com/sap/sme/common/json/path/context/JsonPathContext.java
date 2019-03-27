/**
 * Copyright (C) 1972-2017 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.json.path.context;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.Option;
import com.jayway.jsonpath.ParseContext;
import com.sap.sme.common.json.factory.ObjectMapperFactory;
import com.sap.sme.common.json.path.provider.JsonPathJsonProvider;
import com.sap.sme.common.json.path.provider.JsonPathMappingProvider;

/**
 * Helper utilities for JsonPath.
 *
 * @author I311334
 */
public class JsonPathContext {

    private static final Configuration configuration;

    private static ObjectMapper objectMapper;
    private static ObjectReader objectReader;

    static {
        objectMapper = ObjectMapperFactory.getInstance();
        objectReader = objectMapper.reader().forType(Object.class);

        configuration = Configuration
                .defaultConfiguration()
                .addOptions(Option.DEFAULT_PATH_LEAF_TO_NULL, Option.SUPPRESS_EXCEPTIONS)
                .jsonProvider(new JsonPathJsonProvider(objectMapper, objectReader))
                .mappingProvider(new JsonPathMappingProvider(objectMapper));
    }

    public static Configuration getConfiguration() {
        return configuration;
    }

    /**
     * Try to avoid following race condition issue.
     * https://github.com/json-path/JsonPath/issues/187
     * Will change to static ParseContext after v2.3.0 release.
     *
     * @return ParseContext
     */
    public static ParseContext parseContext() {
        return JsonPath.using(getConfiguration());
    }

}
