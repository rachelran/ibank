package com.sap.sme.ilab.cashflow.ro;
/**
 * GpPerCategory
 *
 * this is the data model of gross profit per category returned result, including two variables:
 * month is the month of this result
 * gpPerGategoryList is the gross profit per category data of this month and it is an array list with type of GpPerCategory
 * 
 */
import java.util.ArrayList;
import java.util.List;

public class GpPerCategoryResult {
	private List<GpPerCategory> gpPerGategoryList;
	private Integer month;
	public Integer getMonth() {
		return month;
	}
	public void setMonth(Integer month) {
		this.month = month;
	}
	public List<GpPerCategory> getGpPerGategoryList() {
		if (this.gpPerGategoryList == null) {
            this.gpPerGategoryList = new ArrayList<GpPerCategory>();
        }
        return this.gpPerGategoryList;
	}
	public void setGpPerGategoryList(ArrayList<GpPerCategory> gpPerGategoryList) {
		this.gpPerGategoryList = gpPerGategoryList;
	}
	@Override
	public String toString() {
		return "GpPerCategoryResult [gpPerGategoryList=" + gpPerGategoryList + ", month=" + month + "]";
	}
}
