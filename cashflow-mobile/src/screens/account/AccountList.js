import React, {Component} from 'react';
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Picker,
    ScrollView,
    Alert
} from 'react-native';
import Utility from '../utility';
import B1SeperatorLine from '../base/control/B1SeperatorLine';
import B1Manager from '../../manager/B1Manager';
import AccountListItem from './AccountListItem';
import I18n from 'react-native-i18n';
import DonutChart from '../base/chart/DonutChart';
import AllServices from '../../service';


const BTN_CREATE_PAYMENT = 'BTN_CREATE_PAYMENT';
const COLOR_SCALE = ["#3C86FC", "#5899DA", "#15E067", "#1AA979", "#E8743B"];
export default class AccountList extends Component {
    constructor(props) {
        super(props);
        let navigator = this.props.navigator;
        navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
        navigator.setTitle({
            title: I18n.t('account.list.title')
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
        var date = this.props.date || new Date();
        this.state = {
            journalEntries: [],
            type: 'ALL',
            date: date,
            lines:[],
            data: [],
            AccountsSummaryData:[]
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>     
                    <DonutChart
                        colorScale={COLOR_SCALE}
                        data={this.state.AccountsSummaryData}
                        fontColor="white"
                        labelStyle =  {{fontSize:14, fill: 'white' }}
                        fontSize = {20}
                        height={220}
                        radius={4}
                        charHeight={270}
                        labelRadius={95}
                        />
                    
                </View>
                <ScrollView style={styles.itemContainer}>
                    <Text style={styles.normal}>{I18n.t('account.list.title')}</Text>
                    <FlatList
                             data={this.state.Accounts}
                            renderItem={({item}) =>
                            <AccountListItem
                                id={item.id}
                                typeId={item.accountType.id}
                                accountName={item.accountName}
                                accountCode={item.accountNumber}
                                amount={item.amount}
                                currency={item.currency.id}
                                onPress={() => this._onPressItem(item)}
                                scrollEnabled={true} />
                        }
                        keyExtractor={(item, index) => index.toString()}
                        />
                </ScrollView>
            </View>
        )
    }
 
    _loadPayments(id, type) {
     
        let oAccountService = AllServices.AccountService(B1Manager.getConnection());
        oAccountService.find({}).then(res => {
        let AccountsSummaryData =[]
        let map = new Map()
        for (let line of res){
            let amountSum =0
            if  (!map.get(line.accountType.id))
                {amountSum = line.amount
                }
            else 
                {
                amountSum = map.get(line.accountType.id) + line.amount
                }
                map.set(line.accountType.id, amountSum)

           }
           array=[...map]
           for (let line of array)
               {
                switch (line[0]) {
                    case 1:
                         line.type = I18n.t('account.list.cashinstore')
                         break;
                     case 2:
                         line.type = I18n.t('account.list.bank')
                     break;
                     case 3:
                         line.type = I18n.t('account.list.alipay')
                     break;
                     case 4:
                         line.type = I18n.t('account.list.wechatpay')
                     break;
                     default:
                         break;  
                }
                x = line.type;
                y = line[1];
                AccountsSummaryData.push({x,y})
               }
            this.setState({
                Accounts: res,
                AccountsSummaryData: AccountsSummaryData
            });

         });
     }



    _onNavigatorEvent(event) {
        if (event.id === 'willAppear') {
            this._loadPayments();
        } else if (event.type === 'NavBarButtonPress' && event.id === BTN_CREATE_PAYMENT) {
            // Alert.alert(
            //     I18n.t('payment.list.create_title'),
            //     null,
            //     [

            //         {
            //             text: I18n.t('payment.list.filter.incoming'), onPress: () => {
            //                 this._gotoDetailPage(null, 'IN');
            //             }
            //         },
            //         {
            //             text: I18n.t('payment.list.filter.outgoing'), onPress: () => {
                            this._gotoDetailPage(null, 'OUT');
            //             }
            //         },
            //         {text: I18n.t('payment.list.cancel_btn'), onPress: () => console.log('Ask me later pressed')},
            //     ]
            // );
        }

        Utility.handleNavigatorEvent(this.props.navigator, event);
    }
    
    _onPressItem(item){
        this._gotoDetailPage(item.id, item.type);
    }

    _gotoDetailPage(id, type) {
        let title = id ? '' : I18n.t('account.detail.title');
        this.props.navigator.push({
            screen: 'b1lite.AccountListDetail',
            title: title,
            backButtonTitle: '',
            navigatorStyle: Utility.navigatorStyle,
            passProps: {
                id: id,
                type: type
            }
        });
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#1E508B'

    },
    headerContainer: {
        backgroundColor: '#1E508B',
        height: 260
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
        marginTop: 10,
        marginBottom: 10,
    },
    itemContainer: {
        backgroundColor: '#1E508B',
        marginTop: 10,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom:20
    },
    numberContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 20,
    },
    normal: {
        color: 'white',
        fontSize: 15,
    }
});



