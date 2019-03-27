package com.sap.sme.ilab.cashflow.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.sap.sme.ilab.cashflow.ro.GpPerCategoryResult;
import com.sap.sme.ilab.cashflow.ro.GpSummaryResult;
import com.sap.sme.ilab.cashflow.ro.MonthTrendResult;
import com.sap.sme.ilab.cashflow.service.GrossProfitService;

@RestController
public class GrossProfitController {

	@Autowired
    private GrossProfitService grossprofitService;

    @RequestMapping(value = "/api/gpsummary", method = RequestMethod.GET)
    public ResponseEntity<List<GpSummaryResult>> getGrossProfit() {
		return new ResponseEntity<List<GpSummaryResult>>(grossprofitService.getGpSummary(), HttpStatus.OK);
	}

    @RequestMapping(value = "/api/gppercategory/{year}/{month}", method = RequestMethod.GET)
	public ResponseEntity<List<GpPerCategoryResult>> getGpPerCategory(@PathVariable("year") Integer year, @PathVariable("month") Integer month) {
		return new ResponseEntity<List<GpPerCategoryResult>>(grossprofitService.getGpPerCategory(year, month), HttpStatus.OK);
	}

    @RequestMapping(value = "/api/monthTrendResult", method = RequestMethod.GET)
    public ResponseEntity<List<MonthTrendResult>> getMonthTrend (){
		return new ResponseEntity<List<MonthTrendResult>>(grossprofitService.getMonthTrendResult(), HttpStatus.OK);
    }

}