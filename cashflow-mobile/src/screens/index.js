import {
    Navigation
} from 'react-native-navigation';

import Home from './home/Home';
import SingleImagePage from './home/SingleImagePage';
import Menu from './Menu';
import PaymentDetail from './payment/PaymentDetail';
import PaymentList from './payment/PaymentList';
import WelcomeScreen from './setup/WelcomeScreen';
import Login from './setup/Login';
import Setup from './setup/Setup';
import CreatingAccount from './setup/CreatingAccount';
import SetupDone from './setup/SetupDone';
import RevenueSummaryDetail from './report/RevenueSummaryDetail';
import Setting from './setting/Setting';
import DemoReportList from './report/DemoReportList';
import RevenueTrend from './core/RevenueTrend'
import BalanceOfPayments from './core/BalanceOfPayments'
import FinancialIndicators from './core/FinancialIndicators'
import ProfitAnalysis_v2 from './core/ProfitAnalysis_v2'
import StockInfo from './core/StockInfo'
import TaxIndicator from './core/TaxIndicator'
import PaymentAccountList from "./cfl/PaymentAccountList";
import CategoryList from "./cfl/CategoryList";
import AccountList from './account/AccountList';
import AccountListDetail from './account/AccountListDetail';
import AccountTypeList from "./cfl/AccountTypeList";
import BankTypeList from "./cfl/BankTypeList";
import CurrencyTypeList from "./cfl/CurrencyTypeList";
import MoneyDetail from './home/MoneyDetail';
import CategoriedPaymentList from './home/CategoriedPaymentList';


export function registerScreens() {
    Navigation.registerComponent('b1lite.Welcome', () => WelcomeScreen);
    Navigation.registerComponent('b1lite.Setup', () => Setup);
    Navigation.registerComponent('b1lite.CreatingAccount', () => CreatingAccount);
    Navigation.registerComponent('b1lite.SetupDone', () => SetupDone);
    Navigation.registerComponent('b1lite.Login', () => Login);

    Navigation.registerComponent('b1lite.Home', () => Home);
    Navigation.registerComponent('b1lite.Menu', () => Menu);
    Navigation.registerComponent('b1lite.MoneyDetail', () =>MoneyDetail);
    Navigation.registerComponent('b1lite.CategoriedPaymentList', () =>CategoriedPaymentList);

    Navigation.registerComponent('b1lite.SingleImagePage', () => SingleImagePage);
    
    Navigation.registerComponent('b1lite.PaymentDetail', () => PaymentDetail);
    Navigation.registerComponent('b1lite.PaymentList', () => PaymentList);
    Navigation.registerComponent('b1lite.PaymentAccountList', () => PaymentAccountList);
    Navigation.registerComponent('b1lite.CategoryList', () => CategoryList);

    Navigation.registerComponent('b1lite.DemoReportList', () => DemoReportList);

    Navigation.registerComponent('b1lite.RevenueTrend', () => RevenueTrend);
    Navigation.registerComponent('b1lite.BalanceOfPayments', () => BalanceOfPayments);
    Navigation.registerComponent('b1lite.ProfitAnalysis_v2', () => ProfitAnalysis_v2);
    Navigation.registerComponent('b1lite.StockInfo', () => StockInfo);
    Navigation.registerComponent('b1lite.TaxIndicator', () => TaxIndicator);
    Navigation.registerComponent('b1lite.FinancialIndicators', () => FinancialIndicators);
    
    Navigation.registerComponent('b1lite.RevenueSummaryDetail', () => RevenueSummaryDetail);

    Navigation.registerComponent('b1lite.Setting', () => Setting);
    Navigation.registerComponent('b1lite.AccountList', () => AccountList);
    Navigation.registerComponent('b1lite.AccountListDetail', () => AccountListDetail);
    Navigation.registerComponent('b1lite.AccountTypeList', () => AccountTypeList);
    Navigation.registerComponent('b1lite.BankTypeList', () => BankTypeList);

    Navigation.registerComponent('b1lite.CurrencyTypeList', () => CurrencyTypeList);

 
}
