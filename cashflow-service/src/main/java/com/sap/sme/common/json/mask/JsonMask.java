/**
 * Copyright (C) 1972-2018 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.json.mask;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;

import com.sap.sme.common.json.mask.model.TypedJson;
import com.sap.sme.common.json.path.JsonPathObject;
import com.sap.sme.common.json.util.JsonUtils;
import com.sap.sme.common.logger.LightLogger;

/**
 * @author I311334
 */
public class JsonMask {

    private final LightLogger log = LightLogger.getLogger(this);

    private Map<String, JsonMasker> typeMaskerMap = new HashMap<>();
    private String maskText = "***MASKED***";

    public String maskToString(Object obj) {
        String json = null;
        try {
            json = getJsonString(obj);
        } catch (Exception e) {
            log.warn(e, "Error parse object to JSON. object[", obj, "]");
            return Objects.toString(obj);
        }

        try {
            JsonPathObject jsonPathObject = new JsonPathObject(json);

            JsonMasker masker = getMasker(obj);
            if (masker != null) {
                masker.mask(jsonPathObject);
            }

            return jsonPathObject.toJson();
        } catch (Exception e) {
            log.warn(e, "Error mask by JsonPathObject. objectJson[", json, "]");
            return json;
        }
    }

    private JsonMasker getMasker(Object obj) {
        if (obj == null) {
            return null;
        }

        String type = getType(obj);
        if (type != null) {
            return typeMaskerMap.get(type);
        }

        JsonMasker masker = typeMaskerMap.get(obj.getClass().getName());
        if (masker == null) {
            masker = typeMaskerMap.get(obj.getClass().getSimpleName());
        }
        return masker;
    }

    private String getType(Object obj) {
        if (obj instanceof TypedJson) {
            TypedJson typedJson = (TypedJson) obj;
            return typedJson.getType();
        } else if (obj instanceof String) {
            return "String/JSON";
        }

        return null;
    }

    private String getJsonString(Object obj) {
        if (obj instanceof TypedJson) {
            TypedJson typedJson = (TypedJson) obj;
            return typedJson.getJson();
        } else if (obj instanceof String) {
            return (String) obj;
        }

        return JsonUtils.toJson(obj);
    }

    public void setTypeMaskConfig(Map<String, List<String>> typeMaskConfig) {
        typeMaskerMap.clear();

        if (MapUtils.isEmpty(typeMaskConfig)) {
            return;
        }

        for (Map.Entry<String, List<String>> entry : typeMaskConfig.entrySet()) {
            String type = entry.getKey();
            List<String> pathList = entry.getValue();

            if (CollectionUtils.isEmpty(pathList)) {
                continue;
            }

            JsonMasker masker = new JsonMasker();
            masker.setPathList(pathList);
            masker.setMaskText(maskText);

            typeMaskerMap.put(type, masker);
        }
    }

    /**
     * @return the typeMaskerMap
     */
    public Map<String, JsonMasker> getTypeMaskerMap() {
        return typeMaskerMap;
    }

    /**
     * @param typeMaskerMap the typeMaskerMap to set
     */
    public void setTypeMaskerMap(Map<String, JsonMasker> typeMaskerMap) {
        this.typeMaskerMap = typeMaskerMap;
    }

    /**
     * @return the maskText
     */
    public String getMaskText() {
        return maskText;
    }

    /**
     * @param maskText the maskText to set
     */
    public void setMaskText(String maskText) {
        this.maskText = maskText;

        for (JsonMasker masker : typeMaskerMap.values()) {
            masker.setMaskText(maskText);
        }
    }

}
