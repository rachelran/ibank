/**
 * Copyright (C) 1972-2015 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.logger.spring;

import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.aop.support.AopUtils;

import com.sap.sme.common.logger.LightLogger;
import com.sap.sme.common.logger.LoggerUtils;
import com.sap.sme.common.stat.FlowStatistics;

/**
 * @author I311334
 */
public class AopServiceLogger implements MethodInterceptor {

    private static final LightLogger log = LightLogger.getLogger(AopServiceLogger.class);

    public static interface LogType {
        String NO = "no";
        String YES = "yes";
        String YES_ON_ERROR = "yesOnError";
    }

    private static Map<Method, String> signatureCache = new ConcurrentHashMap<Method, String>();

    private String logExecute = LogType.YES_ON_ERROR;
    private String logReturnValue = LogType.NO;
    private String logStatistics = LogType.YES_ON_ERROR;

    /* (non-Javadoc)
     * @see org.aopalliance.intercept.MethodInterceptor#invoke(org.aopalliance.intercept.MethodInvocation)
     */
    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {
        String className = AopUtils.getTargetClass(invocation.getThis()).getSimpleName();
        String methodSignature = genMethodSignature(invocation);
        String paramValue = genParameterValue(invocation);

        Object result = null;
        Throwable exception = null;
        int statIndex = FlowStatistics.enter(className, methodSignature);
        try {
            if (isLogExecute()) {
                log.info(methodSignature, " / enter. params[", paramValue, "]");
            }

            result = invocation.proceed();

            FlowStatistics.exit(statIndex, true);
            if (isLogExecute()) {
                if (isLogReturnValue()) {
                    log.info(methodSignature, " / exit success. execTime[", FlowStatistics.getExecuteTimeAsStr(statIndex), "] params[", paramValue, "] return[", LoggerUtils.toString(result), "]");
                } else {
                    log.info(methodSignature, " / exit success. execTime[", FlowStatistics.getExecuteTimeAsStr(statIndex), "] params[", paramValue, "]");
                }
            }
        } catch (Throwable t) {
            exception = t;

            FlowStatistics.exit(statIndex, false);
            if (isLogExecute()) {
                log.error(t, methodSignature, " / exit error. execTime[", FlowStatistics.getExecuteTimeAsStr(statIndex), "] params[", paramValue, "]");
            } else {
                log.error(t, methodSignature, " / execute error. execTime[", FlowStatistics.getExecuteTimeAsStr(statIndex), "] params[", paramValue, "]");
            }

            throw t;
        } finally {
            FlowStatistics.finish(statIndex, isLogStatistics(exception));
        }

        return result;
    }

    protected boolean isLogExecute() {
        return LogType.YES.equals(logExecute);
    }

    protected boolean isLogReturnValue() {
        return LogType.YES.equalsIgnoreCase(logReturnValue);
    }

    protected boolean isLogStatistics(Throwable exception) {
        if (LogType.YES.equalsIgnoreCase(logStatistics)) {
            return true;
        }
        if (LogType.YES_ON_ERROR.equalsIgnoreCase(logStatistics) && (exception != null)) {
            return true;
        }
        return false;
    }

    /**
     * @return the logExecute
     */
    public String getLogExecute() {
        return logExecute;
    }

    /**
     * @param logExecute the logExecute to set
     */
    public void setLogExecute(String logExecute) {
        this.logExecute = logExecute;
    }

    /**
     * @return the logReturnValue
     */
    public String getLogReturnValue() {
        return logReturnValue;
    }

    /**
     * @param logReturnValue the logReturnValue to set
     */
    public void setLogReturnValue(String logReturnValue) {
        this.logReturnValue = logReturnValue;
    }

    /**
     * @return the logStatistics
     */
    public String getLogStatistics() {
        return logStatistics;
    }

    /**
     * @param logStatistics the logStatistics to set
     */
    public void setLogStatistics(String logStatistics) {
        this.logStatistics = logStatistics;
    }

    /**
     * @return the onlyLogOnException
     * @deprecated use {@link #getLogExecute()}
     */
    @Deprecated
    public Boolean getOnlyLogOnException() {
        return LogType.YES_ON_ERROR.equals(logExecute);
    }

    /**
     * @param onlyLogOnException the onlyLogOnException to set
     * @deprecated use {@link #setLogExecute()}
     */
    @Deprecated
    public void setOnlyLogOnException(Boolean onlyLogOnException) {
        this.logExecute = LogType.YES_ON_ERROR;
    }

    /**
     * Generate method signature.
     *
     * @param invocation method invocation
     * @return method signature
     */
    public static String genMethodSignature(MethodInvocation invocation) {
        Class<?> serviceType = AopUtils.getTargetClass(invocation.getThis());
        Method method = invocation.getMethod();

        String signature = signatureCache.get(method);
        if (signature == null) {
            signature = genMethodSignature(method);

            if (signatureCache.size() > 10000) {
                log.error("WARNING: signatureCache size[", signatureCache.size(), "] too large, clear to prevent memory leak.");
                log.error("WARNING: signatureCache size[", signatureCache.size(), "] too large, signatureCache[", signatureCache.values(), "]");
                signatureCache.clear();
            }
            signatureCache.put(method, signature);
        }

        return signature.replace("${serviceClass}", serviceType.getSimpleName());
    }

    /**
     * Generate method parameters & values.
     *
     * @param invocation method invocation
     * @return method parameters & values
     */
    public static String genParameterValue(MethodInvocation invocation) {
        Class<?>[] paramTypes = invocation.getMethod().getParameterTypes();
        Object[] args = invocation.getArguments();

        StringBuilder buf = new StringBuilder();
        for (int i = 0; i < paramTypes.length; i++) {
            if (i > 0) {
                buf.append(", ");
            }

            Class<?> paramType = paramTypes[i];
            Object arg = args[i];
            buf.append(paramType.getSimpleName()).append("[").append(LoggerUtils.toString(arg)).append("]");
        }
        return buf.toString();
    }

    private static String genMethodSignature(Method method) {
        String methodName = method.getName();
        Type[] paramTypes = method.getGenericParameterTypes();
        Type returnType = method.getGenericReturnType();

        StringBuilder buf = new StringBuilder();
        buf
                .append(getTypeSignature(returnType))
                .append(" ${serviceClass}.")
                .append(methodName)
                .append("(");

        for (int i = 0; i < paramTypes.length; i++) {
            if (i > 0) {
                buf.append(", ");
            }

            buf.append(getTypeSignature(paramTypes[i]));
        }

        buf.append(")");

        return buf.toString();
    }

    private static String getTypeSignature(Type type) {
        StringBuilder buf = new StringBuilder();

        if (type instanceof Class) {
            buf.append(((Class<?>) type).getSimpleName());
        } else if (type instanceof ParameterizedType) {
            ParameterizedType paramType = (ParameterizedType) type;

            buf.append(getTypeSignature(paramType.getRawType()));

            Type[] templateTypes = ((ParameterizedType) type).getActualTypeArguments();
            if (ArrayUtils.isNotEmpty(templateTypes)) {
                buf.append("<");

                for (int i = 0; i < templateTypes.length; i++) {
                    if (i > 0) {
                        buf.append(", ");
                    }

                    buf.append(getTypeSignature(templateTypes[i]));
                }

                buf.append(">");
            }
        } else {
            buf.append(type);
        }

        return buf.toString();
    }

}
