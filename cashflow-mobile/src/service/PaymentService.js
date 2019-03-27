function PaymentService(connection) {
    const that = {}

    const repo = connection.getRepository("Payment");
    const repoAccount = connection.getRepository("Account");

    that.save = async function (o,needUpdateAccount=true) {
        o.accountBalance = null;
        let t = o.transDate;
        console.log(o);
        console.log(o.transDate);
        console.log(t);
        o.createDate = (new Date()).toISOString();
        o.year = t.substring(0, 4);
        o.month = t.substring(4, 6);
        o.day = t.substring(6, 8);
        console.log("whether need update account value is " + needUpdateAccount)

        if (needUpdateAccount==true && !!o.toAccount && o.type == "IN"){
            let accountId = o.toAccount.id;
            let amount = o.amount;
            console.log("amount is " + amount);
            let accountBalanceLatest= await find_latest_account_balance(accountId);
            console.log("accountBalanceLatest is " + accountBalanceLatest);
            o.accountBalance = amount + accountBalanceLatest;
            repoAccount.findOne({"id": accountId}).then(res=>{
                amount = amount + res.amount;
            }).then(() => {
                repoAccount.save({"id": accountId,"amount": amount})
                console.log("real amount after plus "+amount)
            })
        }

        if (needUpdateAccount==true && !!o.fromAccount && o.type == "OUT"){
            let accountId = o.fromAccount.id;
            let amount = o.amount;
            console.log("amount is " + amount);
            let accountBalanceLatest= await find_latest_account_balance(accountId);
            console.log("accountBalanceLatest is " + accountBalanceLatest);
            o.accountBalance =  accountBalanceLatest - amount;
            repoAccount.findOne({"id": accountId}).then(res=>{
                amount = res.amount - amount;
            }).then(() => {
                repoAccount.save({"id": accountId,"amount": amount})
                console.log("real amount after sub "+amount)
            })
        }

        return repo.save(o);
    };

    that.batchSave = function (o) {
        return repo.save(o);
    };

    that.delete = async function (options,needUpdateAccount=true) {
        console.log("whether need update account value in delete operation is " + needUpdateAccount)
        let t = options.transDate;

        console.log("before delete");
        console.log(options);
        console.log(options.transDate);
        console.log(t);
        options.createDate = (new Date()).toISOString();
        options.year = t.substring(0, 4);
        options.month = t.substring(4, 6);
        options.day = t.substring(6, 8);
        options.isActive = false;

        repo.save(options);        

        console.log("after await");
        
        let reversePayment = createReverse(needUpdateAccount, options);
        console.log("reversePayment.isActive is " + reversePayment.isActive);
        return that.save(reversePayment);
        
    };

    that.find = function (options) {
        return repo.find(options);
    };

    that.findOne = function (options) {
        return repo.findOne(options);
    };

    that.count = function (options) {
        return repo.count(options);
    };

    that.find_by_id = async function (id) {
        let payment = await repo.createQueryBuilder("payment")
            .leftJoinAndSelect("payment.category", "category")
            .leftJoinAndSelect("payment.fromAccount", "fromAccount")
            .leftJoinAndSelect("payment.toAccount", "toAccount")
            .leftJoinAndSelect("payment.attachments","attachments")
            .where("payment.id = :id", { id: id })
            .getOne();

        return payment;
    };

     async function find_latest_account_balance(accountId){
        let result = await repo.query("select accountBalance from payment where fromAccountId = " + accountId + " OR  toAccountId = " + accountId + " order by id desc limit 1");
        return result[0].accountBalance;
    }

    /**
     * type: 
     *      countIn: count of incoming payments
     *      countOut: count of paid out payments
     *      amountIn: payment in
     *      amountOut: payment out
     */
    that.analyticsVolume = async function (year, month, type) {
        let time_slot = parseInt(year) * 100 + parseInt(month);
        let fromMonth = month-6+1;
        let fromYear = year;
        if(fromMonth <= 0 ){
            fromMonth += 12;
            fromYear -= 1;
        }
        let fromTimeSlot = parseInt(fromYear) * 100 + parseInt(fromMonth);
        
        if( type == 'amountOut' || type == 'amountIn'){
            let select = "sum(p.amount)";
            let typeVal = (type == 'amountOut') ? "OUT" : "IN";
            var rows = await repo.query("SELECT " + select + " as total, `year` as year, `month` as month FROM Payment p "
                +" where type='" + typeVal + "' and isActive = '1' and year * 100 + month >=" + fromTimeSlot + " and year * 100 + month <=" + time_slot 
                + " group by `year`, `month` order by year * 100 + month asc");
            return rows;
        } else if (type == "countIn" || type == "countOut"){
            let select = "count(*)";
            let typeVal = (type == 'countOut') ? "OUT" : "IN";
            var rows = await repo.query("SELECT " + select + " as total, `year` as year, `month` as month FROM Payment p "
                +" where type='" + typeVal + "' and isActive = '1' and year * 100 + month >=" + fromTimeSlot + " and year * 100 + month <=" + time_slot 
                + " group by `year`, `month` order by year * 100 + month asc");
            return rows; 
        }
    };

    that.getMonthlyHistroricalAmount = async function (year, month, type) {
    let typeVal = (type == 'OUT') ? "fromAccountId" : "toAccountId";
    let time_slot = parseInt(year) * 100 + parseInt(month);
    var rows = await repo.query("SELECT accountBalance,year,month,createDate,"+ typeVal+ " FROM Payment where type='" + type +
        "' and year * 100 + month <=" + time_slot + " group by " + typeVal + " order by createDate desc");
    return rows;
    };

    that.getMonthlyAmount = async function (year, month, type) {
        let select = "sum(p.amount)";
        let time_slot = parseInt(year) * 100 + parseInt(month);
        var rows = await repo.query("SELECT " + select + " as total, `year` as year, `month` as month FROM Payment p where type='" + type +
            "' and isActive = '1' and year * 100 + month =" + time_slot);
        return rows;
    };

    that.findwithCategories = async function (year, month, type) {
        let categoryName = "T1.name";
        let categorycode = "T1.code";
        // let time_slot = parseInt(year) * 100 + parseInt(month);
        var rows = await repo.query("SELECT " + categorycode  +", "+ categoryName + ", T0.amount FROM payment T0 inner join category T1 on T0.categoryId = T1.id where T0.isActive = '1' and T0.type = '" + type + "' and T0.year = '" + year + "' and T0.month ='" + month + "'");
        return rows;
    };

    that.findRangePayment = async function (beginDate, endDate, type) {
        var sql = "SELECT  T0.year, T0.month, T1.name, sum(T0.amount) as amount FROM payment T0" 
                 +  " inner join category T1 on T0.categoryId = T1.id"
                 +  " where T0.isActive = '1' and T0.type = '" + type + "'"
                 +  " and T0.transDate > '" + beginDate + "'  and T0.transDate < '" + endDate + "'" 
                 +  " group by T0.year, T0.month, T1.name";

        var rows = await repo.query(sql);

        return rows;
    };
    
    that.queryMoneyIO = async function(year, month){
        var res = [];
        var res1 = await repo.query("select SUM(amount) as amount from Payment where type = " + " 'IN' " + " and isActive = '1' and year = '" + year + "' and month = '" + month + "'" );
        var res2 = await repo.query("select SUM(amount) as amount from Payment where type = " + " 'OUT' " + " and isActive = '1' and year = '" + year + "' and month = '" + month + "'");
        res1.map((item) =>{
            res.push({
                "ItemGroup": "MoneyIn",
                "Amount":item.amount
            });
        });
        res2.map((item) =>{
            res.push({
                "ItemGroup": "MoneyOut",
                "Amount":item.amount
            });
        });
        return res;
    };
    return that;

    function createReverse(needUpdateAccount, options) {
        if (needUpdateAccount === false) return;
        let reversePayment = Object.assign({},options);
        reversePayment.id = null;
        reversePayment.isActive = false;
        console.log("reversePayment.isActive is " + reversePayment.isActive);
        if (reversePayment.toAccount && reversePayment.type === "IN") {
            
            console.log("in if first");
            console.log("reversePayment.isActive is " + reversePayment.isActive);
        
            reversePayment.fromAccount=Object.assign({}, reversePayment.toAccount);
            reversePayment.toAccount = null;
            reversePayment.type = "OUT";
            reversePayment.toName = reversePayment.fromName;
            reversePayment.fromName = null;
               
        }
        else if (reversePayment.fromAccount && reversePayment.type === "OUT") {
            let accountId = options.fromAccount.id;
            let amount = options.amount;
            console.log("in if second");
        
            reversePayment.toAccount=Object.assign({}, reversePayment.fromAccount);
            reversePayment.fromAccount = null;
            reversePayment.type = "IN";
            reversePayment.fromName = reversePayment.toName;
            reversePayment.toName = null;
                
        }
        return reversePayment;
        console.log("after if");
    }
};

module.exports = PaymentService;
