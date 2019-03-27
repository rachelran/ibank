import Config from '../manager/Config';

var headers ={
    'Content-Type': 'application/json',
    'SUNING-TENANT-ID': Config.getTenant()
};
//var server = 'http://10.128.167.223:8080/api/';
//var server = 'http://localhost:8080/api/';
var server = 'http://10.128.167.126:8080/api/';

module.exports = {
    initializeHeader: function () { 
        headers['SUNING-TENANT-ID'] = Config.getTenant();
    },
    ajaxGet: function (path, bIgnoreAuth) {
        let mParam = {
            method: 'GET',
            headers: headers
        };       
        return fetch(server + path, mParam)
            .then(response => {
                if (response.status !== 200) {
                    return response.json().then(ex => Promise.reject(ex));
                } else {
                    return response.json();
                }
            })
    }
}