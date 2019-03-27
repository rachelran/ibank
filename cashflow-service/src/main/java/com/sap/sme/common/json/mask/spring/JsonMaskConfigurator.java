/**
 * Copyright (C) 1972-2018 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.json.mask.spring;

import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Lazy;

import com.sap.sme.common.json.mask.ContextJsonMask;
import com.sap.sme.common.json.mask.JsonMask;

/**
 * @author I311334
 */
@Lazy(false)
public class JsonMaskConfigurator implements InitializingBean {

    private Map<String, List<String>> defaultTypeMaskConfig;
    private String defaultMaskText = "***MASKED***";

    /**
     * {@inheritDoc}
     */
    @Override
    public void afterPropertiesSet() throws Exception {
        if (MapUtils.isEmpty(defaultTypeMaskConfig)) {
            return;
        }

        JsonMask defaultJsonMask = new JsonMask();
        defaultJsonMask.setTypeMaskConfig(defaultTypeMaskConfig);
        defaultJsonMask.setMaskText(defaultMaskText);

        ContextJsonMask.setDefault(defaultJsonMask);
    }

    /**
     * @return the defaultTypeMaskConfig
     */
    public Map<String, List<String>> getDefaultTypeMaskConfig() {
        return defaultTypeMaskConfig;
    }

    /**
     * @param defaultTypeMaskConfig the defaultTypeMaskConfig to set
     */
    public void setDefaultTypeMaskConfig(Map<String, List<String>> defaultTypeMaskConfig) {
        this.defaultTypeMaskConfig = defaultTypeMaskConfig;
    }

    /**
     * @return the defaultMaskText
     */
    public String getDefaultMaskText() {
        return defaultMaskText;
    }

    /**
     * @param defaultMaskText the defaultMaskText to set
     */
    public void setDefaultMaskText(String defaultMaskText) {
        this.defaultMaskText = defaultMaskText;
    }

}
