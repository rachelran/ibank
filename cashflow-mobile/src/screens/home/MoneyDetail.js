import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ScrollView
} from 'react-native';
import I18n from 'react-native-i18n';
import DonutChart from '../base/chart/DonutChart';
import B1MonthSwitch from '../base/control/B1MonthSwitch';
import Utility from '../utility';
import CategoriedPaymentItem from './CategoriedPaymentItem';
import B1SeperatorLine from '../base/control/B1SeperatorLine';
import AllServices from '../../service';
import B1Manager from '../../manager/B1Manager';
import B1MonthSwipe from '../base/control/B1MonthSwipe';

const BTN_CREATE_PAYMENT = 'BTN_CREATE_PAYMENT';

export default class MoneyDetail extends Component {
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
        var date = this.props.date || new Date();
        if (this.props.type === "IN") {
            navigator.setTitle({
                title: I18n.t('moneydetail.list.money_in')
            });
            this.state = {
                date: date,
                summaryDataList: [],
                categorizedSummaryData: [],
                chartData: [],
                isChartRefresh: true,
                paymentscount: '',
                numSymbol: "+",
                COLOR_SCALE: ["#3C86FC", "#96D0D9", "#BFDDFF", "#5AC8FA", "#5899DA"]
            };
        } else if (this.props.type === "OUT") {
            navigator.setTitle({
                title: I18n.t('moneydetail.list.money_out')
            });
            this.state = {
                date: date,
                summaryDataList: [],
                categorizedSummaryData: [],
                chartData: [],
                isChartRefresh: true,
                paymentscount: '',
                numSymbol: "-",
                COLOR_SCALE: ["#1FCDC0", "#50E3C2", "#3CFCCA", "#85E98C", "#B8EA87"]
            };
        }

    }

    componentWillMount() {
        this._renderData(this.state.date);
    }

    render() {
        return (
            <View style={styles.container}>
                <View >
                    <B1MonthSwitch date={this.state.date} didChange={(date) => this._didChangeTimeRange(date, true)} />
                    {/*<View style={styles.sectionContainer}>
                        <DonutChart didSelect={(data) => this._gotoListPage(data.datum.x)}
                            colorScale={this.state.COLOR_SCALE}
                            labelRadius={85}
                            height={250}
                            charHeight={250}
                            radius={6}
                            fontSize={18}
                            labelStyle={{ fontSize: 12, fontFamily: 'Helvetica' }}
                            data={this.state.categorizedSummaryData}
                            numSymbol={this.state.numSymbol}
                        />
                    </View>*/}

                    <B1MonthSwipe renderItem={(item) => this._renderSwiperItem(item)} 
                        data={this.state.chartData} 
                        date={this.state.date}
                        isChartRefresh={this.state.isChartRefresh}
                        didChange={(date, isRefreshChart) => this._didChangeTimeRange(date, isRefreshChart)}
                    />
                </View>
                <View style={styles.customerName}>
                    <Text style={styles.textLabel}> {this.state.paymentscount} {I18n.t('menu.payments')}</Text>
                </View>
                <ScrollView>
                    <FlatList
                        data={this.state.categorizedSummaryData}
                        renderItem={({ item, index }) =>
                            <CategoriedPaymentItem
                                color={this.state.COLOR_SCALE[index % this.state.COLOR_SCALE.length]}
                                name={item.x}
                                amount={item.y}
                                numSymbol={this.state.numSymbol}
                                onPress={() => this._onPressItem(item)} />
                        }
                        keyExtractor={(item, index) => "" + index}
                        ItemSeparatorComponent={() => <B1SeperatorLine />} />
                </ScrollView>
            </View>
        )
    }

    _onNavigatorEvent(event) {
        if (event.id === 'willAppear') {
            this._renderData(this.state.date);
        } else if (event.id === BTN_CREATE_PAYMENT) {
            this._gotoCreatePaymentPage(null, this.props.type);
        }
    }

    _renderSwiperItem(item) {
        console.log(item);
        return (<View style={styles.sectionContainer}>
            <DonutChart didSelect={(data) => this._gotoListPage(data.datum.x)}
                colorScale={this.state.COLOR_SCALE}
                labelRadius={115}
                height={300}
                charHeight={300}
                radius={5}
                fontSize={20}
                labelStyle={{ fontSize: 14, fontFamily: 'Helvetica' }}
                data={item}
                numSymbol={this.state.numSymbol}
            />
        </View>);
    }

    _gotoCreatePaymentPage(id, type) {
        this.props.navigator.push({
            screen: 'b1lite.PaymentDetail',
            title: { IN: I18n.t('payment.detail.in_title'), OUT: I18n.t('payment.detail.out_title') }[type],
            backButtonTitle: '',
            navigatorStyle: Utility.navigatorStyle,
            passProps: {
                id: id,
                type: type
            }
        });
    }

    _didChangeTimeRange(oNewDate, isRefreshChart) {
        if (isRefreshChart) {
            return this._renderData(oNewDate);
        } else {
            return this._renderListData(oNewDate);
        }
    }

    _renderData(oNewDate) {
        console.log("_renderData = ", oNewDate);
        return Promise.all([
            this._getPaymentByDate(oNewDate),
            this._getRangePayment(oNewDate)
        ]).then(([res, payments]) => {
            console.log("res = ", res);
            console.log("payments = ", payments);
            this.setState({
                chartData: payments,
                isChartRefresh: true,
                categorizedSummaryData: res.data,
                paymentscount: res.count,
                date: oNewDate
            })
        });
    }

    _renderListData(oNewDate) {
        console.log("_renderListData = ", oNewDate);
        return this._getPaymentByDate(oNewDate)
            .then((res) => {
                console.log("res = ", res);
                this.setState({
                    isChartRefresh: false,
                    categorizedSummaryData: res.data,
                    paymentscount: res.count,
                    date: oNewDate
                })
            });
    }

    async _getPaymentByDate(oNewDate) {
        const oPaymentService = AllServices.PaymentService(B1Manager.getConnection());

        return oPaymentService.findwithCategories(oNewDate.getFullYear(), oNewDate.getMonth() + 1, this.props.type)
            .then(res => {
                var categoryPaymentMap = new Map();
                res.forEach(element => {
                    if (categoryPaymentMap.has(element.name)) {
                        categoryPaymentMap.set(element.name, categoryPaymentMap.get(element.name) + element.amount);
                    } else {
                        categoryPaymentMap.set(element.name, element.amount);
                    }
                });
                var categorizedSummaryData = [];
                categoryPaymentMap.forEach((value, key) => {
                    categorizedSummaryData.push({
                        x: key,
                        y: value
                    });
                })
                return { "count": res.length, "data": categorizedSummaryData };
            });
    }


    async _getRangePayment(oNewDate, count) {
        console.log("_getRangePayment oNewDate = ", oNewDate);
        const oPaymentService = AllServices.PaymentService(B1Manager.getConnection());

        const beginDate = Utility.changeMonth(-4, oNewDate);
        const endDate = Utility.changeMonth(5, oNewDate);

        let payments = await oPaymentService.findRangePayment(Utility.fromDateToYyyyMm(beginDate) + "00",
            Utility.fromDateToYyyyMm(endDate) + "00", this.props.type);
        //console.log("_getRangePayment = ", payments);   

        let paymentMap = new Map();
        for (let date = beginDate; date < endDate;) {
            let key = Utility.fromDateToYyyyMm(date);
            paymentMap.set(key, []);

            date = Utility.changeMonth(1, date);
        }

        //console.log("paymentMap = ", paymentMap);   

        payments.forEach(item => {
            console.log("item = ", item);
            let key = item.year + '' + String(item.month).padStart(2, 0);
            let value = {
                x: item.name,
                y: item.amount
            };

            if (paymentMap.has(key)) {
                paymentMap.get(key).push(value);
            } else {
                paymentMap.set(key, [value]);
            }
        });

        console.log("paymentMap = ", paymentMap);

        let newPayments = [];
        paymentMap.forEach((value, key) => {
            newPayments.push(value);
        });

        return newPayments;
    }

    _onPressItem = (item) => {
        this._gotoListPage(item.x, item.y);
    }

    _gotoListPage(name, amount) {
        this.props.navigator.push({
            screen: 'b1lite.CategoriedPaymentList',
            backButtonTitle: '',
            navigatorStyle: Utility.navigatorStyle,
            passProps: {
                categoryName: name,
                date: this.state.date,
                type: this.props.type
            }
        });
    }

}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#FFFFFF'
    },
    sectionContainer: {
        marginTop: 5
    },
    customerName: {
        marginTop: 10,
        height: 30,
        justifyContent: 'center',
        backgroundColor: '#F5F4F4'
    },
    textLabel: {
        fontSize: 16,
        marginLeft: 15,
        fontWeight: 'bold',
        color: '#8cb0ce'
    }
});