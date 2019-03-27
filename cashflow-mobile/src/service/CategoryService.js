function CategoryService(connection) {
    const that = {}

    const repo = connection.getRepository("Category");

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

    that.findByOption = async function (options) {
        options = options || { where: {} };
            let optionsWhere = options.where || {};
            let where = [];
            for (let o in optionsWhere) {
                where.push("category.attr = :attr".replace(/attr/g, o))
            }
            console.log(where);
            console.log(optionsWhere);

        let category =  await repo.createQueryBuilder("category")
            .where(where.join(' and '), optionsWhere)
            .andWhere("code != 'IN-INB'")
            .getMany();
        return category;
    };

    that.findOne = function(options) {
        return repo.findOne(options);
    };

    that.count = function(options) {
        return repo.count(options);
    };

    return that;
};

module.exports = CategoryService;
