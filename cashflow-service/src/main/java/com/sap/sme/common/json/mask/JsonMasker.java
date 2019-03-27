/**
 * Copyright (C) 1972-2018 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.json.mask;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.jayway.jsonpath.JsonPath;
import com.sap.sme.common.json.path.JsonPathObject;

/**
 * @author I311334
 */
public class JsonMasker {

    private List<String> pathList = new ArrayList<>();
    private String maskText = "***MASKED***";

    private List<JsonPath> jsonPathList = new ArrayList<>();
    private List<JsonPath> jsonPathForArrayList = new ArrayList<>();

    public void mask(JsonPathObject jsonPathObject) {
        if (CollectionUtils.isEmpty(jsonPathList)) {
            return;
        }

        List<JsonPath> maskPathList = jsonPathObject.isArray() ? jsonPathForArrayList : jsonPathList;
        for (JsonPath jsonPath : maskPathList) {
            if (jsonPathObject.get(jsonPath, null) == null) {
                continue;
            }

            jsonPathObject.set(jsonPath, maskText);
        }
    }

    protected void compileJsonPath() {
        jsonPathList.clear();
        for (String path : pathList) {

            jsonPathList.add(JsonPathObject.compilePath(path));
            jsonPathForArrayList.add(toArrayPath(path));
        }
    }

    protected JsonPath toArrayPath(String path) {
        if (path.startsWith("$[*]") || path.startsWith("$.[*]") || path.startsWith("[*]")) {
            return JsonPathObject.compilePath(path);
        } else if (path.startsWith("$")) {
            path = StringUtils.replaceOnce(path, "$", "$[*]");
            return JsonPathObject.compilePath(path);
        } else {
            path = "$[*]." + path;
            return JsonPathObject.compilePath(path);
        }
    }

    /**
     * @return the pathList
     */
    public List<String> getPathList() {
        return new ArrayList<>(pathList);
    }

    /**
     * @param pathList the pathList to set
     */
    public void setPathList(List<String> pathList) {
        this.pathList.clear();
        if (pathList != null) {
            this.pathList.addAll(pathList);

            compileJsonPath();
        }
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
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String toString() {
        return "JsonMasker [pathList=" + pathList + ", maskText=" + maskText + "]";
    }

}
