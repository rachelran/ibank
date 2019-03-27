package com.sap.sme.ilab.cashflow.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.sap.sme.common.exception.InternalException;
import com.sap.sme.common.logger.LightLogger;
import com.sap.sme.common.sql.QueryBuilder;
import com.sap.sme.common.sql.QueryResult;
import com.sap.sme.common.util.DateTimeUtils;
import com.sap.sme.ilab.cashflow.ro.GpPerCategory;
import com.sap.sme.ilab.cashflow.ro.GpPerCategoryResult;
import com.sap.sme.ilab.cashflow.ro.GpSummaryResult;
import com.sap.sme.ilab.cashflow.ro.MonthTrendResult;
import com.sap.sme.ilab.cashflow.ro.MonthValue;
import com.sap.sme.ilab.cashflow.service.GrossProfitService;

@Service
public class GrossProfitServiceImpl extends AbstractJpaService implements GrossProfitService {
	private final LightLogger log = LightLogger.getLogger(this);

	@Override
	public List<GpSummaryResult> getGpSummary() {
		try {
			QueryBuilder cy = new QueryBuilder(entityManager);
			cy.sql("select");
			cy.column("SysCurrncy", "currency");
			cy.sql("FROM OADM");

			QueryBuilder cs = new QueryBuilder(entityManager);
			cs.sql("select");
			cs.column("SUM(Debit) - SUM(Credit)", "cost");
			cs.sql("FROM JDT1 WHERE Account = 640101");

			QueryBuilder es = new QueryBuilder(entityManager);
			es.sql("select");
			es.column("SUM(Debit) -SUM(Credit)", "expense");
			es.sql("FROM JDT1\n"
					+ "  WHERE Account IN (66010101,66010102,66010103,66010104,66010401,66010402,66010403,66010404,66010405,66010406,66010501,66010502,66010503,66010504,66010910,66010911)");

			QueryBuilder gp = new QueryBuilder(entityManager);
			gp.sql("select");
			gp.column("SUM(GP)", "grossprofit");
			gp.sql("FROM(\n" + "(SELECT SUM(GrssProfit) As GP\n" + "  FROM INV1 \n" + "  WHERE WhsCode = '01') \n"
					+ "  UNION All\n" + "  SELECT SUM(T0.LineTotal - T2.LineTotal) As GP\n"
					+ "  FROM INV1 T0 INNER JOIN RDR1 T1 ON T0.BaseEntry = T1.DocEntry AND T0.BaseLine = T1.LineNum \n"
					+ "  INNER JOIN POR1 T2 ON T2.BaseEntry = T1.DocEntry AND T2.BaseLine = T1.LineNum  \n"
					+ "  WHERE T0.WhsCode = '02') As grossprofit");

			String currency = cy.getFirstCell();
			BigDecimal cost = cs.getFirstCell();
			BigDecimal expense = es.getFirstCell();
			BigDecimal grossprofit = gp.getFirstCell();

			List<GpSummaryResult> gpSummaryResults = new ArrayList<GpSummaryResult>();

			GpSummaryResult costResult = new GpSummaryResult();
			costResult.setValue(cost);
			costResult.setType("cost");
			costResult.setCurrency(currency);

			GpSummaryResult expenseResult = new GpSummaryResult();
			expenseResult.setValue(expense);
			expenseResult.setType("expense");
			expenseResult.setCurrency(currency);

			GpSummaryResult gpResult = new GpSummaryResult();
			gpResult.setValue(grossprofit);
			gpResult.setType("grossprofit");
			gpResult.setCurrency(currency);

			gpSummaryResults.add(costResult);
			gpSummaryResults.add(expenseResult);
			gpSummaryResults.add(gpResult);

			return gpSummaryResults;
		} catch (Exception e) {
			log.error(e, "fail to select records.");
			throw new InternalException(e, "fail to select records");
		}
	}

	@Override
	public List<GpPerCategoryResult> getGpPerCategory(Integer year, Integer month) {
	
		try {
			QueryBuilder qb = new QueryBuilder(entityManager);

			qb.sql("select");
			qb.column("isnull(R1.ItmsGrpNam, R2.ItmsGrpNam)", "category");
			qb.column("(isnull(R1.GP, 0) + isnull(R2.GP, 0))", "grossprofit");
			qb.sql("FROM (SELECT SUM(GrssProfit) As GP, T2.ItmsGrpCod, T2.ItmsGrpNam\n"
			        + "                FROM INV1 T0\n"
					+ "                INNER JOIN OITM T1 ON T0.ItemCode = T1.ItemCode\n"
					+ "                INNER JOIN OITB T2 ON T1.ItmsGrpCod = T2.ItmsGrpCod\n");
			if (month == 0) {
				qb.sql(" WHERE T0.WhsCode = '01' AND T2.ItmsGrpCod != 100\n"
						+ "	 GROUP BY T2.ItmsGrpCod, T2.ItmsGrpNam) As R1\n"
						+ "  FULL JOIN (SELECT SUM(T0.LineTotal - T2.LineTotal) As GP, T4.ItmsGrpCod, T4.ItmsGrpNam\n"
						+ "               FROM INV1 T0\n"
						+ "                        INNER JOIN RDR1 T1 ON T0.BaseEntry = T1.DocEntry AND T0.BaseLine = T1.LineNum\n"
						+ "                        INNER JOIN POR1 T2 ON T2.BaseEntry = T1.DocEntry AND T2.BaseLine = T1.LineNum\n"
						+ "                        INNER JOIN OITM T3 ON T0.ItemCode = T3.ItemCode\n"
						+ "                        INNER JOIN OITB T4 ON T3.ItmsGrpCod = T4.ItmsGrpCod\n"
						+ "                        WHERE T0.WhsCode = '02' AND T4.ItmsGrpCod != 100\n"
						+ "                        GROUP BY T4.ItmsGrpCod, T4.ItmsGrpNam) As R2\n"
						+ "  ON R1.ItmsGrpCod = R2.ItmsGrpCod ORDER BY grossprofit DESC");
			} else {
                qb.sql(" WHERE T0.WhsCode = '01' AND T2.ItmsGrpCod != 100 and DATEPART(YYYY,T0.DocDate)=? and DATEPART(MM,T0.DocDate)=?\n"
                        + "  GROUP BY T2.ItmsGrpCod, T2.ItmsGrpNam) As R1\n"
                        + "  FULL JOIN (SELECT SUM(T0.LineTotal - T2.LineTotal) As GP, T4.ItmsGrpCod, T4.ItmsGrpNam\n"
                        + "               FROM INV1 T0\n"
                        + "                        INNER JOIN RDR1 T1 ON T0.BaseEntry = T1.DocEntry AND T0.BaseLine = T1.LineNum\n"
                        + "                        INNER JOIN POR1 T2 ON T2.BaseEntry = T1.DocEntry AND T2.BaseLine = T1.LineNum\n"
                        + "                        INNER JOIN OITM T3 ON T0.ItemCode = T3.ItemCode\n"
                        + "                        INNER JOIN OITB T4 ON T3.ItmsGrpCod = T4.ItmsGrpCod\n"
                        + "                        WHERE T0.WhsCode = '02' AND T4.ItmsGrpCod != 100 and DATEPART(YYYY,T0.DocDate)=? and DATEPART(MM,T0.DocDate)=?\n"
                        + "                        GROUP BY T4.ItmsGrpCod, T4.ItmsGrpNam) As R2\n"
                        + "  ON R1.ItmsGrpCod = R2.ItmsGrpCod ORDER BY grossprofit DESC").p(year, month, year, month);
            }

			List<QueryResult> resultList = qb.getResultList();

			List<GpPerCategoryResult> gpcResultList = new ArrayList<GpPerCategoryResult>();

			GpPerCategoryResult gpcResult = new GpPerCategoryResult();
			ArrayList<GpPerCategory> gpcList = new ArrayList<GpPerCategory>();

			for (QueryResult result : resultList) {
				GpPerCategory gpcObject = new GpPerCategory();

				String key = result.getString("category");
				String value = result.getString("grossprofit");

				gpcObject.setCategory(key);
				gpcObject.setValue(value);
				gpcList.add(gpcObject);
			}

			gpcResult.setGpPerGategoryList(gpcList);
			if (month == 0) {
				gpcResult.setMonth(null);
			} else {
				gpcResult.setMonth(month);
			}

			gpcResultList.add(gpcResult);
			return gpcResultList;
		} catch (Exception e) {
			log.error(e, "fail to select records.");
			throw new InternalException(e, "fail to select records");
		}

	}

	@Override
	public List<MonthTrendResult> getMonthTrendResult() {

		List<String> monthList = DateTimeUtils.getRecentMonths(6);

		try {
			QueryBuilder cy = new QueryBuilder(entityManager);
			cy.sql("select");
			cy.column("SysCurrncy", "currency");
			cy.sql("FROM OADM");
			String currency = cy.getFirstCell();

			List<MonthTrendResult> MonthTrendResult = new ArrayList<MonthTrendResult>();
			MonthTrendResult reResult = new MonthTrendResult();
			ArrayList<MonthValue> reList = new ArrayList<MonthValue>();
			reResult.setCurrency(currency);
			reResult.setType("revenue");

			MonthTrendResult csResult = new MonthTrendResult();
			ArrayList<MonthValue> csList = new ArrayList<MonthValue>();
			csResult.setCurrency(currency);
			csResult.setType("cost");

			MonthTrendResult exResult = new MonthTrendResult();
			ArrayList<MonthValue> exList = new ArrayList<MonthValue>();
			exResult.setCurrency(currency);
			exResult.setType("expense");

			MonthTrendResult gpResult = new MonthTrendResult();
			ArrayList<MonthValue> gpList = new ArrayList<MonthValue>();
			gpResult.setCurrency(currency);
			gpResult.setType("grossprofit");
			BigDecimal revenue, cost, expense, grossprofit;
			for (int i = 0; i < monthList.size(); i ++){
				QueryBuilder re = new QueryBuilder(entityManager);
				re.sql("select");
				re.column("SUM(Credit) - SUM(Debit)", "revenue");
				re.sql("FROM JDT1 WHERE Account = 600101 AND DATEPART(YYYY,RefDate)=" + monthList.get(i).substring(0, 4) + " AND DATEPART(MM, RefDate)=" + monthList.get(i).substring(5));

				QueryBuilder cs = new QueryBuilder(entityManager);
				cs.sql("select");
				cs.column("SUM(Debit) - SUM(Credit)", "cost");
				cs.sql("FROM JDT1 WHERE Account = 640101 AND DATEPART(YYYY,RefDate)=" + monthList.get(i).substring(0, 4) + " AND DATEPART(MM, RefDate)=" + monthList.get(i).substring(5));

				QueryBuilder ex = new QueryBuilder(entityManager);
				ex.sql("select");
				ex.column("SUM(Debit) - SUM(Credit)", "expense");
				ex.sql("FROM JDT1 WHERE DATEPART(YYYY, RefDate)=" + monthList.get(i).substring(0, 4)+ " AND DATEPART(MM, RefDate)=" + monthList.get(i).substring(5) + " AND \n"
								+ "  Account IN (66010101,66010102,66010103,66010104,66010401,66010402,66010403,66010404,66010405,66010406,66010501,66010502,66010503,66010504,66010910,66010911)");

				QueryBuilder gp = new QueryBuilder(entityManager);
				gp.sql("select");
				gp.column("SUM(GP)", "grossprofit");
				gp.sql("FROM(SELECT SUM(GrssProfit) As GP \n"
								+ "  FROM INV1 \n"
								+ "  WHERE WhsCode = '01' AND DATEPART(YYYY, DocDate)=" + monthList.get(i).substring(0, 4) + " AND DATEPART(MM, DocDate)=" + monthList.get(i).substring(5) + " \n"
								+ "  UNION All \n"
								+ "  SELECT SUM(T0.LineTotal - T2.LineTotal) As GP \n"
								+ "  FROM INV1 T0 INNER JOIN RDR1 T1 ON T0.BaseEntry = T1.DocEntry AND T0.BaseLine = T1.LineNum \n"
								+ "  INNER JOIN POR1 T2 ON T2.BaseEntry = T1.DocEntry AND T2.BaseLine = T1.LineNum  \n"
								+ "  WHERE T0.WhsCode = '02'AND  DATEPART(YYYY, T0.DocDate)=" + monthList.get(i).substring(0, 4) + " AND DATEPART(MM, T0.DocDate)=" + monthList.get(i).substring(5) +") As gp");
				revenue = re.getFirstCell();
				cost = cs.getFirstCell();
				expense = ex.getFirstCell();
				grossprofit = gp.getFirstCell();

				MonthValue reObject = new MonthValue();
				MonthValue csObject = new MonthValue();
				MonthValue exObject = new MonthValue();
				MonthValue gpObject = new MonthValue();

				reObject.setMonth(monthList.get(i));
				reObject.setValue(revenue);
				csObject.setMonth(monthList.get(i));
				csObject.setValue(cost);
				exObject.setMonth(monthList.get(i));
				exObject.setValue(expense);
				gpObject.setMonth(monthList.get(i));
				gpObject.setValue(grossprofit);

				reList.add(reObject);
				csList.add(csObject);
				exList.add(exObject);
				gpList.add(gpObject);

			}
			reResult.setMonthTrendList(reList);
			MonthTrendResult.add(reResult);

			csResult.setMonthTrendList(csList);
			MonthTrendResult.add(csResult);

			exResult.setMonthTrendList(exList);
			MonthTrendResult.add(exResult);

			gpResult.setMonthTrendList(gpList);
			MonthTrendResult.add(gpResult);

			return MonthTrendResult;

		} catch (Exception e) {
			log.error(e, "fail to select records.");
			throw new InternalException(e, "fail to select records");
		}
	}
}
