import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    FlatList,
    StyleSheet,
    Button,
    Alert,
    TouchableOpacity
} from 'react-native';
import Utility from '../utility';
import B1Manager from '../../manager/B1Manager';
import ImageItem from './items/ImageItem';
import I18n from 'react-native-i18n';
import ExpenseItem from './items/ExpenseItem';
import DonutChart from '../base/chart/DonutChart';
import AllServices from '../../service';
import B1MonthSwitch from '../base/control/B1MonthSwitch';
import IncomeItem from '../home/items/IncomeItem';

const ITEM_TYPE = {
    EXPENSE: 1,
    INCOME:2,
    CALENDAREVENT:3,
    IMAGE: 4
}

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.props.navigator.setTitle({
            title: I18n.t('home.title')
        });
        this.props.navigator.setStyle(Utility.navigatorStyle);
        this.props.navigator.setButtons({
            leftButtons: [
                {
                    id: 'sideMenu',
                    icon: require('../../../assets/img/sidemenu.png')
                }
            ],
            rightButtons: [
                {
                    id: 'add',
                    icon: require('../../../assets/img/add.png')
                }
            ],
            animated: false
        });

        let timeInteger = new Date().getTime();
        var date = new Date();
        this.state = {
            data: [
                {
                  type: ITEM_TYPE.IMAGE,
                  created: ''+timeInteger,
                  imgName:'benchmark',
                  imgHeight:140,
                  title: 'home.benchmark_title'
                },
                {
                    type: ITEM_TYPE.IMAGE,
                    created: ''+timeInteger,
                    imgName:'performance',
                    imgHeight:140,
                    title: 'home.calendar_title'
                  }
            ],
            revenueSummaryData: [],
            categorizedSummaryData: [],
            date: date
        }
    }

    render() {
        return (
            <View style={styles.conatiner}>
                <View style={styles.timeContainer}>
                    <B1MonthSwitch 
                        mode={0}
                        date={this.state.date}
                        didChange={(date) => this._didChangeMonth(date)}/>
                </View>
                <DonutChart didSelect={(data) => this._didSelectMoneyInOUT(data)}
                    colorScale={["#3C86FC", "#3CFCCA", "#3C86FC"]}
                    fontColor = {"#FFFFFF"}
                    fontSize = {20}
                    labelRadius={90}
                    height={250}
                    charHeight={250}
                    radius={5}
                    labelStyle =  {{fontSize:14, fill: 'white' }}
                    data = { this.state.revenueSummaryData}/>
                 <Text style = { styles.cardsTitle }>{ I18n.t('home.cards_title') }</Text>
                <FlatList
                    data={
                        [
                            {
                            "type":ITEM_TYPE.INCOME,
                            "data": this.state.categorizedSummaryData
                            },
                            ...this.state.data
                        ]}
                    renderItem={({item}) => this._renderItem(item)}
                    keyExtractor={(item, index) => "" + index}
                />
            </View>
        )
    }
    _didSelectMoneyInOUT(data){
        let type = "";
        data.datum.x === "MoneyOut"? type="OUT":type="IN";      
        this._gotoMoneyDetailPage(null, type);
    }
    _didChangeMonth(oNewDate){
        this._loadData(oNewDate);
        this._renderIncomeData(oNewDate);
    }
    _renderIncomeData(oNewDate) {
        const oPaymentService = AllServices.PaymentService(B1Manager.getConnection());

        let year = oNewDate.getFullYear();
        let month = oNewDate.getMonth() + 1;
        
        oPaymentService.findwithCategories(year, month, "IN"
        ).then(res => {
            var m = res;
            var categoryPaymentMap = new Map();
            res.forEach(element => {
                if (categoryPaymentMap.has(element.name)) {
                    categoryPaymentMap.set(element.name, categoryPaymentMap.get(element.name) + element.amount);
                } else {
                    categoryPaymentMap.set(element.name, element.amount);
                }
            });
            this.state.categorizedSummaryData = [];
            categoryPaymentMap.forEach((value, key) => {
                this.state.categorizedSummaryData.push({
                    // x: I18n.t('moneydetail.category.' + key),
                    x: key,
                    y: value
                });
            })
            this.setState({
                paymentscount: res.length,
                date: oNewDate
            })
        });
    }
    _renderItem(item) {
        var content;
        switch (item.type) {
            case ITEM_TYPE.EXPENSE:
             // content = <ExpenseItem data={item}/>
                break;
            case ITEM_TYPE.INCOME:
                content = <IncomeItem data={item.data}/>
                break;
            case ITEM_TYPE.CALENDAREVENT:
                // content = <ExpenseItem data={item}/>
                break;
            case ITEM_TYPE.IMAGE:
                content = <ImageItem data={item}/>
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.imageItemContainer}
                        onPress={() => this._onPressItem(item)}>
                        {content}
                    </TouchableOpacity>
                );
                break;
            default:
                break;
        }
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.itemContainer}
                onPress={() => this._onPressItem(item)}
                >
                {content}
            </TouchableOpacity>
        )
    }

    onNavigatorEvent(event) {
        if (event.type == 'NavBarButtonPress') {
            if (event.id == 'add') {
                Alert.alert(
                    I18n.t('home.create_payment_title'),
                    null,
                    [
    
                        {
                            text: I18n.t('home.payment_incoming'), onPress: () => {
                                this._gotoPaymentDetailPage(null, 'IN');
                            }
                        },
                        {
                            text: I18n.t('home.payment_outcoming'), onPress: () => {
                                this._gotoPaymentDetailPage(null, 'OUT');
                            }
                        },
                        {text: I18n.t('home.payment_cancel_btn'), onPress: () => console.log('Ask me later pressed')},
                    ]
                );
                
            }
        } else if (event.id === 'willAppear') {
            this._loadData(this.state.date);
            this._renderIncomeData(this.state.date);
        }

        Utility.handleNavigatorEvent(this.props.navigator, event);
    }

    _gotoMoneyDetailPage(id, type) {
        this.props.navigator.push({
            screen: 'b1lite.MoneyDetail',
            backButtonTitle: '',
            navigatorStyle: Utility.navigatorStyle,
            passProps: {
                id: id,
                type: type,
                date: this.state.date,
            }
        });
    }

    _onPressItem(item) {
        switch (item.type) {
            case ITEM_TYPE.IMAGE:
                // this.props.navigator.push({
                //     screen: 'b1lite.SingleImagePage',
                //     title: item.imgName,
                //     backButtonTitle: '',
                //     navigatorStyle: Utility.navigatorStyle,
                //     // navigatorButtons: {
                //     //     rightButtons: [{
                //     //         title: 'CLOSE'
                //     //     }]
                //     // }
                //     passProps: {
                //         item: item
                //     }
                // });
                break;
            case ITEM_TYPE.INCOME:
                this._gotoMoneyDetailPage(null, "IN");
                break;
            default:
                break;
        }
    }

    _loadData(oDate) {
        let year = oDate.getFullYear();
        let month = oDate.getMonth() + 1;
        const oPaymentService=AllServices.PaymentService(B1Manager.getConnection());
        oPaymentService.queryMoneyIO(year, month).then((data)=>{
            revenueSummaryData = data.map(item => {
                let symbol = item.ItemGroup == "MoneyOut" ? "-" : "+";
                return {
                    x: item.ItemGroup,
                    y: Math.abs(item.Amount),
                    symbol: symbol
                }
            });
            this.setState({
                revenueSummaryData
            });
        }).catch(err => {
            console.log(err);
        });
    }

    _gotoPaymentDetailPage(id, type) {
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
}

const styles = StyleSheet.create({
    conatiner: {
        height: '100%',
        backgroundColor: '#1E508B'
    },
    itemContainer: {
        backgroundColor: 'white',
        marginTop: 10,
        marginLeft:10,
        marginRight:10,
        borderRadius: 10
    },
    imageItemContainer: {
        backgroundColor: 'white',
        marginTop: 10,
        marginLeft:10,
        marginRight:10,
        borderRadius: 10,
    },
    title: {
        fontSize: 15,
        color: 'white',
        marginTop: 10,
    },
    cardsTitle: {
        paddingLeft: 10,
        color: '#FFFFFF',
        fontSize: 13
    },
    imageItem: {
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
    }
});
