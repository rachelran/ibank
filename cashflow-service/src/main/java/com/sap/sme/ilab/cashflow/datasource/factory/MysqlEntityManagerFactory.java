package com.sap.sme.ilab.cashflow.datasource.factory;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

import com.sap.sme.common.spring.ApplicationContextHolder;

public class MysqlEntityManagerFactory {

    /**
     * Get JPA EntityManagerFactory for MySQL.
     *
     * @return JPA EntityManagerFactory for MySQL
     */
    public static EntityManagerFactory getEntityManagerFactory() {
        return ApplicationContextHolder.getBean("mysqlEntityManagerFactory", EntityManagerFactory.class);
    }

    /**
     * Get JPA EntityManager for MySQL.
     *
     * @return JPA EntityManager for MySQL
     */
    public static EntityManager getEntityManager() {
        return ApplicationContextHolder.getBean("mysqlEntityManager", EntityManager.class);
    }

}
