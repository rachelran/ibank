package com.sap.sme.ilab.cashflow.ro;

import java.util.List;

public class MonthTrendResult {

	private String type;
	private String currency;
	private List<MonthValue> MonthTrendList;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public List<MonthValue> getMonthTrendList() {
		return MonthTrendList;
	}

	public void setMonthTrendList(List<MonthValue> monthTrendList) {
		MonthTrendList = monthTrendList;
	}

	@Override
	public String toString() {
		return "MonthTrendResult [type=" + type + ", currency=" +  currency + ", monthTrendList=" + MonthTrendList + "]";
	}	

}
