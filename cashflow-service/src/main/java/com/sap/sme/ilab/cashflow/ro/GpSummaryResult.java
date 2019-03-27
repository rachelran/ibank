package com.sap.sme.ilab.cashflow.ro;

import java.math.BigDecimal;

public class GpSummaryResult {
	private String type;
	private BigDecimal value;
	private String currency;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type=type;
	}

	public BigDecimal getValue() {
		return value;
	}

	public void setValue(BigDecimal value) {
		this.value = value;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	@Override
	public String toString() {
    return "GpSummaryResult [type=" + type + ", value= " + value + ", currency=" + currency + "]";
	}

}
