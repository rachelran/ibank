import {
    Platform,
    AsyncStorage,
    Alert,
    Linking
} from 'react-native';
import {
    Navigation,
    ScreenVisibilityListener
} from 'react-native-navigation';
import {
    registerScreens
} from './screens';
import B1Manager from './manager/B1Manager';
import RestClient from './manager/RestClient';
import I18n from 'react-native-i18n';
import Utility from './screens/utility';
import Config from './manager/Config';
import { AdvancedConsoleLogger } from 'typeorm/browser';

//const debug = false;
let oPromise = Utility.getLanguage().then(lan => {
    I18n.locale = lan;
    registerUpdateCheck();
});
// if (debug) {
//     oPromise = new Promise(resolve => { resolve()});
// } else {
//     oPromise = B1Manager.prepareContent();
// }

oPromise.then(() => {
    registerScreens();

    return B1Manager.unstashLogin()
        .then(bLogin => {
            if (bLogin) {
                startApp('b1lite.Home');
            } else {
                startApp('b1lite.Welcome');
            }
            RestClient.initializeHeader();
        })
        .catch(ex => {
            console.error(ex);
            startApp('b1lite.Welcome');
        });
});

function registerUpdateCheck() {
    new ScreenVisibilityListener({
        didAppear: ({screen, startTime, endTime, commandType}) => {
            console.log('screenVisibility', `Screen ${screen} displayed in ${endTime - startTime} millis [${commandType}]`)
            if (! this.hasCheckedUpdate) {
                this.hasCheckedUpdate = true;
                Utility.checkIfNeedUpdateApp().then(needUpdate => {
                    if (needUpdate) {
                        Alert.alert(
                            I18n.t('update.title'),
                            I18n.t('update.msg'),
                            [
                                {
                                    text: I18n.t('cancel_btn'), 
                                    style: 'cancel'
                                },
                                {
                                    text: I18n.t('update.download_btn'),
                                    onPress: () => {
                                        Linking.openURL(Platform.select({
                                            ios: Config.appInstallationServer,
                                            android: Config.androidAppURL
                                        }));
                                    }
                                }
                            ],
                            { cancelable: false }
                        );
                    }
                });
            }
            
        }
    }).register();
}

function startApp(id) {
    Navigation.startSingleScreenApp({
        screen: {
            screen: id,
            navigatorStyle: {
                navBarHidden: true
            }
        },
        drawer: {
            left: {
                screen: 'b1lite.Menu',
                disableOpenGesture: false
            },
            style: {
                // ( iOS only )
                drawerShadow: true,
                contentOverlayColor: 'rgba(0,0,0,0.25)',
                leftDrawerWidth: 70,
            },
            type: 'MMDrawer',
            animationType: 'parallax',
            disableOpenGesture: false
        },
    });
}