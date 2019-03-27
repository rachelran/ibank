import React, {Component} from 'react';
import {
    StyleSheet,
    Alert,
    View,
    TouchableOpacity,
    Text,
    Image,
    FlatList
} from 'react-native';
import B1DetailForm, {FORM_FIELD_TYPE} from '../base/form/B1DetailForm';
import utility from '../utility';
import B1Manager from "../../manager/B1Manager";
import I18n from 'react-native-i18n';
import ImagePicker from 'react-native-image-picker';
import Config from '../../manager/Config';
import { AccountService } from '../../service/AccountService';
import AllServices from '../../service';


const BTN_IMPORT_ATTACHMENT = "BTN_IMPORT_ATTACHMENT";

export default class AccountListDetail extends Component {
    constructor(props) {
        super(props);
        //console.log(this.props);

        let navigator = this.props.navigator;
        navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));

        this.state = {
            data: null,
            loading: false,
            attachmentPaths: [],
            showTaxRateFields: false
        };
    }

    componentWillMount() {
        this._loadData(this.props.id, this.props.accountType);
        //
        // let oPaymentService = getPaymentService(B1Manager.getConnection());
        //
        // if (this.props.id) {
        //     oPaymentService.find_by_id(this.props.id).then(res => {
        //         console.log(res);
        //         this.setState({
        //             data: res
        //         });
        //     });
        // } else {
        //     //jacky need provide the initial data of a new object
        //     this.setState({
        //         data: {
        //             date: utility.fromDateToYyyyMmDd(new Date()),
        //             type: this.props.type, //IN or OUT
        //             amount: 0,
        //             status: 'Draft',
        //             lines: [],
        //             source: 'external'
        //         }
        //     });
        // }
    }

    render() {
        if (this.state.data) {
            // let readonly = (this.state.data.status === 'Posted');
            let readonly = this.state.data.hasOwnProperty("id");
            
            let oAccounttService = AllServices.AccountService(B1Manager.getConnection());

            if(readonly){
                var firstSectionRows = [
                    {
                        type: FORM_FIELD_TYPE.MONEY_INPUT,
                        title: I18n.t('account.detail.amount_label'),
                        readonly: readonly,
                        valueField: 'amount'
                    },
                    {
                        type: FORM_FIELD_TYPE.SELECT,
                        title: I18n.t('account.detail.account_type'),
                        valueField: 'accountType.id',
                        descField: 'accountType.name',
                        readonly: readonly,
                            options: {
                                screen: 'b1lite.AccountTypeList',
                                descField: 'name',
                                valueField: 'id'
                            }
                    },
                    {
                        type: FORM_FIELD_TYPE.SELECT,
                        title: I18n.t('account.detail.bank'),
                        valueField: 'bank.id',
                        descField: 'bank.name',
                        readonly: readonly,
                        changedField: 'accountType.id',
                        options: {
                            screen: 'b1lite.BankTypeList',
                            descField: 'name',
                            valueField:'id'
                        }
                    },
                    {
                        type: FORM_FIELD_TYPE.SELECT,
                        title: I18n.t('account.detail.currency'),
                        valueField: 'currency.id',
                        descField: 'currency.name',
                        readonly: readonly,
                        options: {
                            screen: 'b1lite.CurrencyTypeList',
                            descField: 'name',
                            valueField:'id'
                        }
                    }
                ];
                    switch (this.state.data.accountType.id) {
                        case 1:
                            img = <Image source={require('../../../assets/img/counter.png')} style={styles.image}/>
                        break;
                        case 2:
                            img = <Image source={require('../../../assets/img/bank.png')} style={styles.image}/>
                            break;
                        case 3:
                            img = <Image source={require('../../../assets/img/alipay.png')} style={styles.image}/>
                            break;
                        case 4:
                            img = <Image source={require('../../../assets/img/wechatpay.png')} style={styles.image}/>
                        break;
                        default:
                            break;}
            }else{
                var firstSectionRows = [
                    {
                        type: FORM_FIELD_TYPE.MONEY_INPUT,
                        title: I18n.t('account.detail.amount_label'),
                        readonly: readonly,
                        valueField: 'amount'
                    },
                    {
                        type: FORM_FIELD_TYPE.SELECT,
                        title: I18n.t('account.detail.account_type'),
                        valueField: 'accountType.id',
                        descField: 'accountType.name',
                        readonly: readonly,
                            options: {
                                screen: 'b1lite.AccountTypeList',
                                descField: 'name',
                                valueField: 'id'
                            }
                    },
                    {
                        type: FORM_FIELD_TYPE.TEXT_INPUT,
                        title: I18n.t('account.detail.account_name'),
                        readonly: readonly,
                        valueField: 'accountName'
                    },
                    {
                        type: FORM_FIELD_TYPE.CUSTOM_TEXTINPUT,
                        title: I18n.t('account.detail.account_number'),
                        readonly: readonly,
                        valueField: 'accountNumber',
                        changedField:'accountType.id'
                    },
                    {
                        type: FORM_FIELD_TYPE.SELECT,
                        title: I18n.t('account.detail.bank'),
                        valueField: 'bank.id',
                        descField: 'bank.name',
                        readonly: readonly,
                        changedField: 'accountType.id',
                        options: {
                            screen: 'b1lite.BankTypeList',
                            descField: 'name',
                            valueField:'id'
                        }
                    },
                    {
                        type: FORM_FIELD_TYPE.SELECT,
                        title: I18n.t('account.detail.currency'),
                        valueField: 'currency.id',
                        descField: 'currency.name',
                        readonly: true,
                        options: {
                            screen: 'b1lite.CurrencyTypeList',
                            descField: 'name',
                            valueField:'id'
                        }
                    }

                ];
            }

            let layout = [
                {
                    data: firstSectionRows
                }
            ];
            
            layout.push(
                {
                    data: readonly ? [
                        {
                            type: FORM_FIELD_TYPE.BUTTON,
                            title: I18n.t('expense.detail.delete_btn'),
                            options: {
                                onPress: () => {
                                    Alert.alert(I18n.t('payment.detail.delete_confirm_title'),I18n.t('payment.detail.delete_confirm_text'),[
                                        {
                                            text: I18n.t('payment.detail.delete_confirm_positive'),
                                                onPress: () =>{
                                                    let oAccounttService = AllServices.AccountService(B1Manager.getConnection());

                                                    console.log(this.state.data);
                                                    let bDev = global.__DEV__;
                                                    global.__DEV__ = false;
                                                    oAccounttService.checkAccountPaymentExist(this.state.data).then(checkresult=>{
                                                    console.log("check result is " + checkresult);
                                                    if (checkresult === true){
                                                    oAccounttService.deleteAccountInitPayment(this.state.data).catch(ex => {
                                                        Alert.alert(I18n.t('payment.detail.post_error_msg', {msg: JSON.stringify(ex)}));
                                                    })
                                                    .then(()=>oAccounttService.delete(this.state.data))
                                                    .then(d => {
                                                            Alert.alert(I18n.t('expense.detail.delete_success_msg'), null, [
                                                                {
                                                                    text: I18n.t('ok_btn'),
                                                                    onPress: () => this._onNavigatePop()
                                                                }
                                                            ]);
                                                        }).catch(ex => {
                                                            console.reportErrorsAsExceptions = false;
                                                            Alert.alert(I18n.t('account.detail.delete_error'), {msg: "unable to delete"} [
                                                                {
                                                                    text: I18n.t('ok_btn'),
                                                                    onPress: () => this._onNavigatePop()
                                                                }
                                                            ]);
                                                        }).finally(() => {
                                                            global.__DEV__ = bDev;
                                                        });
                                                    }else {
                                                        Alert.alert(I18n.t('account.detail.delete_error'), I18n.t('account.detail.delete_error_exist_text'), [
                                                            {
                                                                text: I18n.t('ok_btn'),
                                                                onPress: () => this._onNavigatePop()
                                                            }
                                                        ]);
                                                    } 
                                                    })  
                                                }
                                        },
                                        {
                                            text: I18n.t('payment.detail.delete_confirm_negative')
                                        }
                                    ]);
                                }
                            }
                        }
                    ] : [
                        {
                            type: FORM_FIELD_TYPE.BUTTON,
                            title: I18n.t('account.detail.post_btn'),
                            options: {
                                onPress: () => {
                                    if(!this.state.data.accountType){
                                        Alert.alert(I18n.t('account.detail.save_error'));
                                        return;    
                                    }
                                    let oAccountService = AllServices.AccountService(B1Manager.getConnection());
                                    let newData = Object.assign({}, this.state.data);
                                    oAccountService.save(newData)
                                    .then(res=>{
                                        let oAccountService = AllServices.AccountService(B1Manager.getConnection());
                                        oAccountService.initialAccountBalance(res);
                                    })
                                    .then(() => {
                                        Alert.alert(I18n.t('account.detail.post_success_msg'), null, [
                                            {
                                                text: I18n.t('ok_btn'),
                                                onPress: () => this._onNavigatePop()
                                            }
                                        ]);
                                    })
                                }
                            }
                        }
                    ]
                }
            );
       
            return (
                <View style={{flex: 1}}>
                    {readonly ? (
                            <View>
                                <View style={{height: 100, flexDirection: 'row' }}>
                                    <View style={{flex: 1}}>
                                        <TouchableOpacity
                                            style={styles.container}>
                                            <View style={styles.line}>
                                                <View style={{flexDirection: 'row'}}>
                                                    <View style={styles.image}>{img}</View>
                                                    <View style={styles.textContainer}>
                                                    <Text style={styles.name}>{this.state.data.accountName}{'('+I18n.t('account.detail.account_name')+')'}</Text>
                                                    <Text style={styles.code}>{this.state.data.accountNumber}</Text>
                                                </View>
                                            </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <B1DetailForm data={this.state.data}
                                    layout={layout}
                                    loading={this.state.loading}
                                    onNavigatePush={this._onNavigatePush.bind(this)}
                                    onNavigatePop={this._onNavigatePop.bind(this)}
                                    onDataChange={(data, field) => {
                                        //auto calculate tax amount
                                        //   if (field === 'taxRate.value' || field === 'amount') {
                                        //       data.taxAmount = data.taxRate.value * data.amount / 100;
                                        //   }
                                        //auto fill amount
                                        if (field === 'lines' && data.lines.length > 0) {
                                            let lastLine = data.lines[data.lines.length - 1];

                                            if (lastLine.amount === 0) {
                                                //auto fill the rest of amount
                                                let rest = data.amount || 0;

                                                for (let l of data.lines) {
                                                    rest -= l.amount;
                                                }

                                                lastLine.amount = rest;
                                            }
                                        }
                                        if (field === 'lines') {
                                            //bring back the amount
                                            let fNewAmount = 0;
                                            for (let l of data.lines) {
                                                fNewAmount += l.amount;
                                            }
                                            data.amount = fNewAmount;
                                        }
                                        this.setState({
                                            data: data
                                        })
                                    }}
                                />
                            </View>
                          ) : (
                            <B1DetailForm data={this.state.data}
                                layout={layout}
                                loading={this.state.loading}
                                onNavigatePush={this._onNavigatePush.bind(this)}
                                onNavigatePop={this._onNavigatePop.bind(this)}
                                onDataChange={(data, field) => {
                                    //auto calculate tax amount
                                    //   if (field === 'taxRate.value' || field === 'amount') {
                                    //       data.taxAmount = data.taxRate.value * data.amount / 100;
                                    //   }
                                    //auto fill amount
                                    if (field === 'lines' && data.lines.length > 0) {
                                        let lastLine = data.lines[data.lines.length - 1];

                                        if (lastLine.amount === 0) {
                                            //auto fill the rest of amount
                                            let rest = data.amount || 0;

                                            for (let l of data.lines) {
                                                rest -= l.amount;
                                            }

                                            lastLine.amount = rest;
                                        }
                                    }
                                    if (field === 'lines') {
                                        //bring back the amount
                                        let fNewAmount = 0;
                                        for (let l of data.lines) {
                                            fNewAmount += l.amount;
                                        }
                                        data.amount = fNewAmount;
                                    }
                                    this.setState({
                                        data: data
                                    })
                                }}
                    />
                        )}
                </View>
            )
        } else {
            return null;
        }
    
    }

    _onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress' && event.id === BTN_IMPORT_ATTACHMENT) {
            //this._onShowImagePicker();
        }

        utility.handleNavigatorEvent(this.props.navigator, event);
    }

    _onNavigatePush(param) {
        this.props.navigator.push(param);
    }    
    
    _onNavigatePop() {
        this.props.navigator.pop();
    }

    _loadData(id,accountType) {
        if (id) {
            var oAccounttService = AllServices.AccountService(B1Manager.getConnection());
            oAccounttService.find_by_id(id).then(res => {
                //console.log(res);
                this.setState({
                    data: res
                });
            });
        } else {
                this.setState({
                    data: {
                        "amount": "",
                        "accountName":"",
                        "accountNumber": "",
                        "currency":utility.getSelectCurrency(),
                        "transDate": utility.fromDateToYyyyMmDd(new Date()),
                        "createdBy": Config.getToken().name
                    }
                });
            }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginTop: 10,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10, 
        height:100,
    },
    line: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 15,
        height: 55
    },
    textContainer:{
        flexDirection: 'column', 
        justifyContent: 'center',
        marginLeft:8
    },
    name: {
        color: '#474747',
        fontSize: 20
    },
    code: {
        color: 'gray',
        fontSize: 14
    },
    amount: {
        color: '#3C86FC',
        fontSize: 20,
        fontWeight: 'bold'
    },
    typeTitle: {
        marginTop: 8,
        marginBottom: 8,
        color: '#3C86FC',
        fontSize: 15
    },
    image:{
        height: 40,
        width: 40,
        resizeMode:'contain',
        alignItems:'center',
        marginRight:4,
        marginLeft:4,
        }
});