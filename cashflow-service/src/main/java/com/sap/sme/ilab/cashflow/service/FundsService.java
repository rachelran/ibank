package com.sap.sme.ilab.cashflow.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sap.sme.ilab.cashflow.ro.FundsResult;

@Service
public interface FundsService {
	
	List<FundsResult> getFunds();
	
}


