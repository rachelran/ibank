import utility from '../screens/utility';

module.exports = {
    postCommand: function(sService, sMethod, args) {
        return utility.ajaxPost('/sync', {
            service: sService,
            method: sMethod,
            args: args || []
        })
    },
    postAttachment: function(fileData) {
        return utility.ajaxPostFile('/upload', fileData);
    },
    postAttachmentWithOCR: function(fileData) {
        return utility.ajaxPostFile('/ocr', fileData);
    },
    getTenants: function() {
        return new Promise(function(resolve, reject) {
            resolve([
                    {
                        "id": "General",
                        "name": "General"
                    },
                    {
                        "id": "DemoCN",
                        "name": "DemoCN"
                    },
                    {
                        "id": "DemoUS",
                        "name": "DemoUS"
                    }
            ]);
        });
        //return utility.ajaxGet('/tenants');
    },
    auth: function(data) {
        return new Promise(function(resolve, reject) {
            resolve({
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiIxIiwiZW1haWwiOiJUZW5hbnQwMSJ9LCJpYXQiOjE1NDY5MzQ4MjF9.ztxISD_2BHso-agflu5nwrLkiuYvjdrRMm7KCvG4mUg",
                    "message": "Header Authorization: Bearer <token>",
                    "user": {
                        "name": data.email,
                        "email": data.email
                    }
                });
        });
        //fetch(Config.server + '/auth', {
        // method: 'POST',
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        // },
        // body: formBody.join("&")
    },
    getReportData: function() {
        return utility.ajaxGet('/b1chart');
    },
    getProfitData: function() {
        return utility.ajaxGet('/b1profits');
    }
}