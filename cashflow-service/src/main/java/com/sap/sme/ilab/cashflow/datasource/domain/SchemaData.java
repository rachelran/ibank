package com.sap.sme.ilab.cashflow.datasource.domain;

public class SchemaData {
    private String host;
    private String port;
    private String schema;
    private String dbuser;
    private String dbpwd;
    
    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }
    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }
    public String getSchema() {
        return schema;
    }

    public void setSchema(String schema) {
        this.schema = schema;
    }
    public String getDbuser() {
        return dbuser;
    }

    public void setDbuser(String dbuser) {
        this.dbuser = dbuser;
    }
    public String getDbpwd() {
        return dbpwd;
    }

    public void setDbpwd(String dbpwd) {
        this.dbpwd = dbpwd;
    }
    
    @Override
    public String toString() {
        return "SchemaData [host="
                + host
                + ", port="
                + port
                + ", schema="
                + schema
                + ", dbuser="
                + dbuser
                + ", dbpwd="
                + dbpwd
                + "]";
    }
}
