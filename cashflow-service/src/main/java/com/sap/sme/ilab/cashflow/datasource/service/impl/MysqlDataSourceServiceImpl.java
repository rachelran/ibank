package com.sap.sme.ilab.cashflow.datasource.service.impl;

import java.util.Properties;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.springframework.jdbc.datasource.DriverManagerDataSource;

import com.sap.sme.common.logger.LightLogger;
import com.sap.sme.ilab.cashflow.datasource.service.DataSourceService;

public class MysqlDataSourceServiceImpl implements DataSourceService {

    private final LightLogger log = LightLogger.getLogger(this);

    @Resource(name="myProperties")
    private Properties myProperties;

    private String dbDriverClassName = "com.mysql.cj.jdbc.Driver";

    /**
     * Construct instance.
     */
    public MysqlDataSourceServiceImpl() {
        super();
    }

    @Override
    public DataSource createDataSource(String tenantId) {
        return genDataSource(tenantId);
    }

    private DataSource genDataSource(String tenantId) {
        try {
            String dbUrl = "jdbc:mysql://"+myProperties.getProperty("MYSQL_HOST")+":"+myProperties.getProperty("MYSQL_PORT")+"/"+myProperties.getProperty("MYSQL_SCHEMA");

            DriverManagerDataSource dataSource = new DriverManagerDataSource(dbUrl, myProperties.getProperty("MYSQL_DB_USR"), myProperties.getProperty("MYSQL_DB_PWD"));
            dataSource.setDriverClassName(dbDriverClassName);

            return dataSource;
        } catch (Exception e) {
            log.error(e, "data source connection failed.");
        }
        return null;
    }

}
