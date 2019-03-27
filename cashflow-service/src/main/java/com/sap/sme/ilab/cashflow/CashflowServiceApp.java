package com.sap.sme.ilab.cashflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ImportResource;

/**
 * Spring Boot
 *
 */
@ImportResource("classpath*:/spring/CashflowService-beans.xml")
@SpringBootApplication
public class CashflowServiceApp {
    public static void main(String[] args) {
        SpringApplication.run(CashflowServiceApp.class,args);
    }
}
