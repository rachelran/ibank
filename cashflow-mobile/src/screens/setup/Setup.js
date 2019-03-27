import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    AsyncStorage
} from 'react-native';
import B1Button from '../base/control/B1Button';
import InputPopupScreen from './InputPopupScreen';
import InputPopupItem from './InputPopupItem';
import utility from '../utility';
import B1Manager from "../../manager/B1Manager";
import Spinner from 'react-native-loading-spinner-overlay';
import I18n from 'react-native-i18n';

export default class Setup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            bLoading: false,
            error: null
        };

        if (global.__DEV__) {
            let name = 'USER_' + utility.randomString(4);
            this.state = {
                name: name,
                email: name + '@sap.com',
                password: '1234'
            };
        }
    }

    render() {
        return (
            <InputPopupScreen>
                <Spinner visible={this.state.bLoading}
                         textStyle={{color: 'black'}}
                         overlayColor="rgba(0, 0, 0, 0.5)"/>
                <InputPopupItem
                    img={require('../../../assets/img/setup/name.png')}
                    placeholder={I18n.t('setup.name')}
                    value={this.state.name}
                    onChangeText={text => this.setState({name: text})}/>
                <InputPopupItem
                    img={require('../../../assets/img/setup/email.png')}
                    placeholder={I18n.t('login.email_input')}
                    value={this.state.email}
                    onChangeText={text => this.setState({email: text})}/>
                <InputPopupItem
                    img={require('../../../assets/img/setup/password.png')}
                    placeholder={I18n.t('login.password_input')}
                    password={true}
                    value={this.state.password}
                    onChangeText={text => this.setState({password: text})}/>
                {this.state.error ? <Text style={styles.errorText}>{this.state.error}</Text> : null}
                <B1Button
                    style={styles.signUpBtn}
                    title={I18n.t('setup.signUp_btn')}
                    onPress={() => {
                        this._onSignUpBtnPress()
                    }}/>
                <TouchableOpacity onPress={() => {
                    utility.navigateToLogin(this.props.navigator)
                }}>
                    <Text style={styles.orText}>{I18n.t('setup.have_account_txt')}</Text>
                </TouchableOpacity>
            </InputPopupScreen>
        )
    }

    _onSignUpBtnPress() {
        this.setState({
            bLoading: true,
            error: null
        });

        utility.ajaxPost('/register', {
            name: this.state.name,
            email: this.state.email.toLowerCase(),
            password: this.state.password
        }, true).then(res => {
            return B1Manager.login(this.state.email, this.state.password)
        }).then(() => {
            this.setState({
                bLoading: false
            });

            const navigator = this.props.navigator;
            navigator.setDrawerEnabled({
                side: 'left',
                enabled: true
            });
            navigator.resetTo({
                screen: 'b1lite.Home',
                animated: true,
                navigatorStyle: utility.navigatorStyle
            });
        }).catch(ex => {
            this.setState({
                bLoading: false,
                error: ex.message
            });
            // console.log(ex.message);
            // Alert.alert('Error', ex.message, [
            //     {text: 'OK', onPress: () => console.log('OK Pressed')},
            // ])
        });


    }
}

const styles = StyleSheet.create({
    signUpBtn: {
        marginTop: 40,
    },
    orText: {
        marginTop: 10,
        fontSize: 14,
        color: '#9B9B9B',
        textAlign: 'center'
    },
    loginBtn: {
        marginTop: 10
    },
    errorText: {
        marginTop: 10,
        fontSize: 14,
        color: 'red',
        textAlign: 'center'
    }
});