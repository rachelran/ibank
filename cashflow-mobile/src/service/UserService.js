function UserService(connection) {
    const that = {}

    const repo = connection.getRepository("User");

    that.save = function(o) {
        if (!o.id) {
            o.id = o.id || uuid();
        }

        if (!o.createDate) {
            o.createDate = `${new Date().getTime()}`;
        }

        return repo.save(o);
    };

    that.batchSave = function(o) {
        return repo.save(o);
    };
    
    that.register = async function(user) {
        const count = await repo.count({
            "email": user.email,
        });
        if (count > 0) {
            return {
                "status": 400,
                "msg": "The user with the email address has been registered."
            }
        }
        await that.save(user);
        return {
            "status": 200,
            "msg": JSON.stringify({
                msg: "OK"
            })
        }
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

module.exports = UserService;
