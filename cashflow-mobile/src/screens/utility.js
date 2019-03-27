import Config from "../manager/Config";
import I18n from 'react-native-i18n';
import {
    AsyncStorage
} from 'react-native';
import VersionCheck from 'react-native-version-check';
import RNFS from 'react-native-fs';

var gSetting = {
    "currency": {
        "id": "1",
        "code": "CNY",
        "name": "CNY",
        "symbol": "¥"
    }
};

module.exports = {
    navigatorStyle: {
        navBarBackgroundColor: '#1E508B',
        navBarButtonColor: 'white',
        navBarTextColor: 'white',
        navBarTextFontSize: 17,
        navBarComponentAlignment: 'center',
        navBarHidden: false
    },
    handleNavigatorEvent: function(navigator, event) {
        if (event.type == 'NavBarButtonPress') {
            if (event.id == 'sideMenu') {
                navigator.toggleDrawer({
                    side: 'left',
                    animated: true
                });
            }
        } else if (event.type == 'DeepLink') {
            if (event.link == 'b1lite.Login') {
                navigator.resetTo({
                    screen: event.link,
                    navigatorStyle: {
                        navBarHidden: true
                    }
                });
                return;
            }

            var item = event.payload;
            navigator.resetTo({
                screen: event.link,
                title: '',
                animated: false,
                passProps: {'params':item},
                backButtonTitle: '',
                navigatorStyle: this.navigatorStyle,
                navigatorButtons: {
                    leftButtons: [
                        {
                            id: 'sideMenu',
                            icon: require('../../assets/img/sidemenu.png')
                        }
                    ]
                }
            });
        }
    },
    navigateToLogin: function(navigator) {
        navigator.push({
            screen: 'b1lite.Login',
            navigatorStyle: {
                navBarHidden: true
            }
        });
    },
    navigateToSignUp: function(navigator) {
        navigator.push({
            screen: 'b1lite.Setup',
            navigatorStyle: {
                navBarHidden: true
            }
        });
    },
    // from (2018, 5, 15) to "20180515"
    fromYMDToYyyyMmDd: function(year, month, day) {
        return `${year}${String(month).padStart(2, 0)}${String(day).padStart(2, 0)}`
    },
    fromYyyyMmDdToDate: function(yyyymmdd) {
        if (!/^(\d){8}$/.test(yyyymmdd)) {
            throw new Error(`invalid date: ${yyyymmdd}, must be yyyymmdd format`);
        }
        var y = yyyymmdd.substr(0, 4),
            m = parseInt(yyyymmdd.substr(4, 2)) - 1,
            d = yyyymmdd.substr(6, 2);
        return new Date(y, m, d);
    },
    //from date to "2018-10-01"
    fromDateToYyyy_Mm_Dd: function(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, 0)}-${String(date.getDate()).padStart(2, 0)}`
    },
    fromDateToYyyyMmDd: function(date) {
        return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, 0)}${String(date.getDate()).padStart(2, 0)}`
    },
    fromDateToYyyyMm: function(date) {
        return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, 0)}`
    },
    fromDateToMMM_Yyyy: function(date) {
        const monthNames = [
            I18n.t('month.jan.full'),
            I18n.t('month.feb.full'),
            I18n.t('month.mar.full'),
            I18n.t('month.apr.full'),
            I18n.t('month.may.full'),
            I18n.t('month.jun.full'),
            I18n.t('month.jul.full'),
            I18n.t('month.aug.full'),
            I18n.t('month.sep.full'),
            I18n.t('month.oct.full'),
            I18n.t('month.nov.full'),
            I18n.t('month.dec.full')
        ];
        return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
    },
    fromDateToMM_Yyyy: function(date) {
        return `${this.getShortMonthText(date.getMonth())} ${date.getFullYear()}`
    },
    fromYyyy_Mm_DdToDate: function(Yyyy_Mm_Dd) {
        return new Date(Yyyy_Mm_Dd);
    },
    getShortMonthText: function(month) {
        const monthNames = [
            I18n.t('month.jan.short'),
            I18n.t('month.feb.short'),
            I18n.t('month.mar.short'),
            I18n.t('month.apr.short'),
            I18n.t('month.may.short'),
            I18n.t('month.jun.short'),
            I18n.t('month.jul.short'),
            I18n.t('month.aug.short'),
            I18n.t('month.sep.short'),
            I18n.t('month.oct.short'),
            I18n.t('month.nov.short'),
            I18n.t('month.dec.short')
        ];
        return monthNames[month];
    },
    changeMonth: function(iMonthDiff, date) {
        date = date || new Date();
        return new Date(date.getFullYear(), date.getMonth() + iMonthDiff, date.getDate());
    },
    //path: 'a.b'
    getValueByPath: function(obj, path) {
        if (!path) {
            return undefined;
        }

        let root = obj;

        for (let s of path.split('.')) {
            if (root && root.hasOwnProperty(s)) {
                root = root[s];
            } else {
                return undefined;
            }
        }

        return root;
    },
    setValueByPath: function(obj, path, value) {
        if (!path) {
            return undefined;
        }
        let root = obj;
        let aPath = path.split('.');
        let sLast = aPath[aPath.length - 1];

        for (let i = 0; i < aPath.length - 1; i++) {
            if (!root.hasOwnProperty(aPath[i])) {
                root[aPath[i]] = {};
            }

            if (root[aPath[i]] === null) {
                root[aPath[i]] = {};
            }

            root = root[aPath[i]];
        }

        root[sLast] = value;

        return undefined;
    },
    ajaxPost: function(path, data, bIgnoreAuth) {
        let mParam = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        if (!bIgnoreAuth) {
            mParam.headers.Authorization = "Bearer " + Config.getToken().token;
        }

        return fetch(Config.server + path, mParam)
            .then(response => {
                if (response.status !== 200) {
                    return response.json().then(ex => Promise.reject(ex));
                } else {
                    return response.json();
                }
            })
    },
    ajaxPostFile: function(path, fileData) {
        let body = new FormData();
        body.append('file', fileData);

        let mParam = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Config.getToken().token}`
            },
            body
        };

        return fetch(Config.server + path, mParam)
            .then(response => {
                if (response.status !== 200) {
                    return response.json().then(ex => Promise.reject(ex));
                } else {
                    return response.json();
                }
            })
    }, 
    ajaxGet: function(path, bIgnoreAuth) {
        let mParam = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (!bIgnoreAuth) {
            mParam.headers.Authorization = "Bearer " + Config.getToken().token;
        }

        return fetch(Config.server + path, mParam)
            .then(response => {
                if (response.status !== 200) {
                    return response.json().then(ex => Promise.reject(ex));
                } else {
                    return response.json();
                }
            })
    },
    randomString: function(len) {
        return Math.random().toString(36).substring(len);
    },
    /**
     *
     * @param amount
     * @param bPlusSymbol: if amount > 0, force add "+" before the number
     * @return {string} "-1,023,32.32 $"
     */
    formatCurrencyNumber: function(amount, bWithoutSymbol) {
        // let amount = 
        // let money = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let money = amount.toLocaleString("en", {maximumFractionDigits : 2});
        // let n = amount,
        //     c = 2,
        //     d = ".",
        //     s = '',
        //     t = ",",
        //     i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), j;

        // j = (j = i.length) > 3 ? j % 3 : 0;

        // let res = (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, this.getCurrency() + "1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");

        // if (amount < 0) {
        //     s = '-'
        // } else if (amount > 0) {
        //     s = bPlusSymbol ? '+' : ''
        // }

        let symbol = bWithoutSymbol ? "" : this.getCurrency();
        return symbol+" "+money;
    },
    formatShortNumber(num, digits = 0, bChinaFormat) {
        let numSymbol = '';
        if (num < 0) {
            numSymbol = '-';
            num = -num;
        }

        var si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: "k" },
            { value: 1E6, symbol: "M" },
            { value: 1E9, symbol: "G" },
            { value: 1E12, symbol: "T" },
            { value: 1E15, symbol: "P" },
            { value: 1E18, symbol: "E" }
        ];
        if (bChinaFormat) {
            si = [
                { value: 1, symbol: "" },
                { value: 1E3, symbol: "千" },
                { value: 1E4, symbol: "万" },
                // { value: 1E5, symbol: "十万" },
                // { value: 1E6, symbol: "百万" },
                // { value: 1E7, symbol: "千万" },
                { value: 1E8, symbol: "亿" },
                // { value: 1E9, symbol: "十亿" },
                // { value: 1E10, symbol: "百亿" },
                // { value: 1E11, symbol: "千亿" }
            ];
        }
        
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
            break;
            }
        }
        return numSymbol+" "+(num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    },
    formatCurNumber(amount, digits = 0, bWithoutSymbol) {
        let cursymbol = bWithoutSymbol ? "" : this.getCurrency();
        var si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: "k" },
            { value: 1E6, symbol: "M" },
            { value: 1E9, symbol: "G" },
            { value: 1E12, symbol: "T" },
            { value: 1E15, symbol: "P" },
            { value: 1E18, symbol: "E" }
        ];

        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (amount >= si[i].value) {
                break;
            }
        }
        return cursymbol + (amount / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    },        
    getTimePeriodOptions: function() {
        return [
            {key: 'this', text: I18n.t('timePeriod.this_month'), number: 1},
            {key: 'past3', text: I18n.t('timePeriod.past_3_month'), number: 3},
            {key: 'past6', text: I18n.t('timePeriod.past_6_month'), number: 6},
            {key: 'past12', text: I18n.t('timePeriod.past_12_month'), number: 12},
            {key: 'year', text: I18n.t('timePeriod.year', {year: new Date().getFullYear()}), number: new Date().getMonth() + 1},
            {key: 'tillNow', text: I18n.t('timePeriod.till_now'), number: 999999}
        ];
    },
    getPeriodTimeSlot: function(key) {
        var number = 1;
        var periodMap = this.getTimePeriodOptions();
        for (var i = 0; i < periodMap.length; i++) {
            if (periodMap[i].key === key) {
                number = periodMap[i].number;
                break;
            }
        }
        return number;
    },
    uuid: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        })
    },
    getLanguage: function() {
        return AsyncStorage.getItem('lan').then(lan => {
            return lan || 'cn'
        });
    },
    setLanguage: function(lan) {
        return AsyncStorage.setItem('lan', lan);
    },
    checkIfNeedUpdateApp: function() {
        return fetch(Config.appInstallationServer + '/Cashflow/version.json', {
            method: 'GET'
        }).then(res => res.json()).then(data => {
            let latestVersion = data.version;
            let currentVersion = VersionCheck.getCurrentVersion();
            if (currentVersion !== latestVersion) {
                return true;
            } 
            return false;
        }).catch(exp => false);
    },
    getCurrency: function() {
        return gSetting.currency.symbol;
    },
    getSelectCurrency: function() {
        return gSetting.currency;
    },
    setCurrency: function(currency) {
        gSetting.currency = currency;
    },
    getImagePickerOptions: function() {
        return {
            title: null,
            mediaType: "photo",
            cancelButtonTitle: I18n.t("cancel_btn"),
            takePhotoButtonTitle: I18n.t("take_photo_btn"),
            chooseFromLibraryButtonTitle: I18n.t("choose_from_library_btn"),
            cameraType: "back",
            noData: true,
            quality: 0.5,
            storageOptions: {}
        };
    },
    renameFile: function(path, newName) {
        let aOldPath = path.split('/');
        aOldPath.splice(-1, 1);
        let newPath = aOldPath.join('/');
        return RNFS.moveFile(path, `${newPath}/${newName}`);
    },
    getImage: function(filename) {
        let localImageDict = `${RNFS.DocumentDirectoryPath}`;
        let localFilePath = `${localImageDict}/${filename}`;
        return RNFS.exists(localFilePath).then(exists => {
            if (exists) {
                return localFilePath;
            } else {
                return RNFS.downloadFile({fromUrl:`${Config.server}/attachments/${filename}`, toFile: localFilePath}).promise.then(_ => localFilePath);
            }
        })
    },
    isNullOrEmpty : function(data){
      return data == null || data.length == 0;
    }
}
