function AccountService(connection) {
    const that = {}

    const repo = connection.getRepository("Account");
    const repoPayment = connection.getRepository("Payment");

    that.save = function(o) {
        return repo.save(o);
    };

    that.batchSave = function(o) {
        return repo.save(o);
    };

    that.delete = function(options) {
        console.log("options for delete is");
        console.log(options);
        // let account = await repoPayment.createQueryBuilder("payment")
        //     .where("payment.id = :id", { id: id })
        //     .where("account.id = :id", { id: id })
        //     .getOne();
        return repo.delete(options);
    };

    that.find = function(options) {
        return repo.createQueryBuilder("account")
        .leftJoinAndSelect("account.accountType", "accountType")
        .leftJoinAndSelect("account.bank", "bank")
        .leftJoinAndSelect("account.currency", "currency")
        .getMany();
    };

    that.findOne = function(options) {
        return repo.findOne(options);
    };

    that.count = function(options) {
        return repo.count(options);
    };

    that.find_by_id = async function (id) {
        let account = await repo.createQueryBuilder("account")
            .leftJoinAndSelect("account.accountType", "accountType")
            .leftJoinAndSelect("account.bank", "bank")
            .leftJoinAndSelect("account.currency", "currency")
            .where("account.id = :id", { id: id })
            .getOne();
        
        return account;
    };

    that.find_by_header = function (headerId) {
        return repo.createQueryBuilder("line")
            .leftJoinAndSelect("line.product", "product")
            .where("line.headerId = :headerId", { headerId: headerId })
            .getMany();
    };

    that.post = async function (o) {
        o.status = 'Posted';

        let date = o.accountNumber;
        console.log(o);

        o.year = date.substring(0, 4);
        o.month = date.substring(4, 6);
        o.day = date.substring(6, 8);
        o.created = `${new Date().getTime()}`;

        o.id = o.id || uuid();
        var lineService = AccountService(connection);
        await lineService.delete({ headerId: o.id });

        let account = await repo.save(o);
        let lines = account.lines;
        if (lines) {
            lines.forEach(element => {
                element.id = element.id || uuid();
                element.headerId = account.id;
            });

            lines = await lineService.save(lines)
            payment.lines = lines;
        }

        return account;
    }
    
    that.initialAccountBalance = function (account) {
        console.log("account just created is ");
        console.log(account);

        let paymentObject = {};
        let time = account.transDate;
        paymentObject = {
            accountBalance: account.amount,
            amount: account.amount,
            category: {
                id: 10,
                name: 'Initial Balance'
            },
            createdBy: account.createdBy,
            type: 'IN',
            isActive: false,
            toName: null,
            toAccount: {
                id: account.id,
                accountNumber: account.accountNumber
            },
            transDate: account.transDate,
            createDate: (new Date()).toISOString(),
            year: time.substring(0, 4),
            month: time.substring(4, 6),
            day: time.substring(6, 8)
        };
        console.log('here output the paymentobject');
        console.log(paymentObject);
        repoPayment.save(paymentObject, false);
    }

    that.checkAccountPaymentExist = async function(options){
        console.log("entering account detail info show the options are ");
        console.log(options);
        let accountId = options.id
        let payment = await repoPayment.query("select id from Payment where toAccountId = '" + accountId + "' and categoryId != 10" );
        console.log("return the payment record about this account");
        console.log(payment);
        console.log(payment.length);
        if (payment.length === 0){
            return true;
        } 
        else {
            return false;
        }
    }

    that.deleteAccountInitPayment = async function (options) {
        console.log("entering account detail info show the options are ");
        console.log(options);
        let accountId = options.id
        let payment = await repoPayment.query("select id from Payment where toAccountId = '" + accountId + "' and categoryId = 10" );
        console.log("return the options now for query");
        console.log(payment);
        return repoPayment.delete({id:payment[0].id});
    };

    return that;
};

module.exports = AccountService;
