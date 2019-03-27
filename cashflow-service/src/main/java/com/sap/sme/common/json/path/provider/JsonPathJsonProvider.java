/**
 * Copyright (C) 1972-2017 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.json.path.provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.jayway.jsonpath.spi.json.JacksonJsonProvider;

/**
 * @author I311334
 */
public class JsonPathJsonProvider extends JacksonJsonProvider {

    /**
     * Construct instance.
     *
     * @param objectMapper
     * @param objectReader
     */
    public JsonPathJsonProvider(ObjectMapper objectMapper, ObjectReader objectReader) {
        super(objectMapper, objectReader);
    }

}
