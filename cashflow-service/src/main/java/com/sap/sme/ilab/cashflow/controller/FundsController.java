package com.sap.sme.ilab.cashflow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.sap.sme.ilab.cashflow.ro.FundsResult;
import com.sap.sme.ilab.cashflow.service.FundsService;

@RestController
public class FundsController {

	@Autowired
	private FundsService fundsService;

	@RequestMapping(value = "/api/funds", method = RequestMethod.GET)
	 public ResponseEntity<List<FundsResult>> getFunds() {
        return new ResponseEntity<List<FundsResult>>(fundsService.getFunds(), HttpStatus.OK);
    }
}
