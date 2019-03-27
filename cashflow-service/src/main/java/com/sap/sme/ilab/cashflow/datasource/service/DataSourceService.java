package com.sap.sme.ilab.cashflow.datasource.service;

import javax.sql.DataSource;

public interface DataSourceService {

    /**
     * Create tenant data source.
     *
     * @param tenantId tenant ID
     * @return data source, return null if tenant don't have a data source
     */
    DataSource createDataSource(String tenantId);

}
