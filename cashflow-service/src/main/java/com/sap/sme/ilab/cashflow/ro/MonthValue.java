package com.sap.sme.ilab.cashflow.ro;

import java.math.BigDecimal;

public class MonthValue {
	private String month;
	private BigDecimal value;


	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public BigDecimal getValue() {
		return value;
	}

	public void setValue(BigDecimal value) {
		this.value = value;
	}

	@Override
	public String toString() {
		return "MonthlyValue [month=" + month + ", value=" + value + "]";
	}
}
