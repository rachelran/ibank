package com.sap.sme.common.spring;

import java.util.stream.Stream;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.env.Environment;

public final class SpringProfileUtil {

    public static boolean isProduction() {
        return isProduction(ApplicationContextHolder.getApplicationContext());
    }

    public static boolean isTest() {
        return isTest(ApplicationContextHolder.getApplicationContext());
    }

    public static boolean isLocal() {
        return isLocal(ApplicationContextHolder.getApplicationContext());
    }

    public static boolean isProduction(ApplicationContext context) {
        return isProduction(context.getEnvironment());
    }

    public static boolean isProduction(ConditionContext context) {
        return isProduction(context.getEnvironment());
    }

    public static boolean isProduction(Environment environment) {
        return Stream.of(environment.getActiveProfiles()).anyMatch("production"::equalsIgnoreCase);
    }

    public static boolean isTest(ApplicationContext context) {
        return isTest(context.getEnvironment());
    }

    public static boolean isTest(ConditionContext context) {
        return isTest(context.getEnvironment());
    }

    public static boolean isTest(Environment environment) {
        return Stream.of(environment.getActiveProfiles()).anyMatch("test"::equalsIgnoreCase);
    }

    public static boolean isLocal(Environment environment) {
        return !isProduction(environment) && !isTest(environment);
    }

    public static boolean isLocal(ConditionContext context) {
        return !isProduction(context) && !isTest(context);
    }

    public static boolean isLocal(ApplicationContext context) {
        return !isProduction(context) && !isTest(context);
    }

}
