function SettingService(connection) {
    const that = {}

    const repo = connection.getRepository("Setting");

    that.save = function(o) {
        return repo.save(o);
    };

    that.update = function(o) {
        console.log("SettingService update begin ", o);
       
        let oPromise = new Promise(function(resolve, reject){
            repo.findOne({"key": o.key})
            .then(setting => {
                console.log(setting);
                setting.value = o.value;
                console.log(setting);
                return repo.save(setting);
            }).then(res => {
                console.log("SettingService update  done");
                resolve();
            }).catch(error => {
                reject(error);
            });  
        });

        return oPromise;
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

module.exports= SettingService;
