let sToken = null;
let sEmail = null;
let sName = null;
import {
    Platform
} from 'react-native';

module.exports = {
    server: 'http://47.96.8.200:3000',
    // server: 'http://116.62.175.66:3000',
    setToken: function(token, email, name) {
        sToken = token;
        sEmail = email;
        // sName = name;
        sName = "张三";
    },
    getToken: function() {
        return {
            token: sToken,
            email: sEmail,
            name: sName
        };
    },
    getTenant:function(){
        return sEmail;
    },

    appInstallationServer: "https://smbinnovationlab.github.io",
    androidAppURL: 'https://smbinnovationlab.github.io/Cashflow/android/Cashflow.apk'
}