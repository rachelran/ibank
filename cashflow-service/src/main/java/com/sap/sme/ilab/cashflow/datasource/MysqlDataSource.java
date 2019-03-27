package com.sap.sme.ilab.cashflow.datasource;

import javax.sql.DataSource;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
import org.springframework.jdbc.datasource.lookup.DataSourceLookupFailureException;

import com.sap.sme.common.logger.LightLogger;
import com.sap.sme.ilab.cashflow.session.FlowSession;


public class MysqlDataSource extends AbstractRoutingDataSource {

    private final LightLogger log = LightLogger.getLogger(this);

    /**
     * {@inheritDoc}
     */
    @Override
    protected DataSource determineTargetDataSource() {
        FlowSession session = FlowSession.getSession();
        if (session == null) {
            log.error("FlowSession not exist.");
            throw new DataSourceLookupFailureException("Error lookup MySQL DataSource: FlowSession not exist.");
        }

        DataSource mysqlDataSource = session.getMysqlDataSource();
        if (mysqlDataSource == null) {
            log.error("MySQL DataSource not exist in FlowSession, check tenantId.");
            throw new DataSourceLookupFailureException("Error lookup MySQL DataSource: MySQL DataSource not exist in FlowSession, check tenantId.");
        }

        return mysqlDataSource;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected Object determineCurrentLookupKey() {
        // not used
        return null;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void afterPropertiesSet() {
        // not used
    }

}

