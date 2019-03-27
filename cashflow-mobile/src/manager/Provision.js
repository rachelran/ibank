import CnCurrencyJson from '../data/cn/Currency';
import CnBankJson from '../data/cn/Bank';
import CnAccountTypeJson from '../data/cn/AccountType';
import CnAccountJson from '../data/cn/Account';
import CnCategoryJson from '../data/cn/Category';
import CnPaymentJson from '../data/cn/Payment';
import CnSettingJson from '../data/cn/Setting';

import UsCurrencyJson from '../data/us/Currency';
import UsBankJson from '../data/us/Bank';
import UsAccountTypeJson from '../data/us/AccountType';
import UsAccountJson from '../data/us/Account';
import UsCategoryJson from '../data/us/Category';
import UsPaymentJson from '../data/us/Payment';
import UsSettingJson from '../data/us/Setting';

import AllServices from '../service';

module.exports = {
    init: function(conn, type, isDemo) {
        console.log("provision init begin type isDemo ", type, isDemo);
        var that = this;
        let oPromise = new Promise(function(resolve, reject){
            AllServices.SettingService(conn).findOne({"key": "provision"})
            .then(provision => {
                console.log(provision);
                if (!provision || provision.value == "none") {
                    if (type == "cn") {
                        return that.provisionCN(conn, isDemo);
                    } else if (type == "us") {
                        return that.provisionUS(conn, isDemo);
                    }
                } else {
                    console.log("provision already done");
                }
            }).then(() => {
                console.log("provision done");
                resolve();
            }).catch(error => {
                console.log("provision  error", error);
                reject(error);
            });
        });

        return oPromise; 
    },

    provisionCN: function(conn, isDemo) {
        console.log("provision cn begin");

        console.log(CnCurrencyJson);
        console.log(CnBankJson);
        console.log(CnAccountTypeJson);
        console.log(CnAccountJson);
        console.log(CnCategoryJson);
        console.log(CnPaymentJson);
        console.log(CnSettingJson);

        let oPromise = new Promise(function(resolve, reject){
            AllServices.CurrencyService(conn).batchSave(CnCurrencyJson)
            .then(() => {
                return AllServices.SettingService(conn).batchSave(CnSettingJson);
            })
            .then(() => {
                return AllServices.CategoryService(conn).batchSave(CnCategoryJson);
            })
            .then(() => {
                return AllServices.AccountTypeService(conn).batchSave(CnAccountTypeJson);
            }) 
            .then(() => {
                return AllServices.BankService(conn).batchSave(CnBankJson);
            })
            .then(() => {
                return isDemo ? AllServices.AccountService(conn).batchSave(CnAccountJson): null;
            })
            .then(() => {
                return isDemo ? AllServices.PaymentService(conn).batchSave(CnPaymentJson): null;
            })
            .then(() => {
                return AllServices.SettingService(conn).update({
                    "key": "provision",
                    "value": "done"
                });
            }).then(() => {
                console.log("provision cn done");
                resolve();
            }).catch(error => {
                reject(error);
            });  
        });

        return oPromise;
    },

    provisionUS: function(conn, isDemo) {
        console.log("provision us begin");

        console.log(UsCurrencyJson);
        console.log(UsBankJson);
        console.log(UsAccountTypeJson);
        console.log(UsAccountJson);
        console.log(UsCategoryJson);
        console.log(UsPaymentJson);
        console.log(UsSettingJson);

       let oPromise = new Promise(function(resolve, reject){
            AllServices.CurrencyService(conn).batchSave(UsCurrencyJson)
            .then(() => {
                return AllServices.SettingService(conn).batchSave(UsSettingJson);
            })
            .then(() => {
                return AllServices.CategoryService(conn).batchSave(UsCategoryJson);
            })
            .then(() => {
                return AllServices.AccountTypeService(conn).batchSave(UsAccountTypeJson);
            }) 
            .then(() => {
                return AllServices.BankService(conn).batchSave(UsBankJson);
            })
            .then(() => {
                return isDemo ? AllServices.AccountService(conn).batchSave(UsAccountJson): null;
            })
            .then(() => {
                return isDemo ? AllServices.PaymentService(conn).batchSave(UsPaymentJson): null;
            })
            .then(() => {
                return AllServices.SettingService(conn).update({
                    "key": "provision",
                    "value": "done"
                });
            }).then(() => {
                console.log("provision us done");
                resolve();
            }).catch(error => {
                reject(error);
            });
        });

        return oPromise;
    }
}