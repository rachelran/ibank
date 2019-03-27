function CurrencyService(connection) {
    const that = {}

    const repo = connection.getRepository("Currency");

    that.save = function(o) {
        return repo.save(o);
    };

    that.batchSave = function(o) {
        return repo.save(o);
    };
    
    that.delete = function(options) {
        return repo.delete(options);
    };

    that.find = function(options) {
        return repo.find(options);
    };

    that.findOne = function(options) {
        return repo.findOne(options);
    };

    that.count = function(options) {
        return repo.count(options);
    };

    return that;
};

module.exports = CurrencyService;
