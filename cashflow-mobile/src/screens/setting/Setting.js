import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Platform
} from 'react-native';
import B1Dropdown from '../base/control/B1Dropdown';
import {
    MenuProvider
} from 'react-native-popup-menu';
import I18n from 'react-native-i18n';
import Utility from '../utility';
import RNRestart from 'react-native-restart';
import AllServices from '../../service';
import B1Manager from "../../manager/B1Manager";

export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
        this.state = {
            "lan": null,
            "selectCurrencyName":null,
            "selectCurrency": null,
            "currencies": [],
            "readonly": false
        };
    }

    componentWillMount() {
        Promise.all([
            Utility.getLanguage(),
            AllServices.CurrencyService(B1Manager.getConnection()).find(),
            AllServices.AccountService(B1Manager.getConnection()).count()
        ])
        .then(([lan, currencies, count]) => {
            var options = [];
            currencies.map((item) => {
                options.push({
                    "key": item.code,
                    "text": item.name
                });
            });
            this.setState({
                "lan": lan,
                "selectCurrencyName": Utility.getSelectCurrency().name,
                "selectCurrency": Utility.getSelectCurrency().code,
                "currencies": options,
                "readonly": count > 0
            });
        });
    }

    render() {
        if (!this.state.lan) {
            return null;
        }

        const readonly = this.state.readonly;
     
        let currencyView = null;
        if (!readonly) {
          currencyView = <B1Dropdown 
                options = {this.state.currencies}
                selectedKey = { this.state.selectCurrency }
                onSelect = { this._onCurrencyChange }/>;
        } else {
          currencyView = <View>
                 <Text> {this.state.selectCurrencyName}</Text>
              </View>;
        }
 
        return (
            <MenuProvider>
                <View style = { styles.container }>
                    <View style = { styles.lanContainer }>
                        <Text>{ I18n.t('setting.language_txt') }</Text>
                        <B1Dropdown 
                            options = {[
                                { key: 'en', text: I18n.t('setting.english') },
                                { key: 'jp', text: I18n.t('setting.japanese') },
                                { key: 'cn', text: I18n.t('setting.chinese') }
                            ]}
                            selectedKey = { this.state.lan }
                            onSelect = { this._onLanguageChange }
                        />
                    </View>
                    <View style = { styles.currencyContainer }>
                        <Text>{ I18n.t('setting.currency_txt') }</Text>
                        {currencyView}
                    </View>
                </View>
            </MenuProvider>
        )
    }

    _onNavigatorEvent(event) {
        Utility.handleNavigatorEvent(this.props.navigator, event);
    }

    _onLanguageChange = value => {
        Utility.setLanguage(value).then(_ => {
            RNRestart.Restart() ;
        });
    }

    _onCurrencyChange = value => {
        let conn = B1Manager.getConnection();

        AllServices.SettingService(conn).update({"key": "currency", "value": value})
        .then(() => {
           console.log("SettingService update done ");
           return AllServices.CurrencyService(conn).findOne({"code": value});
        })
        .then(curreny => {
            console.log(curreny);
            Utility.setCurrency(curreny);
            this.setState({
                "selectCurrency": curreny.code
            });
            //Platform.OS === 'ios' ? RNRestart.Restart() : RestartAndroid.restart();
        })
        .catch((error) => {
            console.log(error);
        });
    }
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10
    },
    lanContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    currencyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        justifyContent: 'space-between'
    }
})