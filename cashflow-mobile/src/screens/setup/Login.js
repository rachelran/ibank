import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TextInput,
    AsyncStorage,
    TouchableOpacity,
    Alert
} from 'react-native';
import B1Button from '../base/control/B1Button';
import InputPopupScreen from './InputPopupScreen';
import InputPopupItem from './InputPopupItem';
import utility from '../utility';
import B1Manager from '../../manager/B1Manager';
import Spinner from 'react-native-loading-spinner-overlay';
import I18n from 'react-native-i18n';
import B1Dropdown from '../base/control/B1Dropdown';
import { MenuProvider } from 'react-native-popup-menu';
import PopupItem from './PopupItem';
import RemoteManager from '../../manager/RemoteManager';

export default class Login extends Component {
    constructor(props) {
        super(props);
        let navigator = this.props.navigator;
        navigator.setStyle({
            navBarHidden: true
        });
        navigator.setDrawerEnabled({
            side: 'left',
            enabled: false
        });

        this.state = {
            name: '',
            password: '',
            bLoading: false,
            error: '',
            tenants: [],
            selectedTenant: null
        }
    }

    componentDidMount() {
        RemoteManager.getTenants().then(res => {
            let tenants = res.map(item => {
                return {
                    key: item.id,
                    text: item.name
                }
            });
            if (tenants.length > 0) {
                this.setState({
                    tenants,
                    selectedTenant: tenants[0].key
                });
            }
        });
    }

    render() {
        return (
            <MenuProvider>
                <InputPopupScreen>
                    <Spinner visible={this.state.bLoading}
                                textStyle={{color: 'black'}}
                                overlayColor="rgba(0, 0, 0, 0.5)"/>
                    <PopupItem>
                        <Image source={require('../../../assets/img/setup/email.png')}/>
                        <View style = { styles.dropdown }>
                            {
                                this.state.tenants.length > 0 ? 
                                    <B1Dropdown
                                        options = { this.state.tenants }
                                        selectedKey = { this.state.selectedTenant }
                                        onSelect = { this._onSelectDropdownValue.bind(this) }
                                        customStyles = { {
                                            triggerWrapper: {
                                                paddingTop: 5,
                                                paddingBottom: 5, 
                                                paddingRight: 15
                                            },
                                            triggerText: {fontSize: 15}
                                        }}
                                    /> : null
                            }
                        </View>
                    </PopupItem>
                    <InputPopupItem
                        img={require('../../../assets/img/setup/name.png')}
                        placeholder={I18n.t('setup.name')}
                        value={this.state.name}
                        onChangeText={text => this.setState({name: text})}/>
                    <InputPopupItem
                        img={require('../../../assets/img/setup/password.png')}
                        placeholder={I18n.t('login.password_input')}
                        password={true}
                        alue={this.state.password}
                        onChangeText={text => this.setState({password: text})}/>
                    {this.state.error ? <Text style={styles.errorText}>{this.state.error}</Text> : null}
                    <B1Button
                        style={styles.loginBtn}
                        title={I18n.t('login.login_btn')}
                        onPress={this._onLoginBtnPress.bind(this)}/>

                    {/* <TouchableOpacity onPress={() => {
                        utility.navigateToSignUp(this.props.navigator)
                    }}>
                        <Text style={styles.hintText}>{I18n.t('login.create_account_txt')}</Text>
                    </TouchableOpacity> */}
                </InputPopupScreen>
            </MenuProvider>
        )
    }

    _onSelectDropdownValue(value) {
        this.setState({selectedTenant: value});
    }

    _onLoginBtnPress() {

        this.setState({
            bLoading: true,
            error: null
        });

        return B1Manager.login(this.state.selectedTenant, this.state.password)
            .then(() => {
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
            })
            .catch(ex => {
                console.warn(ex);
                this.setState({
                    error: ex.message
                });
                // Alert.alert('Error', ex.message);
            })
            .finally(() => {
                this.setState({
                    bLoading: false
                });
            });
    }
}

const styles = StyleSheet.create({
    loginBtn: {
        marginTop: 40,
    },
    hintText: {
        marginTop: 10,
        fontSize: 14,
        color: '#9B9B9B',
        textAlign: 'center'
    },
    signUpBtn: {
        marginTop: 10
    },
    errorText: {
        marginTop: 10,
        fontSize: 14,
        color: 'red',
        textAlign: 'center'
    },
    dropdown: {
        flex: 2,
        marginLeft: 10
    }
});