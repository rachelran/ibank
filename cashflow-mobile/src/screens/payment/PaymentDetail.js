import React, {Component} from 'react';
import {
    StyleSheet,
    Alert
} from 'react-native';
import B1DetailForm, {FORM_FIELD_TYPE} from '../base/form/B1DetailForm';
import utility from '../utility';
import B1Manager from "../../manager/B1Manager";
import RemoteManager from "../../manager/RemoteManager";
import I18n from 'react-native-i18n';
import ImagePicker from 'react-native-image-picker';
import AllServices from '../../service';
import Config from '../../manager/Config';

const BTN_IMPORT_ATTACHMENT = "BTN_IMPORT_ATTACHMENT";

export default class PaymentDetail extends Component {
    constructor(props) {
        super(props);

        let navigator = this.props.navigator;
        navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));

        this.state = {
            data: null,
            attachmentPaths: [],
        };
    }

    componentWillMount() {
        this._loadData(this.props.id, this.props.type);
    }

    render() {
        if (this.state.data) {
            let readonly = this.state.data.hasOwnProperty("id");

            let aFromAndToFields = [];

            if (readonly || this.state.data.type === 'IN') {
                this.props.navigator.setButtons({rightButtons: []});
            } else {
                this.props.navigator.setButtons({
                    rightButtons: [
                        {
                            id: BTN_IMPORT_ATTACHMENT,
                            icon: require('../../../assets/img/camera.png')
                        }
                    ]
                });
            }
           
            if (this.state.data.type === 'IN') {
                aFromAndToFields = [{
                    type: FORM_FIELD_TYPE.TEXT_INPUT,
                    title: I18n.t('payment.detail.from_txt'),
                    readonly: readonly,
                    valueField: 'fromName'
                 }, {
                    type: FORM_FIELD_TYPE.SELECT,
                    title: I18n.t('payment.detail.to_txt'),
                    valueField: 'toAccount.id',
                    descField: 'toAccount.accountNumber',
                    readonly: readonly,
                    options: {
                        screen: 'b1lite.PaymentAccountList',
                        descField: 'accountNumber',
                        valueField: 'id'
                    }
                }];
            } else {
                aFromAndToFields = [
                    {
                        type: FORM_FIELD_TYPE.SELECT,
                        title: I18n.t('payment.detail.from_txt'),
                        valueField: 'fromAccount.id',
                        descField: 'fromAccount.accountNumber',
                        readonly: readonly,
                        options: {
                            screen: 'b1lite.PaymentAccountList',
                            descField: 'accountNumber',
                            valueField: 'id'
                        }
                    }, {
                        type: FORM_FIELD_TYPE.TEXT_INPUT,
                        title: I18n.t('payment.detail.to_txt'),
                        readonly: readonly,
                        valueField: 'toName'
                    }
                ];
            }

            let deleleButton = {
                type: FORM_FIELD_TYPE.BUTTON,
                title: I18n.t('payment.detail.delete_btn'),
                options: {
                    onPress: () => {
                        console.log("before delete");
                        console.log(this.state.data);
                        Alert.alert(I18n.t('payment.detail.delete_confirm_title'), I18n.t('payment.detail.delete_confirm_text'), [
                            {
                                text: I18n.t('payment.detail.delete_confirm_positive'),
                                onPress: () => {
                                    let oPaymentService = AllServices.PaymentService(B1Manager.getConnection());
                                    
                                    oPaymentService.delete(this.state.data)
                                    .catch(ex => {
                                        console.error(ex);
                                        Alert.alert(I18n.t('payment.detail.delete_error_msg', {msg: JSON.stringify(ex)}));
                                    })
                                    .finally(() => {
                                        Alert.alert(I18n.t('payment.detail.delete_success_msg'), null, [
                                            {
                                                text: I18n.t('ok_btn'),
                                                onPress: () => this._onNavigatePop()
                                            }
                                        ]);
                                    });
                                }
                            },
                            {
                                text: I18n.t('payment.detail.delete_confirm_negative')
                            }
                        ]);
                        
                    }
                }
            };

            let saveButton = {
                type: FORM_FIELD_TYPE.BUTTON,
                title: I18n.t('payment.detail.save_btn'),
                options: {
                    onPress: () => {
                        let oPaymentService = AllServices.PaymentService(B1Manager.getConnection());
                        this.state.data.isActive = true;
                        console.log(this.state.data);
                        let bDev = global.__DEV__;
                        global.__DEV__ = false;
                        
                        oPaymentService.save(this.state.data)
                            .then(d => {
                                Alert.alert(I18n.t('payment.detail.save_success_msg'));
                                return this._loadData(d.id, d.type);
                            })
                            .then(() => {
                                console.log('Remote sync successfully');
                            })
                            .catch(ex => {
                                console.error(ex);
                                Alert.alert(I18n.t('payment.detail.save_error_msg', {msg: JSON.stringify(ex)}));
                            })
                            .finally(() => {
                                global.__DEV__ = bDev;
                            });
                    }
                }
            };


            let layout = [
                {
                    data: [{
                            type: FORM_FIELD_TYPE.MONEY_INPUT,
                            title: I18n.t('payment.detail.amount_txt'),
                            readonly: readonly,
                            valueField: 'amount'
                        },
                        ...aFromAndToFields,
                        {
                            type: FORM_FIELD_TYPE.DATE_INPUT,
                            title: I18n.t('payment.detail.date_txt'),
                            readonly: readonly,
                            valueField: 'transDate'
                        }, {
                            type: FORM_FIELD_TYPE.SELECT,
                            title: I18n.t('payment.detail.category'),
                            valueField: 'category.id',
                            descField: 'category.name',
                            readonly: readonly,
                            filter: {'type': this.state.data.type},
                            options: {
                                screen: 'b1lite.CategoryList',
                                descField: 'name',
                                valueField: 'id'
                            }
                        }, {
                            type: FORM_FIELD_TYPE.TEXT_INPUT,
                            title: I18n.t('payment.detail.reference_txt'),
                            readonly: readonly,
                            valueField: 'reference'
                        }, {
                            type: FORM_FIELD_TYPE.ATTACHMENT,
                            title: I18n.t('payment.detail.attachment_txt'),
                            valueField: 'attachments',
                            readonly: readonly,
                        }
                    ]
                },
                {
                    data: readonly ? [deleleButton] : [saveButton]
                }
            ];

            return (
                <B1DetailForm data={this.state.data}
                              layout={layout}
                              onNavigatePush={this._onNavigatePush.bind(this)}
                              onNavigatePop={this._onNavigatePop.bind(this)}
                              onDataChange={(data, field) => {
                                  this.setState({
                                      data: data
                                  })
                              }}
                />
            )
        } else {
            return null;
        }
    }

    _onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress' && event.id === BTN_IMPORT_ATTACHMENT) {
            this._onShowImagePicker();
        }

        utility.handleNavigatorEvent(this.props.navigator, event);
    }

    _onShowImagePicker() {
        var that = this;
        ImagePicker.showImagePicker(utility.getImagePickerOptions(), response => {
            if (response.didCancel) {
                console.log("Cancel image picker");
            } else if (response.error) {
                console.log(`Image Picker error: ${response.error}`);
            } else {
                let attachment = {
                    file: response.uri,
                }
                this.state.attachmentPaths.push(attachment);
                this.state.data.attachments = this.state.attachmentPaths;
                that.setState({
                    data: this.state.data
                });
            }
        });
    }

    _onNavigatePush(param) {
        this.props.navigator.push(param);
    }

    _onNavigatePop() {
        this.props.navigator.pop();
    }

    _loadData(id, type) {
        let oPaymentService = AllServices.PaymentService(B1Manager.getConnection());

        if (id) {
            oPaymentService.find_by_id(id).then(res => {
                console.log(res);
                this.setState({
                    data: res,
                    attachmentPaths: res.attachment
                });
            });
        } else {
            //jacky need provide the initial data of a new object
            this.setState({
                data: {
                    "transDate": utility.fromDateToYyyyMmDd(new Date()),
                    "type": type, //IN or OUT
                    "amount": 0,
                    "createdBy": Config.getToken().name
                }
            });
        }
    }
}

const styles = StyleSheet.create({
    form: {
        height: '100%',
        backgroundColor: 'white'
    }
});