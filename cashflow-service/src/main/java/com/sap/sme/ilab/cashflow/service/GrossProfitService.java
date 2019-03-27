package com.sap.sme.ilab.cashflow.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sap.sme.ilab.cashflow.ro.GpPerCategoryResult;
import com.sap.sme.ilab.cashflow.ro.GpSummaryResult;
import com.sap.sme.ilab.cashflow.ro.MonthTrendResult;

@Service
public interface GrossProfitService {
	/**
     * GetGrossProfitSummary
     *
     * @return
     */
    List<GpSummaryResult> getGpSummary();
    
    /**
     * GetGrossProfitPerCategory monthly or not
     *
     * @return
     */
	List<GpPerCategoryResult> getGpPerCategory(Integer year, Integer month); 
    
	List<MonthTrendResult> getMonthTrendResult();
}
