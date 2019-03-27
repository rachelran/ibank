package com.sap.sme.ilab.cashflow.session;

import javax.sql.DataSource;

import com.sap.sme.common.exception.InternalException;
import com.sap.sme.common.logger.LightLogger;
import com.sap.sme.common.spring.ApplicationContextHolder;
import com.sap.sme.ilab.cashflow.datasource.service.DataSourceService;

public class FlowSession {

    private static final LightLogger log = LightLogger.getLogger(FlowSession.class);

    private static final ThreadLocal<FlowSession> sessionHolder = new ThreadLocal<FlowSession>();

    private String tenantId;
    private DataSource mysqlDataSource;
    private DataSource mssqlDataSource;

    /**
     * Construct instance.
     *
     * @param tenantId
     */
    private FlowSession(String tenantId) {
        this.tenantId = tenantId;
    }

    /**
     * Get current session.
     *
     * @return current session, or null if session not started
     */
    public static FlowSession getSession() {
        return sessionHolder.get();
    }

    /**
     * Set session.
     *
     * @session session to set
     */
    public static void setSession(FlowSession session) {
        sessionHolder.set(session);
    }

    /**
     * Create new session, close current existed session.
     */
    public static FlowSession createSession(String tenantId) {
        if (tenantId != null) {
            log.info("Create FlowSession for tenantId[", tenantId, "].");
        } else {
            log.info("Create FlowSession for tenantId[", tenantId, "], DB DataSource will not be created.");
        }

        FlowSession session = sessionHolder.get();
        if (session != null) {
            session.close();
        }

        session = new FlowSession(tenantId);
        if (tenantId != null) {
            try {
                DataSourceService mysqlService = ApplicationContextHolder.getBean("mysqlDataSourceService", DataSourceService.class);
                session.setMysqlDataSource(mysqlService.createDataSource(tenantId));

                DataSourceService mssqlService = ApplicationContextHolder.getBean("mssqlDataSourceService", DataSourceService.class);
                session.setMssqlDataSource(mssqlService.createDataSource(tenantId));
            } catch (Exception e) {
                log.error(e, "Error create DB DataSource for tenantId[", tenantId, "].");
                throw new InternalException(e, "Error create DB DataSource for tenantId[", tenantId, "].");
            }
        }

        sessionHolder.set(session);

        return session;
    }

    /**
     * Close current session.
     */
    public static void closeSession() {
        FlowSession session = sessionHolder.get();
        if (session != null) {
            session.close();
        }

        sessionHolder.set(null);
    }

    /**
     * @return the tenanId
     */
    public String getTenantId() {
        return tenantId;
    }

    /**
     * @return the mysqlDataSource
     */
    public DataSource getMysqlDataSource() {
        return mysqlDataSource;
    }

    /**
     * @param mysqlDataSource the mysqlDataSource to set
     */
    public void setMysqlDataSource(DataSource mysqlDataSource) {
        this.mysqlDataSource = mysqlDataSource;
    }

    /**
     * @return the mssqlDataSource
     */
    public DataSource getMssqlDataSource() {
        return mssqlDataSource;
    }

    /**
     * @param mssqlDataSource the mssqlDataSource to set
     */
    public void setMssqlDataSource(DataSource mssqlDataSource) {
        this.mssqlDataSource = mssqlDataSource;
    }

    /**
     * Close session.
     */
    public void close() {
        tenantId = null;
        mysqlDataSource = null;
        mssqlDataSource = null;
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "FlowSession [tenantId="
                + tenantId
                + ", mysqlDataSource="
                + mysqlDataSource
                + ", mssqlDataSource="
                + mssqlDataSource
                + ", super()="
                + super.toString()
                + "]";
    }

}