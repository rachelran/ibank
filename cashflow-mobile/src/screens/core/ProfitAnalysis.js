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
import ToPostItem from '../home/items/ToPostItem';
import Utility from '../utility';
import B1Manager from '../../manager/B1Manager';
import RevenueSummaryPieItem from './chart/RevenueSummaryPieItem';
import ImageItem from '../home/items/ImageItem';
import I18n from 'react-native-i18n';
import ExpenseItem from '../home/items/ExpenseItem';
import RemoteManager from '../../manager/RemoteManager';
import ProfitLineItem from './chart/ProfitLineItem'

const ITEM_TYPE = {
    PAYMENT: 1,
    REVENUE_SUMMARY: 2,
    EXPENSE: 3,
    IMAGE: 4,
    LINE: 5
}

// 二级页面 毛利分析
export default class ProfitAnalysis extends Component {
    constructor(props) {
        super(props);
        let navigator = this.props.navigator;
        navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
        navigator.setTitle({
            title: I18n.t('menu.profit_analysis')
        });
        navigator.setStyle(Utility.navigatorStyle);


        let timeInteger = new Date().getTime();

        this.state = {
            data: [

              {
                  type: ITEM_TYPE.IMAGE,
                  created: ''+timeInteger,
                  imgName:'利润构成_detail',
                  imgHeight:213,
                  params: {
                        imgName:'利润构成_detail',
                        imgHeight:213
                  }
              },
              {
                  type: ITEM_TYPE.IMAGE,
                  created: ''+timeInteger,
                  imgName:'智能洞察_detail',
                  imgHeight:290,
                  action:'b1lite.GrossDetail',
                  params:{

                  }
              }
            ],
            revenueSummaryData: [
                {
                    x: '成本',
                    y: 381012.78
                },
                {
                    x: '费用',
                    y: 72121.87
                },
                {
                    x: '毛利',
                    y: 163683.16
                }               
            ],
            lineDetailData: [{
                name:'test1',
                data:[
                { x: '4月', y: 2 },
                { x: '5月', y: 3 },
                { x: '6月', y: 5 },
                { x: '7月', y: 4 },
                { x: '8月', y: 7 }
            ]},{name:'test2',
                data:[
                    { x: '4月', y: 3 },
                    { x: '5月', y: 4 },
                    { x: '6月', y: 6 },
                    { x: '7月', y: 8 },
                    { x: '8月', y: 10 }
            ]}]
        }
    }

    render() {
        return (
            <View style={styles.conatiner}>
                <FlatList
                    data={
                        [
                            {
                                data: this.state.revenueSummaryData,
                                type: ITEM_TYPE.REVENUE_SUMMARY
                            },
                            {
                                data: this.state.lineDetailData,
                                type: ITEM_TYPE.LINE
                            },
                            ...this.state.data
                        ]}
                    renderItem={({item}) => this._renderItem(item)}
                    keyExtractor={(item, index) => "" + index}
                />
            </View>   
           
        )
    }

    _renderItem(item) {
        var content;
        // console.log('----',item);
        switch (item.type) {
            case ITEM_TYPE.PAYMENT:
                content = <ToPostItem data={item}/>
                break;
            case ITEM_TYPE.REVENUE_SUMMARY:
                content = <RevenueSummaryPieItem data={item.data}/>
                break;
            case ITEM_TYPE.EXPENSE:
                content = <ExpenseItem data={item}/>
                break;
            case ITEM_TYPE.LINE:
                content = <ProfitLineItem data={item.data}/>
                break;
            case ITEM_TYPE.IMAGE:
                content = <ImageItem data={item} style={style.imageItem}/>
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.imageItemContainer}
                        onPress={() => this._onPressItem(item)}>
                        {content}
                    </TouchableOpacity>
                )
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
            // if (event.id == 'globalSearch') {
            //     var oBusinessPartnerService = getBusinessPartnerService(B1Manager.getConnection());
            //     oBusinessPartnerService.find({where: {code: 'bp001'}}).then(res => {
            //         Alert.alert(JSON.stringify(res[0]));
            //     });
            // }
        } else if (event.id === 'willAppear') {
            this._loadData();
        }

        Utility.handleNavigatorEvent(this.props.navigator, event);
    }

    _onPressItem(item) {
        title = item.imgName.replace("_detail","")
        switch (item.type) {
            case ITEM_TYPE.IMAGE:
                if (item.action) {
                    this.props.navigator.push({
                      screen: item.action,
                      title: title,
                      backButtonTitle: '',
                      navigatorStyle: Utility.navigatorStyle,
                      // navigatorButtons: {
                      //     rightButtons: [{
                      //         title: 'CLOSE'
                      //     }]
                      // }
                      passProps: {
                          params: item.params
                      }
                  });
                }
                
                break;
            case ITEM_TYPE.PAYMENT:
                // this._gotoDetailPage(item.id, item.type === 1 ? 'IN' : 'OUT');
                break;
            case ITEM_TYPE.REVENUE_SUMMARY:
                this.props.navigator.push({
                    screen: 'b1lite.RevenueSummaryDetail',
                    title: I18n.t('home.revenue_title'),
                    backButtonTitle: '',
                    navigatorStyle: Utility.navigatorStyle,
                    // navigatorButtons: {
                    //     rightButtons: [{
                    //         title: 'CLOSE'
                    //     }]
                    // }
                });
                break;
            default:
                break;
        }
    }

    _loadData() {
        // let response = {
        //     "success": true,
        //     "message": null,
        //     "data": {
        //         "Nodes": [
        //             {
        //                 "ItemGroup": "手机修改",
        //                 "GrossProfit": -7211547.93
        //             },
        //             {
        //                 "ItemGroup": "手机链",
        //                 "GrossProfit": -111003.69
        //             },
        //             {
        //                 "ItemGroup": "三门冰箱",
        //                 "GrossProfit": -12030.4
        //             },
        //             {
        //                 "ItemGroup": "数码相机",
        //                 "GrossProfit": -1618.03
        //             },
        //             {
        //                 "ItemGroup": "双门冰箱",
        //                 "GrossProfit": 1438238.03
        //             }
        //         ]
        //     }
        // };

        RemoteManager.getProfitData().then(response => {
            let revenueSummaryData = [];
            if (response.success) {
                revenueSummaryData = response.data.Nodes;
                revenueSummaryData = revenueSummaryData.map(item => {
                    return {
                        x: item.ItemGroup,
                        y: Math.abs(item.GrossProfit)
                    }
                })
            }

            this.setState({
                revenueSummaryData
            });
        }).catch(err => {
            console.log(err);
        });
    }

    _loadRevenueSummaryReport() {
        const oPaymentService = getPaymentService(B1Manager.getConnection());
        const current = new Date();
        return oPaymentService.analyticsRevenue(current.getFullYear(), current.getMonth() + 1).then(data => {
            var aData = [];
            data.map(item => {
                aData.push({
                    x: item.customer,
                    y: item.total
                });
            })
            return aData;
        });
    }

    _loadNotifications(bAll) {
        const oPaymentService = getPaymentService(B1Manager.getConnection());

        return oPaymentService.find(bAll ? {} : {
                where: {
                    status: 'Draft'
                }
            }
        ).then(res => {
            let oNow = new Date();
            let notifications = res.slice(0, 20).filter(d => {
                return oNow.getTime() >= parseInt(d.created);
            });

            for (let d of notifications) {
                d.type = ITEM_TYPE.PAYMENT;
            }

            return notifications;
        });
    }

    _onNavigatorEvent(event) {
        Utility.handleNavigatorEvent(this.props.navigator, event);
    }

    _insertOneNotification() {
        console.log('insert one');

        const oPaymentService = getPaymentService(B1Manager.getConnection());
        const oBpService = getBusinessPartnerService(B1Manager.getConnection());

        return oBpService.find({
            where: {
                type: 'C'
            }
        }).then(bpList => {
            console.log(bpList);

            let oNow = new Date();

            return oPaymentService.save({
                accountType: {id: "2"},
                amount: Math.round(Math.random() * 100) * 10,
                bp: {
                    id: bpList[Math.floor(Math.random() * bpList.length)].id
                },
                created: `${oNow.getTime()}`,
                date: Utility.fromDateToYyyyMmDd(oNow),
                day: oNow.getDay(),
                expenseType: {
                    id: "6"
                },
                id: Utility.uuid(),
                month: oNow.getMonth() + 1,
                reference: "",
                source: null,
                status: 'Draft',
                type: 'IN',
                year: oNow.getFullYear()
            });
        });
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
}

const styles = StyleSheet.create({
    conatiner: {
        height: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#1E508B'
    },
    itemContainer: {
        backgroundColor: 'white',
        marginTop: 10,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    imageItemContainer: {
        backgroundColor: 'white',
        marginTop: 10,
        borderRadius: 10,
        paddingLeft: 0,
        paddingRight: 10
    },
    title: {
        fontSize: 15,
        color: 'white',
        marginTop: 10,
    },
    imageItem: {

    }
});
