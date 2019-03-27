package com.sap.sme.ilab.cashflow.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.sap.sme.common.exception.InternalException;
import com.sap.sme.common.logger.LightLogger;
import com.sap.sme.common.sql.QueryBuilder;
import com.sap.sme.common.sql.QueryResult;
import com.sap.sme.ilab.cashflow.ro.FundsResult;
import com.sap.sme.ilab.cashflow.service.FundsService;

@Service
public class FundsServiceImpl extends AbstractJpaService implements FundsService {

	private final LightLogger log = LightLogger.getLogger(this);

	@Override
	public List<FundsResult> getFunds() {
		List<FundsResult> fundsResList = new ArrayList<FundsResult>();

		try {
			QueryBuilder qbCash = new QueryBuilder(entityManager);

			qbCash.sql("select");
			qbCash.column("AcctName", "type");
			qbCash.column("CurrTotal", "amount");
			qbCash.sql("from OACT where AcctCode = '100101'");

			List<QueryResult> queryRes = qbCash.getResultList();

			for (QueryResult qrCash: queryRes) {
				String type = qrCash.getString("type");
				BigDecimal amount = qrCash.getBigDecimal("amount");

				FundsResult fundsRes = new FundsResult();
				fundsRes.setType(type);
				fundsRes.setAmount(amount);

				fundsResList.add(fundsRes);

				QueryBuilder qbDeposite = new QueryBuilder(entityManager);

				qbDeposite.sql("select");
				qbDeposite.column("AcctName", "type");
				qbDeposite.column("CurrTotal", "amount");
				qbDeposite.sql("from OACT where AcctCode = '100201'");

				queryRes = qbDeposite.getResultList();

				for (QueryResult qrDepo: queryRes) {
					String type1 = qrDepo.getString("type");
					BigDecimal amount1 = qrDepo.getBigDecimal("amount");

					FundsResult fundsRes1 = new FundsResult();
					fundsRes1.setType(type1);
					fundsRes1.setAmount(amount1);

					fundsResList.add(fundsRes1);
				}

				FundsResult fundsRes2 = new FundsResult();
				fundsRes2.setType("资金余额");
				fundsRes2.setAmount(fundsResList.get(0).getAmount().add(fundsResList.get(1).getAmount()));

				fundsResList.add(fundsRes2);
			}

			return fundsResList;
		} catch (Exception e) {
			log.error(e, "fail to select records.");
			throw new InternalException(e, "fail to select records");
		}
	}
}
