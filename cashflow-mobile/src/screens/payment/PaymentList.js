import React, {Component} from 'react';
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Picker,
    Alert
} from 'react-native';
import Utility from '../utility';
import B1SeperatorLine from '../base/control/B1SeperatorLine';
import B1Manager from '../../manager/B1Manager';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    MenuProvider
} from 'react-native-popup-menu';
import PaymentListItem from './PaymentListItem';
import I18n from 'react-native-i18n';
import AllServices from '../../service';

const BTN_CREATE_PAYMENT = 'BTN_CREATE_PAYMENT';

export default class PaymentList extends Component {
    constructor(props) {
        super(props);
        let navigator = this.props.navigator;
        navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
        if (!this.props.hideCreate) {
            navigator.setButtons({
                rightButtons: [
                    {
                        id: BTN_CREATE_PAYMENT,
                        icon: require('../../../assets/img/add.png')
                    }
                ]
            });
        }
        navigator.setTitle({
            title: I18n.t('menu.payments')
        });
        navigator.setStyle(Utility.navigatorStyle);
        navigator.setButtons({
            leftButtons: [
                {
                    id: 'sideMenu',
                    icon: require('../../../assets/img/sidemenu.png')
                }
            ],
            animated: false
        });
        
        var date = this.props.date || new Date();
        this.TYPE_OPTIONS = [
            {key: 'ALL', text: I18n.t('payment.list.filter.all')}, 
            {key: "IN", text: I18n.t('payment.list.filter.incoming')}, 
            {key: "OUT", text: I18n.t('payment.list.filter.outgoing')}
        ];
        this.state = {
            payments: [],
            type: 'ALL',
            date: date,
            analyticsInAmount: '',
            analyticsOutAmount: ''
        };
    }


    render() {
        return (
            <MenuProvider>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <View style={styles.timeContainer}>
                            <TouchableOpacity onPress={() => this._changeMonth(-1)}>
                                <Image source={require('../../../assets/img/left_arrow01.png')}/>
                            </TouchableOpacity>
                            <Text style={styles.timeLabel}>{this._formatMonth()}</Text>
                            <TouchableOpacity onPress={() => this._changeMonth(+1)}>
                                <Image source={require('../../../assets/img/right_arrow01.png')}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.numberContainer}>
                            <AmountLabel currency={Utility.getCurrency()}
                                         number={this._formatAnalyticsNumber(this.state.analyticsInAmount)}
                                         type={ I18n.t('payment.list.header_in_txt')}/>
                            <AmountLabel currency={Utility.getCurrency()}
                                         number={this._formatAnalyticsNumber(this.state.analyticsOutAmount)}
                                         type={ I18n.t('payment.list.header_out_txt')}/>
                        </View>
                    </View>
                    <Menu onSelect={value => this.setState({type: value}, () => this._loadPayments())}>
                        <MenuTrigger customStyles={{
                            triggerWrapper: {height: 35, padding: 10, paddingLeft: 15, backgroundColor: '#f0f0f0'}
                        }}>
                            <View style={{flexDirection: 'row', flex: 1, height: 40}}>
                                <Text style={{
                                    fontSize: 12,
                                    color: '#3C86FC'
                                }}>{this.TYPE_OPTIONS.filter(({key}) => key === this.state.type)[0].text}</Text>
                                <Image source={require('../../../assets/img/drop_drown.png')}/>
                            </View>

                        </MenuTrigger>
                        <MenuOptions>
                            {
                                this.TYPE_OPTIONS.map(({key, text}) => {
                                    return (<MenuOption key={key} value={key} text={text}/>);
                                })
                            }
                        </MenuOptions>
                    </Menu>
                    <FlatList
                        data={this.state.payments}
                        renderItem={({item}) =>
                            <PaymentListItem
                                name= {item.type === 'IN' ? item.fromName : item.toName}
                                time={Utility.fromDateToYyyy_Mm_Dd(Utility.fromYyyyMmDdToDate(item.transDate))}
                                amount={item.amount}
                                status={item.status}
                                type={item.type}
                                onPress={() => this._onPressItem(item)}/>
                        }
                        keyExtractor={(item, index) => "" + index}
                        ItemSeparatorComponent={() => <B1SeperatorLine style={styles.seperatorLine}/>}/>
                </View>
            </MenuProvider>
        )
    }

    _loadPayments() {
        AllServices.PaymentService(B1Manager.getConnection()).find({
                where: Object.assign(
                    {
                        month: this.state.date.getMonth() + 1,
                        year: this.state.date.getFullYear(),
                        isActive: true
                    },
                    this.state.type === 'ALL' ? {} : {type: this.state.type}
                )
            }
        ).then(res => {
            this.setState({
                payments: res
            });
        });

        AllServices.PaymentService(B1Manager.getConnection()).getMonthlyAmount(this.state.date.getFullYear(), this.state.date.getMonth() + 1, 'IN')
            .then(res => {
                this.setState({
                    analyticsInAmount: res[0] && res[0].total || 0
                })
            });

        AllServices.PaymentService(B1Manager.getConnection()).getMonthlyAmount(this.state.date.getFullYear(), this.state.date.getMonth() + 1, 'OUT')
            .then(res => {
                this.setState({
                    analyticsOutAmount: res[0] && res[0].total || 0
                })
            });

    }

    _formatMonth() {
        return Utility.fromDateToMMM_Yyyy(this.state.date)
    }

    _changeMonth(iMonthDiff) {
        let oNewDate = new Date(this.state.date.getFullYear(), this.state.date.getMonth() + iMonthDiff, this.state.date.getDate());

        this.setState({
            date: oNewDate
        }, () => {
            this._loadPayments();
        });
    }

    _onNavigatorEvent(event) {
        if (event.id === 'willAppear') {
            this._loadPayments();
        } else if (event.type === 'NavBarButtonPress' && event.id === BTN_CREATE_PAYMENT) {
            Alert.alert(
                I18n.t('payment.list.create_title'),
                null,
                [

                    {
                        text: I18n.t('payment.list.filter.incoming'), onPress: () => {
                            this._gotoDetailPage(null, 'IN');
                        }
                    },
                    {
                        text: I18n.t('payment.list.filter.outgoing'), onPress: () => {
                            this._gotoDetailPage(null, 'OUT');
                        }
                    },
                    {text: I18n.t('payment.list.cancel_btn'), onPress: () => console.log('Ask me later pressed')},
                ]
            );
        }

        Utility.handleNavigatorEvent(this.props.navigator, event);
    }


    _onPressItem = (item) => {
        this._gotoDetailPage(item.id, item.type);
    }

    _gotoDetailPage(id, type) {
        this.props.navigator.push({
            screen: 'b1lite.PaymentDetail',
            title: {IN: I18n.t('payment.detail.in_title'), OUT: I18n.t('payment.detail.out_title')}[type],
            backButtonTitle: '',
            navigatorStyle: Utility.navigatorStyle,
            passProps: {
                id: id,
                type: type
            }
        });
    }

    _formatAnalyticsNumber(total) {
        if (total < 1000) {
            return Math.round(total);
        } else if (total >= 1000 && total <= 1000000) {
            return Math.round(total / 1000) + 'K';
        } else {
            return Math.round(total / 1000000) + 'M';
        }
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%'
    },
    headerContainer: {
        backgroundColor: '#1E508B'
    },
    timeContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    timeLabel: {
        color: 'white',
        fontSize: 15,
        marginLeft: 33,
        marginRight: 33,
    },
    numberContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 20,
    }
});

class AmountLabel extends Component {
    render() {
        return (
            <View style={amountStyles.container}>
                <Text style={amountStyles.normal}>{this.props.currency}</Text>
                <Text style={amountStyles.number}>{this.props.number}</Text>
                <Text style={amountStyles.normal}>{this.props.type}</Text>
            </View>
        )
    }
}

const amountStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    normal: {
        color: 'white',
        fontSize: 20,
    },
    number: {
        color: 'white',
        fontSize: 40,
        marginLeft: 4,
        marginRight: 10
    }
});

