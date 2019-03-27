package com.sap.sme.ilab.cashflow.datasource.factory;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

import com.sap.sme.common.spring.ApplicationContextHolder;

public class MssqlEntityManagerFactory {
    /**
     * Get JPA EntityManagerFactory for MSSQL.
     *
     * @return JPA EntityManagerFactory for MSSQL
     */
    public static EntityManagerFactory getEntityManagerFactory() {
        return ApplicationContextHolder.getBean("mssqlEntityManagerFactory", EntityManagerFactory.class);
    }
    /**
     * Get JPA EntityManager for MSSQL.
     *
     * @return JPA EntityManager for MSSQL
     */
    public static EntityManager getEntityManager() {
        return ApplicationContextHolder.getBean("mssqlEntityManager", EntityManager.class);
    }
}
