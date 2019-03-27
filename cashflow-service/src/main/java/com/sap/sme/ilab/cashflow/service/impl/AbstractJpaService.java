package com.sap.sme.ilab.cashflow.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import javax.persistence.EntityManager;

/**
 * Created by i065037 on 2018/12/26.
 */
public class AbstractJpaService {
    @Autowired
    @Qualifier("mssqlEntityManager")
    protected EntityManager entityManager;

    public AbstractJpaService() {
    }
}
