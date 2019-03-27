package com.sap.sme.ilab.cashflow.ro;
/**
 * GpPerCategory
 *
 * this is the data model of gross profit per category
 */
public class GpPerCategory {
	private String category;
	private String value;
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	@Override
	public String toString() {
		return "GpPerCategory [category=" + category + ", value=" + value + "]";
	}
}
