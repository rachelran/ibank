package com.sap.sme.ilab.cashflow.ro;

import java.math.BigDecimal;

public class FundsResult {
	
	private String type;
	private BigDecimal amount;
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public BigDecimal getAmount() {
		return amount;
	}
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	@Override
	public String toString() {
		return "FundsResult [type=" + type + ", amount=" + amount + "]";
	}

}
