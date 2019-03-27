package com.sap.sme.ilab.cashflow;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.lang.Nullable;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.sap.sme.common.logger.LightLogger;
import com.sap.sme.ilab.cashflow.constant.GlobalConstants.HttpHeader;
import com.sap.sme.ilab.cashflow.session.FlowSession;

public class HttpServiceInterceptor implements HandlerInterceptor {

    private final LightLogger log = LightLogger.getLogger(this);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String tenantId = request.getHeader(HttpHeader.TENANT_ID);
        if (tenantId == null) {
            log.info(HttpHeader.TENANT_ID, " not exist in HTTP request header.");
        }

        try {
            FlowSession.createSession(tenantId);
            return true;
        } catch (Exception e) {
            log.error(e, "Error create FlowSession.");
        }

        return false;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception {
        try {
            FlowSession.closeSession();
        } catch (Exception e) {
            log.error(e, "Error close FlowSession.");
        }
    }

}
