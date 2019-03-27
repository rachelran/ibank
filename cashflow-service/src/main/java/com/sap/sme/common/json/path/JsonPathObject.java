/**
 * Copyright (C) 1972-2017 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.json.path;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.EvaluationListener;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.MapFunction;
import com.jayway.jsonpath.Predicate;
import com.jayway.jsonpath.TypeRef;
import com.sap.sme.common.json.path.context.JsonPathContext;
import com.sap.sme.common.json.path.context.ParameterizedTypeRef;
import com.sap.sme.common.json.util.JsonUtils;

/**
 * @author I311334
 */
public class JsonPathObject implements DocumentContext {

    private static final JsonPath ROOT_PATH = JsonPath.compile("$");

    private DocumentContext documentContext;

    /**
     * Construct instance.
     *
     * @param documentContext DocumentContext
     */
    public JsonPathObject(DocumentContext documentContext) {
        super();
        this.documentContext = documentContext;
    }

    /**
     * Construct instance.
     *
     * @param json JSON string
     */
    public JsonPathObject(String json) {
        super();
        this.documentContext = JsonPathContext.parseContext().parse(json);
    }

    /**
     * Construct instance.
     *
     * @param object Object
     */
    public JsonPathObject(Object object) {
        super();
        this.documentContext = JsonPathContext.parseContext().parse(JsonUtils.toJson(object));
    }

    /**
     * Compile JsonPath path.
     *
     * @param path JsonPath path
     * @return compiled JsonPath path
     */
    public static JsonPath compilePath(String path) {
        return JsonPath.compile(path);
    }

    /**
     * Create new empty JSON in JsonPathObject.
     *
     * @return JsonPathObject
     */
    public static JsonPathObject newObject() {
        return new JsonPathObject("{}");
    }

    /**
     * Create new empty JSON Array in JsonPathObject.
     *
     * @return JsonPathObject
     */
    public static JsonPathObject newArray() {
        return new JsonPathObject("[]");
    }

    /**
     * Create JSON from object.
     *
     * @param object object
     * @return JsonPathObject
     */
    public static JsonPathObject parseObject(Object object) {
        return new JsonPathObject(JsonUtils.toJson(object));
    }

    /**
     * Set JSON from object.
     *
     * @param object object
     * @return this
     */
    public JsonPathObject fromObject(Object object) {
        this.documentContext = JsonPathContext.parseContext().parse(JsonUtils.toJson(object));
        return this;
    }

    /**
     * Get JSON as object.
     *
     * @param clazz class of return value
     * @param parameterClazzes parameterized class of return value
     * @return value
     */
    @SuppressWarnings("unchecked")
    public <T> T toObject(Class<?> clazz, Class<?>... parameterClazzes) {
        return (T) documentContext.read(ROOT_PATH, new ParameterizedTypeRef(clazz, parameterClazzes));
    }

    /**
     * Set JSON from string.
     *
     * @param json JSON string
     * @return this
     */
    public JsonPathObject fromJson(String json) {
        this.documentContext = JsonPathContext.parseContext().parse(json);
        return this;
    }

    /**
     * Generate JSON string from the JSON object.
     *
     * @return JSON string
     */
    public String toJson() {
        return documentContext.jsonString();
    }

    /**
     * Is the JSON object an array type.
     *
     * @return true if the JSON object is an array, false otherwise
     */
    public boolean isArray() {
        Object json = documentContext.json();
        if (json instanceof List) {
            return true;
        } else if (json instanceof Map) {
            return false;
        }

        return StringUtils.trimToEmpty(documentContext.jsonString()).startsWith("[");
    }

    public JsonPathObject set(String path, Object newValue) {
        documentContext.set(path, newValue);
        return this;
    }

    public JsonPathObject setObject(String path) {
        documentContext.set(path, new HashMap<>());
        return this;
    }

    public JsonPathObject setArray(String path) {
        documentContext.set(path, new ArrayList<>());
        return this;
    }

    public JsonPathObject add(String path, Object value) {
        documentContext.add(path, value);
        return this;
    }

    public JsonPathObject addObject(String path) {
        documentContext.add(path, new HashMap<>());
        return this;
    }

    public JsonPathObject addArray(String path) {
        documentContext.add(path, new ArrayList<>());
        return this;
    }

    public JsonPathObject put(String path, String key, Object value) {
        documentContext.put(path, key, value);
        return this;
    }

    public JsonPathObject putObject(String path, String key) {
        documentContext.put(path, key, new HashMap<>());
        return this;
    }

    public JsonPathObject putArray(String path, String key) {
        documentContext.put(path, key, new ArrayList<>());
        return this;
    }

    /**
     * Get value from JSON object.
     *
     * @param path compiled JsonPath path
     * @param clazz class of return value
     * @param parameterClazzes parameterized class of return value
     * @return value
     */
    @SuppressWarnings("unchecked")
    public <T> T get(JsonPath path, Class<?> clazz, Class<?>... parameterClazzes) {
        return (T) documentContext.read(path, new ParameterizedTypeRef(clazz, parameterClazzes));
    }

    /**
     * Get value from JSON object.
     *
     * @param path JsonPath path
     * @param clazz class of return value
     * @param parameterClazzes parameterized class of return value
     * @return value
     */
    @SuppressWarnings("unchecked")
    public <T> T get(String path, Class<?> clazz, Class<?>... parameterClazzes) {
        return (T) documentContext.read(path, new ParameterizedTypeRef(clazz, parameterClazzes));
    }

    /**
     * @return the documentContext
     */
    public DocumentContext getDocumentContext() {
        return documentContext;
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return toJson();
    }

    /**
     * @return
     * @see com.jayway.jsonpath.ReadContext#configuration()
     */
    @Override
    public Configuration configuration() {
        return documentContext.configuration();
    }

    /**
     * @return
     * @see com.jayway.jsonpath.ReadContext#json()
     */
    @Override
    public <T> T json() {
        return documentContext.json();
    }

    /**
     * @return
     * @see com.jayway.jsonpath.ReadContext#jsonString()
     */
    @Override
    public String jsonString() {
        return documentContext.jsonString();
    }

    /**
     * @param path
     * @param filters
     * @return
     * @see com.jayway.jsonpath.ReadContext#read(java.lang.String, com.jayway.jsonpath.Predicate[])
     */
    @Override
    public <T> T read(String path, Predicate... filters) {
        return documentContext.read(path, filters);
    }

    /**
     * @param path
     * @param newValue
     * @param filters
     * @return
     * @see com.jayway.jsonpath.WriteContext#set(java.lang.String, java.lang.Object, com.jayway.jsonpath.Predicate[])
     */
    @Override
    public JsonPathObject set(String path, Object newValue, Predicate... filters) {
        documentContext.set(path, newValue, filters);
        return this;
    }

    /**
     * @param path
     * @param type
     * @param filters
     * @return
     * @see com.jayway.jsonpath.ReadContext#read(java.lang.String, java.lang.Class, com.jayway.jsonpath.Predicate[])
     */
    @Override
    public <T> T read(String path, Class<T> type, Predicate... filters) {
        return documentContext.read(path, type, filters);
    }

    /**
     * @param path
     * @param newValue
     * @return
     * @see com.jayway.jsonpath.WriteContext#set(com.jayway.jsonpath.JsonPath, java.lang.Object)
     */
    @Override
    public JsonPathObject set(JsonPath path, Object newValue) {
        documentContext.set(path, newValue);
        return this;
    }

    /**
     * @param path
     * @param mapFunction
     * @param filters
     * @return
     * @see com.jayway.jsonpath.WriteContext#map(java.lang.String, com.jayway.jsonpath.MapFunction, com.jayway.jsonpath.Predicate[])
     */
    @Override
    public JsonPathObject map(String path, MapFunction mapFunction, Predicate... filters) {
        documentContext.map(path, mapFunction, filters);
        return this;
    }

    /**
     * @param path
     * @return
     * @see com.jayway.jsonpath.ReadContext#read(com.jayway.jsonpath.JsonPath)
     */
    @Override
    public <T> T read(JsonPath path) {
        return documentContext.read(path);
    }

    /**
     * @param path
     * @param type
     * @return
     * @see com.jayway.jsonpath.ReadContext#read(com.jayway.jsonpath.JsonPath, java.lang.Class)
     */
    @Override
    public <T> T read(JsonPath path, Class<T> type) {
        return documentContext.read(path, type);
    }

    /**
     * @param path
     * @param mapFunction
     * @return
     * @see com.jayway.jsonpath.WriteContext#map(com.jayway.jsonpath.JsonPath, com.jayway.jsonpath.MapFunction)
     */
    @Override
    public JsonPathObject map(JsonPath path, MapFunction mapFunction) {
        documentContext.map(path, mapFunction);
        return this;
    }

    /**
     * @param path
     * @param typeRef
     * @return
     * @see com.jayway.jsonpath.ReadContext#read(com.jayway.jsonpath.JsonPath, com.jayway.jsonpath.TypeRef)
     */
    @Override
    public <T> T read(JsonPath path, TypeRef<T> typeRef) {
        return documentContext.read(path, typeRef);
    }

    /**
     * @param path
     * @param filters
     * @return
     * @see com.jayway.jsonpath.WriteContext#delete(java.lang.String, com.jayway.jsonpath.Predicate[])
     */
    @Override
    public JsonPathObject delete(String path, Predicate... filters) {
        documentContext.delete(path, filters);
        return this;
    }

    /**
     * @param path
     * @param typeRef
     * @return
     * @see com.jayway.jsonpath.ReadContext#read(java.lang.String, com.jayway.jsonpath.TypeRef)
     */
    @Override
    public <T> T read(String path, TypeRef<T> typeRef) {
        return documentContext.read(path, typeRef);
    }

    /**
     * @param path
     * @return
     * @see com.jayway.jsonpath.WriteContext#delete(com.jayway.jsonpath.JsonPath)
     */
    @Override
    public JsonPathObject delete(JsonPath path) {
        documentContext.delete(path);
        return this;
    }

    /**
     * @param path
     * @param value
     * @param filters
     * @return
     * @see com.jayway.jsonpath.WriteContext#add(java.lang.String, java.lang.Object, com.jayway.jsonpath.Predicate[])
     */
    @Override
    public JsonPathObject add(String path, Object value, Predicate... filters) {
        documentContext.add(path, value, filters);
        return this;
    }

    /**
     * @param maxResults
     * @return
     * @see com.jayway.jsonpath.ReadContext#limit(int)
     */
    @Override
    public JsonPathObject limit(int maxResults) {
        documentContext = (DocumentContext) documentContext.limit(maxResults);
        return this;
    }

    /**
     * @param listener
     * @return
     * @see com.jayway.jsonpath.ReadContext#withListeners(com.jayway.jsonpath.EvaluationListener[])
     */
    @Override
    public JsonPathObject withListeners(EvaluationListener... listener) {
        documentContext = (DocumentContext) documentContext.withListeners(listener);
        return this;
    }

    /**
     * @param path
     * @param value
     * @return
     * @see com.jayway.jsonpath.WriteContext#add(com.jayway.jsonpath.JsonPath, java.lang.Object)
     */
    @Override
    public JsonPathObject add(JsonPath path, Object value) {
        documentContext.add(path, value);
        return this;
    }

    /**
     * @param path
     * @param key
     * @param value
     * @param filters
     * @return
     * @see com.jayway.jsonpath.WriteContext#put(java.lang.String, java.lang.String, java.lang.Object, com.jayway.jsonpath.Predicate[])
     */
    @Override
    public JsonPathObject put(String path, String key, Object value, Predicate... filters) {
        documentContext.put(path, key, value, filters);
        return this;
    }

    /**
     * @param path
     * @param key
     * @param value
     * @return
     * @see com.jayway.jsonpath.WriteContext#put(com.jayway.jsonpath.JsonPath, java.lang.String, java.lang.Object)
     */
    @Override
    public JsonPathObject put(JsonPath path, String key, Object value) {
        documentContext.put(path, key, value);
        return this;
    }

    /**
     * @param path
     * @param oldKeyName
     * @param newKeyName
     * @param filters
     * @return
     * @see com.jayway.jsonpath.WriteContext#renameKey(java.lang.String, java.lang.String, java.lang.String, com.jayway.jsonpath.Predicate[])
     */
    @Override
    public JsonPathObject renameKey(String path, String oldKeyName, String newKeyName, Predicate... filters) {
        documentContext.renameKey(path, oldKeyName, newKeyName, filters);
        return this;
    }

    /**
     * @param path
     * @param oldKeyName
     * @param newKeyName
     * @return
     * @see com.jayway.jsonpath.WriteContext#renameKey(com.jayway.jsonpath.JsonPath, java.lang.String, java.lang.String)
     */
    @Override
    public JsonPathObject renameKey(JsonPath path, String oldKeyName, String newKeyName) {
        documentContext.renameKey(path, oldKeyName, newKeyName);
        return this;
    }

}
