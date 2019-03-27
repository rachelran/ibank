import '@babel/polyfill'
import { AppRegistry } from 'react-native';
import App from './src/app'
// import { YellowBox } from 'react-native';
import I18n from 'react-native-i18n';
import en from './locales/en.json';
import jp from './locales/jp.json';
import cn from './locales/cn.json';
I18n.fallbacks = true;
I18n.translations = {
    en,
    jp,
    cn
};

// YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
// AppRegistry.registerComponent('Cashflow', () => App);


// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

if(!String.prototype.padStart) {
    String.prototype.padStart = function (maxLength, fillString=' ') {
            if(Object.prototype.toString.call(fillString) !== "[object String]") {
                fillString = ''+fillString;
            }
            let str = this;
            if(str.length >= maxLength) return String(str)

            let fillLength = maxLength - str.length, 
                    times = Math.ceil(fillLength / fillString.length)
            
            while(times >>= 1) { 
                fillString += fillString
                    if(times === 1){
                        fillString += fillString
                    }     
            }
            return fillString.slice(0, fillLength) + str  
        }
}

