package com.sap.sme.ilab.cashflow.datasource.service.impl;

import java.util.Properties;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.web.client.RestTemplate;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sap.sme.common.logger.LightLogger;
import com.sap.sme.common.spring.SpringProfileUtil;
import com.sap.sme.ilab.cashflow.datasource.domain.HttpHeadPack;
import com.sap.sme.ilab.cashflow.datasource.domain.SchemaData;
import com.sap.sme.ilab.cashflow.datasource.service.DataSourceService;


public class MssqlDataSourceServiceImpl implements DataSourceService {

    private final LightLogger log = LightLogger.getLogger(this);

    @Resource(name="myProperties")
    private Properties myProperties;
    private String dbDriverClassName = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
    private static RestTemplate restTemplate =  new RestTemplate();
    private static HttpHeadPack headpack = new HttpHeadPack();
    @Autowired
    private Environment environment;
    /**
     * Construct instance.
     */
    public MssqlDataSourceServiceImpl() {
        super();
    }

    @Override
    public DataSource createDataSource(String tenantId) {
        return genDataSource(tenantId);
    }

    private DataSource genDataSource(String tenantId) {
        SchemaData myschema = getSchemaData(tenantId);
        if (null == myschema) {
            log.info("Schema not exist for tenant[", tenantId, "].");
            return null;
        }

        try {
            DriverManagerDataSource dataSource = new DriverManagerDataSource(genUrl(myschema), myschema.getDbuser(), myschema.getDbpwd());
            myschema = null;
            dataSource.setDriverClassName(dbDriverClassName);
            return dataSource;
        } catch (Exception e) {
            log.error(e, "Error create data source.");
            throw e;
        }
    }

    private String genUrl(SchemaData myschema) {
        String dburl = "jdbc:sqlserver://"+myschema.getHost()+":"+myschema.getPort()+";DatabaseName="+myschema.getSchema();
        return dburl;
    }

    public SchemaData getSchemaData(String tenantId) {

        SchemaData myschema = new SchemaData();
        if (SpringProfileUtil.isLocal()) {
            myschema.setHost(myProperties.getProperty("MSSQL_HOST"));
            myschema.setPort(myProperties.getProperty("MSSQL_PORT"));
            myschema.setSchema(myProperties.getProperty("MSSQL_SCHEMA"));
            myschema.setDbuser(myProperties.getProperty("MSSQL_DB_USR"));
            myschema.setDbpwd(myProperties.getProperty("MSSQL_DB_PWD"));
        } else {
            setSchema(tenantId,myschema);
        }

        return myschema;
    }

    public ResponseEntity<String> getTenants() {
        try {
            HttpEntity <Object> entity = headpack.createHttpHead();
            String dbUrl = "http://"+myProperties.getProperty("TENANT_SERVICE_HOST")+":"+myProperties.getProperty("TENANT_SERVICE_PORT")+"/api/tenants";
            return restTemplate.exchange(dbUrl,HttpMethod.GET,entity, String.class);
        } catch(Exception e) {
            log.error(e, "fails to get Tenants.");
            return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public String setSchema(String tenantId,SchemaData myschema) {
        String result = getTenants().getBody();
        if(null == result) return null;
        JsonObject data = new JsonParser().parse(result).getAsJsonObject();
        if(null == data) return null;
        if(null == (data = data.get("data").getAsJsonObject())) return null;

        JsonArray array = data.get("tenants").getAsJsonArray();
        if(null == array) return null;

        for(JsonElement jsonElement : array){
            JsonObject jo = jsonElement.getAsJsonObject();
            if(tenantId.equals(jo.get("name").getAsString())) {
                myschema.setHost(jo.get("host").getAsString());
                myschema.setPort(jo.get("port").getAsString());
                myschema.setSchema(jo.get("companyDB").getAsString());
                myschema.setDbuser(jo.get("dbuser").getAsString());
                myschema.setDbpwd(jo.get("dbpwd").getAsString());
                return jo.get("companyDB").getAsString();
            }
        }
        return null;
    }

}
