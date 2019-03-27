/**
 * Copyright (C) 1972-2016 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.sql;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.sap.sme.common.exception.InternalException;

/**
 * Native SQL Query builder.
 *
 * @author I311334
 */
public class QueryBuilder {

    protected static final String SQL_SELECT = "SELECT";
    protected static final String SQL_INSERT_INTO = "INSERT INTO";

    protected EntityManager entityManager;

    protected StringBuilder sqlBuf = new StringBuilder();
    protected Map<Integer, String> columnMap = new HashMap<Integer, String>();
    protected Set<String> columnKeySet = new HashSet<String>();
    protected List<Object> paramList = new ArrayList<Object>();

    protected Long limit = null;
    protected Long offset = null;

    protected StringBuilder sqlInsertColumnBuf = new StringBuilder();
    protected StringBuilder sqlInsertParamBuf = new StringBuilder();
    protected List<Object> sqlInsertParamList = new ArrayList<Object>();

    protected Long insertGeneratedId = null;

    /**
     * Construct instance.
     *
     * @param entityManager JPA entity manager
     */
    public QueryBuilder(EntityManager entityManager) {
        super();
        this.entityManager = entityManager;
    }

    /**
     * Append SQL string.
     *
     * @param sqls SQL string
     * @return this
     */
    public QueryBuilder sql(String... sqls) {
        String sql = StringUtils.trimToNull(StringUtils.join(sqls));
        if (sql == null) {
            return this;
        }

        if (hasSql()) {
            appendSql(" ");
        }
        appendSql(sql);

        return this;
    }

    /**
     * Append SQL column.
     *
     * @param column column name
     * @return this
     */
    public QueryBuilder column(String column) {
        return column(column, null);
    }

    /**
     * Append SQL column.
     *
     * @param column column name
     * @param alias column alias
     * @return this
     */
    public QueryBuilder column(String column, String alias) {
        column = StringUtils.trimToEmpty(column);
        alias = StringUtils.trimToNull(alias);

        String columnKey = (alias != null) ? alias : column;
        if (columnKeySet.contains(columnKey)) {
            throw new InternalException("columnKey[", columnKey, "] already exist in query");
        }

        if (columnMap.isEmpty()) {
            if (hasSql()) {
                appendSql(" ");
            }
        } else {
            appendSql(", ");
        }

        appendSql(column);

        if (alias != null) {
            appendSql(" AS ").appendSql(alias);
        }

        columnMap.put(columnMap.size(), columnKey);
        columnKeySet.add(columnKey);

        return this;
    }

    /**
     * Only set SQL parameter.
     * Call this after you add "?" into SQL.
     * qb.sql("SELECT name FROM user WHERE id = ?").p(userId);
     *
     * @param params SQL parameters
     * @return this
     */
    public QueryBuilder p(Object... params) {
        for (int i = 0; i < params.length; i++) {
            paramList.add(params[i]);
        }
        return this;
    }

    /**
     * Build SQL parameter.
     *
     * @param param SQL parameter
     * @return this
     */
    public QueryBuilder param(Object param) {
        if (hasSql()) {
            appendSql(" ");
        }

        appendSql("?");
        paramList.add(param);

        return this;
    }

    /**
     * Build SQL multiple parameters.
     *
     * @param params SQL multiple parameters
     * @return this
     */
    public QueryBuilder params(Object... params) {
        return params(Arrays.asList(params));
    }

    /**
     * Build SQL multiple parameters.
     *
     * @param paramList SQL multiple parameters
     * @return this
     */
    public <T> QueryBuilder params(Collection<T> paramList) {
        if (hasSql()) {
            appendSql(" ");
        }

        if (CollectionUtils.isEmpty(paramList)) {
            appendSql("(NULL)");
        } else {
            appendSql("(");
            for (int i = 0; i < paramList.size(); i++) {
                if (i > 0) {
                    appendSql(",");
                }
                appendSql("?");
            }
            appendSql(")");

            this.paramList.addAll(paramList);
        }

        return this;
    }

    /**
     * Build SQL IN clause.
     * <p>Deprecated, change your query from:
     * <pre>qb.sql("SELECT * FROM table_name WHERE id").in(id1, id2, id3)</pre>
     * Into:
     * <pre>qb.sql("SELECT * FROM table_name WHERE id IN").params(id1, id2, id3)</pre>
     *
     * @param params SQL IN parameters
     * @return this
     */
    @Deprecated
    public QueryBuilder in(Object... params) {
        return in(Arrays.asList(params));
    }

    /**
     * Build SQL IN clause.
     * <p>Deprecated, change your query from:
     * <pre>qb.sql("SELECT * FROM table_name WHERE id").in(idList)</pre>
     * Into:
     * <pre>qb.sql("SELECT * FROM table_name WHERE id IN").params(idList)</pre>
     *
     * @param paramList SQL IN parameter list
     * @return this
     */
    @Deprecated
    public <T> QueryBuilder in(Collection<T> paramList) {
        if (CollectionUtils.isEmpty(paramList)) {
            throw new InternalException("SQL IN paramList cannot be empty");
        }

        if (hasSql()) {
            appendSql(" ");
        }

        appendSql("IN (");
        for (int i = 0; i < paramList.size(); i++) {
            if (i > 0) {
                appendSql(",");
            }
            appendSql("?");
        }
        appendSql(")");

        this.paramList.addAll(paramList);

        return this;
    }

    /**
     * Build SQL SET parameter.
     *
     * @param column column name
     * @param value column value
     * @return this
     */
    public QueryBuilder set(String column, Object value) {
        column = StringUtils.trimToEmpty(column);

        if (isInsertSql()) {
            buildInsertSet(column, value);
        } else {
            buildUpdateSet(column, value);
        }

        return this;
    }

    /**
     * Build SQL SET parameters.
     *
     * @param columnParamMap column parameter map
     * @return this
     */
    public <K, V> QueryBuilder set(Map<K, V> columnParamMap) {
        for (Map.Entry<K, V> entry : columnParamMap.entrySet()) {
            String column = Objects.toString(entry.getKey(), "");
            Object param = entry.getValue();

            set(column, param);
        }
        return this;
    }

    /**
     * Set max query result size.
     *
     * @param limit max query result size. null means no limit
     * @return this
     */
    public QueryBuilder limit(Long limit) {
        this.limit = (limit == null) ? null : (limit < 0) ? null : limit;
        return this;
    }

    /**
     * Set offset of first result.
     *
     * @param offset offset of first result
     * @return this
     */
    public QueryBuilder offset(Long offset) {
        this.offset = (offset == null) ? null : (offset < 0) ? null : offset;
        return this;
    }

    /**
     * @return the limit
     */
    public Long getLimit() {
        return limit;
    }

    /**
     * @return the offset
     */
    public Long getOffset() {
        return offset;
    }

    /**
     * Get SQL string.
     *
     * @return SQL string
     */
    public String getSql() {
        if (hasSqlInsert()) {
            return sqlBuf.toString() + getSqlInsert();
        } else if (isSelectSql()) {
            return sqlBuf.toString() + getSqlPaging();
        } else {
            return sqlBuf.toString();
        }
    }

    /**
     * Get SQL column map.
     *
     * @return SQL column map
     */
    public Map<Integer, String> getColumnMap() {
        return columnMap;
    }

    /**
     * Get SQL parameter list.
     *
     * @return SQL parameter list
     */
    public List<Object> getParamList() {
        return paramList;
    }

    /**
     * Set SQL query parameters.
     *
     * @param query SQL query
     */
    public void setQueryParam(Query query) {
        for (int i = 0; i < paramList.size(); i++) {
            query.setParameter(i + 1, paramList.get(i));
        }

        Long limit = this.limit;
        Long offset = this.offset;
        if ((limit == null) && (offset != null)) {
            limit = Long.MAX_VALUE;
        }
        if (limit != null) {
            query.setParameter(paramList.size() + 1, limit);
        }
        if (offset != null) {
            query.setParameter(paramList.size() + 2, offset);
        }
    }

    /**
     * Map SQL query result list with column name.
     *
     * @param dataList SQL query result list
     * @return result list with column name
     */
    public List<QueryResult> mapResultList(List<Object> dataList) {
        List<QueryResult> resultList = new ArrayList<QueryResult>();
        if (CollectionUtils.isEmpty(dataList)) {
            return resultList;
        }

        if (columnMap.isEmpty()) {
            for (Object data : dataList) {
                if (data.getClass().isArray()) {
                    Object[] datas = (Object[]) data;

                    QueryResult result = new QueryResult();
                    for (int i = 0; i < datas.length; i++) {
                        result.put(String.valueOf(i), datas[i]);
                    }

                    resultList.add(result);
                } else {
                    QueryResult result = new QueryResult();
                    result.put("0", data);

                    resultList.add(result);
                }
            }
            return resultList;
        } else if (columnMap.size() == 1) {
            for (Object data : dataList) {
                QueryResult result = new QueryResult();
                result.put(columnMap.get(0), data);

                resultList.add(result);
            }
        } else {
            for (Object data : dataList) {
                Object[] datas = (Object[]) data;

                QueryResult result = new QueryResult();
                for (int i = 0; i < datas.length; i++) {
                    result.put(columnMap.get(i), datas[i]);
                }

                resultList.add(result);
            }
        }

        return resultList;
    }

    /**
     * Get first cell in query result.
     *
     * @return first cell in query result, or null if no result exist
     */
    public <T> T getFirstCell() {
        List<T> resultList = getFirstColumnList();
        return CollectionUtils.isEmpty(resultList) ? null : resultList.get(0);
    }

    /**
     * Get list of first column in query result.
     *
     * @return list of first column in query result, or null if no result exist
     */
    @SuppressWarnings("unchecked")
    public <T> List<T> getFirstColumnList() {
        Query query = entityManager.createNativeQuery(finishSql());
        setQueryParam(query);

        List<T> resultList = new ArrayList<T>();
        List<Object> dataList = query.getResultList();
        if (CollectionUtils.isEmpty(dataList)) {
            return resultList;
        }

        for (int i = 0; i < dataList.size(); i++) {
            Object data = dataList.get(i);
            if (data == null) {
                resultList.add(null);
            } else if (data.getClass().isArray()) {
                Object[] datas = (Object[]) data;
                resultList.add((T) ((datas.length > 0) ? datas[0] : null));
            } else {
                resultList.add((T) data);
            }
        }

        return resultList;
    }

    /**
     * Get first query result.
     *
     * @return first query result, return null if no result exist
     */
    public QueryResult getFirstResult() {
        List<QueryResult> resultList = getResultList();
        return resultList.isEmpty() ? null : resultList.get(0);
    }

    /**
     * Get all query results.
     *
     * @return all query results, return empty list if no result exist
     */
    public List<QueryResult> getResultList() {
        Query query = entityManager.createNativeQuery(finishSql());
        setQueryParam(query);

        @SuppressWarnings("unchecked")
        List<Object> dataList = query.getResultList();
        return mapResultList(dataList);
    }

    /**
     * Execute update SQL.
     *
     * @return affected rows
     */
    public int executeUpdate() {
        Query query = entityManager.createNativeQuery(finishSql());
        setQueryParam(query);

        int rowsAffected = query.executeUpdate();
        if ((rowsAffected > 0) && isInsertSql()) {
            insertGeneratedId = queryLastGeneratedId();
        } else {
            insertGeneratedId = null;
        }

        return rowsAffected;
    }

    /**
     * Query ID generated by last INSERT statement in current connection.
     *
     * @return latest generated ID, return 0 if no ID ever generated in current connection
     */
    public long queryLastGeneratedId() {
        Query query = entityManager.createNativeQuery("SELECT LAST_INSERT_ID()");
        return NativeSqlUtils.toLong(query.getSingleResult());
    }

    /**
     * @return the insertGeneratedId
     */
    public Long getInsertGeneratedId() {
        return insertGeneratedId;
    }

    /**
     * Create native SQL query.
     *
     * @return native SQL query with parameters set
     */
    public Query createNativeQuery() {
        Query query = entityManager.createNativeQuery(finishSql());
        setQueryParam(query);
        return query;
    }

    protected boolean hasSql() {
        appendSqlInsert();
        return sqlBuf.length() > 0;
    }

    protected QueryBuilder appendSql(String sql) {
        appendSqlInsert();
        sqlBuf.append(sql);
        return this;
    }

    protected String finishSql() {
        appendSqlInsert();
        return sqlBuf.toString() + getSqlPaging();
    }

    protected void appendSqlInsert() {
        if (hasSqlInsert()) {
            sqlBuf.append(getSqlInsert());
            paramList.addAll(sqlInsertParamList);

            sqlInsertColumnBuf.setLength(0);
            sqlInsertParamBuf.setLength(0);
            sqlInsertParamList.clear();
        }
    }

    protected boolean isInsertSql() {
        return isSqlStartWith(SQL_INSERT_INTO);
    }

    protected void buildInsertSet(String column, Object value) {
        if (value == null) {
            return;
        }

        if (hasSqlInsert()) {
            sqlInsertColumnBuf.append(", ");
            sqlInsertParamBuf.append(", ");
        }

        sqlInsertColumnBuf.append(column);
        sqlInsertParamBuf.append("?");
        sqlInsertParamList.add(value);
    }

    protected void buildUpdateSet(String column, Object value) {
        if (sqlBuf.charAt(sqlBuf.length() - 1) == '?') {
            appendSql(", ");
        } else {
            appendSql(" ");
        }

        appendSql(column).appendSql("=?");
        paramList.add(value);
    }

    protected boolean hasSqlInsert() {
        return CollectionUtils.isNotEmpty(sqlInsertParamList);
    }

    protected String getSqlInsert() {
        return " (" + sqlInsertColumnBuf + ") VALUES (" + sqlInsertParamBuf + ")";
    }

    protected boolean isSelectSql() {
        return isSqlStartWith(SQL_SELECT);
    }

    protected String getSqlPaging() {
        StringBuilder buf = new StringBuilder();
        if ((limit != null) || (offset != null)) {
            buf.append(" LIMIT ?");
        }
        if (offset != null) {
            buf.append(" OFFSET ?");
        }

        return buf.toString();
    }

    protected boolean isSqlStartWith(String sql) {
        if (sqlBuf.length() < sql.length()) {
            return false;
        }

        String sqlPrefix = sqlBuf.substring(0, sql.length());
        if (StringUtils.equalsIgnoreCase(sqlPrefix, sql)) {
            return true;
        }

        return false;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String toString() {
        return "QueryBuilder [sql=" + getSql() + ", paramList=" + paramList + "]";
    }

}
