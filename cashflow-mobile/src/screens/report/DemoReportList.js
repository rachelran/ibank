import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Utility from '../utility';
import {
    VictoryLine,
    VictoryBar,
    VictoryGroup,
    VictoryChart,
    VictoryLegend,
    VictoryAxis,
    VictoryLabel,
    VictoryScatter
} from 'victory-native';
import {
    MenuProvider
} from 'react-native-popup-menu';
import B1SeperatorLine from '../base/control/B1SeperatorLine';
import B1Dropdown from '../base/control/B1Dropdown';
import B1MonthSwitch from '../base/control/B1MonthSwitch'; 

import B1Manager from '../../manager/B1Manager';
import AllServices from '../../service';

import Svg, {
    G
} from 'react-native-svg';
import I18n from 'react-native-i18n';

const CHART_PADDING = { left: 50, right: 50, top: 30, bottom: 30};
const X_AXIS_STYLE = {
    axis: {stroke: "none"},
    tickLabels: {fontSize: 7, stroke: '#3678AF', fontWeight: '100', letterSpacing: '1px'}
};
const Y_AXIS_STYLE = {
    axis: {stroke: "#D9D9D9"},
    grid: { stroke: '#D9D9D9'},
    tickLabels: {fontSize: 10, stroke: '#3678AF', fontWeight: '100', letterSpacing: '1px'}
};
const LEGEND_LABEL_STYLE = { fill: "#3678AF", fontSize: 10 };
const CUSTOM_CHART_WDITH = 330;

export default class DemoReportList extends Component {
    constructor(props) {
        super(props);

        let navigator = this.props.navigator;
        navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
        navigator.setTitle({
            title: I18n.t('menu.data_analysis')
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

        this.state = {
            cashTrendChartDate: new Date(),
            cashTrendData : {
                moneyIn: null,
                moneyOut:null,
                cashBalance: null
            },
    
            businessVolumeChartDate: new Date(),
            businessVolumeData: {
                incomingNum: null,
                incomingAmount: null
            }  
        }
    }

    componentDidMount() {
        var date = new Date( );
        Promise.all([
             this._fetchCashTrendData(date),
             this._fetchBusinessVolumeData(date)
         ]).then(resules => {
             this.setState({
                 cashTrendData: resules[0],
                 businessVolumeData: resules[1]
             });
         });
    }

    _changeCashTrendDate(selCurrentDate){
        this.setState({
            cashTrendChartDate: selCurrentDate 
        });
        this._fetchCashTrendData(selCurrentDate).then(data=> {
            this.setState({
                cashTrendData: data 
            })
        });
    }

    _changeBusinessVolumeDate(selCurrentDate){
        this.setState({
            businessVolumeChartDate: selCurrentDate 
        });
        this._fetchBusinessVolumeData(selCurrentDate).then(data => {
             this.setState({
                 businessVolumeData: data 
             })
        });
    }

    getCashMonthData(year,month) {
        return new Promise(resolve => {
            const oPaymentService = AllServices.PaymentService(B1Manager.getConnection());
            
            Promise.all([
                    oPaymentService.getMonthlyHistroricalAmount(year, month, "IN"),
                    oPaymentService.getMonthlyHistroricalAmount(year, month, "OUT")
            ]).then(results => {
                //console.log(results);  
                var totalBalance = 0;
                results[0].map(Item => {

                    let foundIdx = results[1].findIndex(function(elem){
                        return elem.fromAccountId == Item.toAccountId;  
                    });
                    /* IN OUT account compare */
                    if(foundIdx>-1) {
                        if(Item.createDate > results[1][foundIdx].createDate)
                        {
                            totalBalance += Item.accountBalance;
                        } else {
                            totalBalance += results[1][foundIdx].accountBalance;
                        }
                    } else {
                        totalBalance += Item.accountBalance;
                    }  
                });

                resolve({
                    totalBalance: totalBalance
                });
            });
        });
    }

    getCashHistoricalMonthData(year,month) {
        return new Promise(resolve => {
            const oPaymentService = AllServices.PaymentService(B1Manager.getConnection());
            var i = 0,vmonth = [],vyear = [],aMonthCashBalance = [];
            var j = month-6+1;
            var k = year;
            if(j <= 0) {
                j += 12;
                k -= 1;
            }
            while(i++ < 6) {
                if(j > 12) {
                    j -=12;
                    k +=1;
                }
                vmonth.push(j);
                vyear.push(k);
                j++;
            }
      
            Promise.all([
                    this.getCashMonthData(vyear[0], vmonth[0]),
                    this.getCashMonthData(vyear[1], vmonth[1]),
                    this.getCashMonthData(vyear[2], vmonth[2]),
                    this.getCashMonthData(vyear[3], vmonth[3]),
                    this.getCashMonthData(vyear[4], vmonth[4]),
                    this.getCashMonthData(vyear[5], vmonth[5]),
                
            ]).then(results => {
                //console.log(results); 
                for(let i=0;i<6;i++) {
                    if(results[i] != null) {
                        let newVal = {
                            month: vmonth[i],
                            total: results[i].totalBalance
                        }
                        aMonthCashBalance.push(newVal);
                    } else {
                        let newVal = {
                            month: vmonth[i],
                            total: 0
                        }
                        aMonthCashBalance.push(newVal);
                    }
                }
                //console.log(aMonthCashBalance); 
                resolve({
                    monthCashtotal: aMonthCashBalance
                });
            });
        });
    }

    _fetchCashTrendData(date) {
        return new Promise(resolve => {
            const oPaymentService = AllServices.PaymentService(B1Manager.getConnection());
            Promise.all([
                oPaymentService.analyticsVolume(date.getFullYear(), date.getMonth() + 1, 'amountIn'),
                oPaymentService.analyticsVolume(date.getFullYear(), date.getMonth() + 1, 'amountOut'),
                this.getCashHistoricalMonthData(date.getFullYear(), date.getMonth() + 1)
                
            ]).then(results => { 
                console.log(results); 
                var aInData = [], aOutData = [], aCashBalanceData = [];
                 
                let fromMonth = date.getMonth() + 1-6+1; 
                
                if(fromMonth <= 0 ){
                    fromMonth += 12;
                }
  
                for(let i=0; i<6; i++){
                    fromMonth = fromMonth>12 ? 1 : fromMonth;
                    let mon = fromMonth++;
                    aInData.push({
                        x: mon,
                        y: 0 
                    });
                    aOutData.push({
                        x: mon,
                        y: 0 
                    });
                } 

                results[0].map(aInItem => {
                    let foundIdx = aInData.findIndex(function(elem){
                        return elem.x == aInItem.month;  
                    });
                    let newVal = {
                        x: aInItem.month, 
                        y: aInItem.total
                    }

                    if(foundIdx>-1){
                        aInData[foundIdx] = newVal;
                    }else{
                        aInData.push(newVal);
                    }
                    
                });

                results[1].map(aOutItem => {
                    let foundIdx = aInData.findIndex(function(elem){
                        return elem.x == aOutItem.month;  
                    });
                    let newVal = {
                        x: aOutItem.month, 
                        y: aOutItem.total
                    }

                    if(foundIdx>-1){
                        aOutData[foundIdx] = newVal;
                    }else{
                        aOutData.push(newVal);
                    }
                    
                });

                fromMonth = date.getMonth() + 1-6+1; 
                if(fromMonth <= 0 ){
                    fromMonth += 12;
                }

                for(let i=0;i<6;i++) {
                    fromMonth = fromMonth>12 ? (fromMonth-12) : fromMonth;
                    let mon = fromMonth++;
                    if(results[2] && results[2].monthCashtotal.length > 0) {
                        let newVal = {
                            x: mon,
                            y: results[2].monthCashtotal[i].total
                        }
                        aCashBalanceData.push(newVal);
                    } else {
                        let newVal = {
                            x: mon, 
                            y: 0
                        }
                        aCashBalanceData.push(newVal);
                    }

                }
                //console.log(aCashBalanceData);
                resolve({
                    moneyIn: aInData,
                    moneyOut: aOutData,
                    cashBalance: aCashBalanceData
                });
            });
        });
    }

    _fetchBusinessVolumeData(date) {
       //alert("ToDO: get Vol Buzz data to Date:"+date.toDateString());  
        return new Promise(resolve => { 
            const oPaymentService = AllServices.PaymentService(B1Manager.getConnection());
            Promise.all([
                oPaymentService.analyticsVolume(date.getFullYear(), date.getMonth() + 1, 'amountIn'),
                oPaymentService.analyticsVolume(date.getFullYear(), date.getMonth() + 1, 'countIn')
            ]).then(results => {
                console.log(results); 
                
                var aNumData = [], aAmountData = [];
                 
                let fromMonth = date.getMonth() + 1-6+1; 
                if(fromMonth <= 0 ){
                    fromMonth += 12;
                }
                // fill placeholder data 0 for each month
                for(let i=0; i<6; i++){
                    fromMonth = fromMonth>12 ? 1 : fromMonth;
                    let mon = fromMonth++;
                    aNumData.push({
                        x: Utility.getShortMonthText(mon -1 ),
                        y: 0 
                    });
                    aAmountData.push({
                        x: Utility.getShortMonthText(mon -1 ),
                        y: 0 
                    });
                } 

                
                results[0].map(amountItem => {
                    let monWithI18n = Utility.getShortMonthText(amountItem.month -1 );
                    let foundIdx = aAmountData.findIndex(function(elem,){
                        return elem.x == monWithI18n;  
                    });
                    let newVal = {
                        x: monWithI18n,
                        y: amountItem.total
                    }
                    if(foundIdx>-1){
                        aAmountData[foundIdx] = newVal;
                    }else{
                        aAmountData.push(newVal);
                    }
                    
                });

                results[1].map(numItem => {
                    let monWithI18n = Utility.getShortMonthText(numItem.month -1 );
                    let foundIdx = aNumData.findIndex(function(elem,){
                        return elem.x == monWithI18n;  
                    });
                    let newVal = {
                        x: monWithI18n,
                        y: numItem.total
                    }
                    if(foundIdx>-1){
                        aNumData[foundIdx] = newVal;
                    }else{
                        aNumData.push(newVal);
                    }
                });
                
                console.log(aNumData);
                console.log(aAmountData);
                
                resolve({
                    incomingNum: aNumData,
                    incomingAmount: aAmountData
                });
            });
        });
        
    }
    
    render() {
        var that = this;
        var aCashTrendLegend = [
                { name: I18n.t('report.cash_trend.legend.received'), symbol: { fill: "#4DC7F8", type: "square" }, labels: LEGEND_LABEL_STYLE },
                { name: I18n.t('report.cash_trend.legend.paid'), symbol: { fill: "#F5A623", type: "square" }, labels: LEGEND_LABEL_STYLE },
                { name: I18n.t('report.cash_trend.legend.balance'), symbol: { fill: "#7ED321", type: "square" }, labels: LEGEND_LABEL_STYLE }
            ];
            
        var aCashTrendCategories = [];

        var maxMoneyIn = 10;
        var acashTrendMoneyInData = [0];
        if(this.state.cashTrendData.moneyIn) {
            acashTrendMoneyInData = this.state.cashTrendData.moneyIn
            if (acashTrendMoneyInData.length > 0) {
                acashTrendMoneyInData = acashTrendMoneyInData.map(item => {
                    let monWithI18n = Utility.getShortMonthText(item.x -1 );
                    labelx = monWithI18n;
                    aCashTrendCategories.push(labelx);
                    maxMoneyIn = Math.max(maxMoneyIn, item.y);
                    return {
                        x: labelx,
                        y: item.y
                    };
               });
            }
        }
        maxMoneyIn = Math.ceil(maxMoneyIn/10) * 10;

        var maxMoneyOut = 10;
        var acashTrendMoneyOutData = [0];
        if(this.state.cashTrendData.moneyOut) {
            acashTrendMoneyOutData = this.state.cashTrendData.moneyOut;
            if (acashTrendMoneyOutData.length > 0) {
                acashTrendMoneyOutData = acashTrendMoneyOutData.map(item => {
                    let monWithI18n = Utility.getShortMonthText(item.x -1 );
                    labelx = monWithI18n;
                    maxMoneyOut = Math.max(maxMoneyOut, item.y);
                    return {
                        x: labelx,
                        y: item.y
                    };
               });
            }
        }
        maxMoneyOut = Math.ceil(maxMoneyOut/10) * 10;

        var maxCashBalance = 10;
        var acashTrendCashBalanceData = [];
        if(this.state.cashTrendData.cashBalance) {
            acashTrendCashBalanceData = this.state.cashTrendData.cashBalance;
            if (acashTrendCashBalanceData.length > 0) {
                acashTrendCashBalanceData = acashTrendCashBalanceData.map(item => {
                    let monWithI18 = Utility.getShortMonthText(item.x -1 );
                    labelx = monWithI18;
                    maxCashBalance = Math.max(maxCashBalance, item.y);
                    return {
                        x: labelx,
                        y: item.y
                    };
                });
            }
            
        }
        maxCashBalance = Math.ceil(maxCashBalance/10) * 10;

        var oTrendGroup = [];
        oTrendGroup.push(
            <VictoryBar
            width = {CUSTOM_CHART_WDITH}
            key = { 'cash-0' }
            alignment='middle'
            style={{  data: { fill: aCashTrendLegend[0].symbol.fill , width: 20} }}
            data={ acashTrendMoneyInData}
            domain = { {y: [0,maxMoneyIn]} }
            labels={(datum) => datum.y}
            labelComponent={<VictoryLabel  renderInPortal dx={0} dy={-2}  
                    verticalAnchor={"start"} style = { {fontSize: '12'}}/>}
            />
        );

        oTrendGroup.push(
            <VictoryBar
            width = {CUSTOM_CHART_WDITH}
            key = { 'cash-1' }
            alignment='middle'
            standalone={false}
            style={{  data: { fill: aCashTrendLegend[1].symbol.fill,width: 20 } }}
            data={ acashTrendMoneyOutData }
            domain = { {y: [0,maxMoneyOut]} }
            labels={(datum) =>  datum.y}
            labelComponent={<VictoryLabel renderInPortal dx={0} dy={-2}
                verticalAnchor={"start"} style = { {fontSize: '12'}}/>}
            />
        );

        var oTrendLines = [];
        if(acashTrendCashBalanceData && acashTrendCashBalanceData.length && acashTrendCashBalanceData.length > 0) {
            oTrendLines.push(
                <VictoryLine
                    width = {CUSTOM_CHART_WDITH}
                    standalone = {false}    
                    style={{ data: { stroke: aCashTrendLegend[2].symbol.fill,} }}
                    data={ acashTrendCashBalanceData}
                    domain = { {y: [0,maxCashBalance]} }  
                    labels={(datum) => datum.y}
                    labelComponent={<VictoryLabel renderInPortal dy={-15}  verticalAnchor={"start"} style = { {fontSize: '12'}}/>}
                   
                />
            );
            
        }

        var aBusinessVolumeLegend = [
            { name: I18n.t('report.volume.legend.number'), symbol: { fill: "#7ED321", type: "square" }, labels: LEGEND_LABEL_STYLE },
            { name: I18n.t('report.volume.legend.money'), symbol: { fill: "#4DC7F8", type: "square" }, labels: LEGEND_LABEL_STYLE }
        ];
        // set categories and calc max values for Y axis domain
        var aBusinessVolumeCategories = [];
        var maxIncNum = 10, maxAmount = 10; // for minDomain to be 10
        var aBusinessVolumeNumData = [];
        if(this.state.businessVolumeData.incomingNum) {
            aBusinessVolumeNumData = this.state.businessVolumeData.incomingNum;
            if (aBusinessVolumeNumData.length > 0) {
                aBusinessVolumeNumData = aBusinessVolumeNumData.map(item => {
                    labelx = item.x;
                    aBusinessVolumeCategories.push(labelx);
                    maxIncNum = Math.max(maxIncNum, item.y);
                    return {
                        x: labelx,
                        y: item.y
                    };
                }); 
            }
        }
        maxIncNum = Math.ceil(maxIncNum/10)*10;
        
        var aBusinessVolumeAmountData = [0];
        if(this.state.businessVolumeData.incomingAmount) {
            aBusinessVolumeAmountData = this.state.businessVolumeData.incomingAmount;
            if (aBusinessVolumeAmountData.length > 0) {
                aBusinessVolumeAmountData = aBusinessVolumeAmountData.map(item => {
                    maxAmount = Math.max(maxAmount, item.y);
                    labelx = item.x;
                    return {
                        x: labelx,
                        y: item.y
                    };
                }); 
            }
        }
        maxAmount = Math.ceil(maxAmount/10)*10;

        var oBusinessVolumeLines = [];
        if(aBusinessVolumeNumData && aBusinessVolumeNumData.length && aBusinessVolumeNumData.length > 0) {
            oBusinessVolumeLines.push(
                <VictoryLine
                width = {CUSTOM_CHART_WDITH}
                standalone={false}
                style={{
                    data: { stroke: aBusinessVolumeLegend[0].symbol.fill }
                }}
                domain = { {y: [0,  maxIncNum]} }
                labels={(datum) => datum.y}
                labelComponent={<VictoryLabel renderInPortal  dx={0} dy={-15}  verticalAnchor={"start"} 
                    style = { {fontSize: '12'}}/>}
                data={ aBusinessVolumeNumData }
                />
            );
            
        }

        console.log("categories: "+ aBusinessVolumeCategories+", maxNum: "+maxIncNum+", maxAmount: "+maxAmount);

        // larger x axis tick labels
        let xAxisStyles = X_AXIS_STYLE;
        xAxisStyles.tickLabels = {fontSize:10, padding:15};

        return (
            <MenuProvider>
                <ScrollView style = { styles.container }>
                    <ReportCard 
                        title = { I18n.t('report.cash_trend.title') } 
                        hasMonthNav = {true} 
                        date = {that.state.cashTrendChartDate}
                        getDataBySelDate = { (selDate) => {  
                            that._changeCashTrendDate(selDate);
                         } } 
                        >
                            <VictoryChart
                            padding = {{ left: 20, right: 80, top: 50, bottom: 40 }}
                            minDomain={{x: 10}}
                            >
                            <VictoryLegend
                                standalone={false}
                                orientation="horizontal"
                                data={aCashTrendLegend}
                                gutter={40}
                                symbolSpacer={5}
                                borderPadding={{ top:10 }}
                            />
                            <VictoryAxis
                                standalone={false}
                                style={ xAxisStyles}
                                tickValues = { aCashTrendCategories }
                                />     
                            <VictoryGroup
                                offset={23}
                                style={{ data:{ width: 52} }}
                                //offset={23} This is original code for demo iphone 6
                                //style={{ data:{ width: 52} }}
                                categories = { { x: aCashTrendCategories } }
                                >
                            { oTrendGroup}
                            </VictoryGroup>
                            
                            { oTrendLines }
                            <VictoryScatter
                                width = {CUSTOM_CHART_WDITH}
                                standalone={false}
                                size={5}                                    
                                style={{ data: { fill: aCashTrendLegend[2].symbol.fill } }}
                                data={ acashTrendCashBalanceData }
                                domain = { {y: [0,  maxCashBalance]} }
                            />
                        </VictoryChart>
                    </ReportCard>
                    <ReportCard 
                        title = { I18n.t('report.volume.title')}
                        hasMonthNav = {true} 
                        date = {that.state.businessVolumeChartDate}
                        getDataBySelDate = { (selDate) => { 
                            that._changeBusinessVolumeDate(selDate); 
                         } } 
                         >
                          <VictoryChart
                            padding = {{ left: 30, right: 90, top: 50, bottom: 40 }}
                            minDomain={{x: 10}}
                            >
                                <VictoryLegend
                                    standalone={false}
                                    orientation="horizontal"
                                    data={aBusinessVolumeLegend}
                                    gutter={80}
                                    symbolSpacer={5}
                                    borderPadding={{ top:10 }}
                                />
                                <VictoryAxis
                                    //width = {CUSTOM_CHART_WDITH}
                                    standalone={false}
                                    style={ xAxisStyles } 
                                    tickValues = { aBusinessVolumeCategories }
                                    />
                               
                                <VictoryBar
                                    width = {CUSTOM_CHART_WDITH}
                                    standalone={false}
                                    alignment='middle'
                                    style={{ data: { fill: aBusinessVolumeLegend[1].symbol.fill, width: 30 } }}
                                    data={ aBusinessVolumeAmountData }
                                    domain = { {y: [0,  maxAmount]} }
                                    labels={(datum) => datum.y}
                                    labelComponent={<VictoryLabel renderInPortal  dx={0} dy={-2}  verticalAnchor={"start"} 
                                        style = { {fontSize: '12'}}/>}
                                />
                                { oBusinessVolumeLines }
                                <VictoryScatter
                                    width = {CUSTOM_CHART_WDITH}
                                    standalone={false}
                                    size={5}                                    
                                    style={{ data: { fill: aBusinessVolumeLegend[0].symbol.fill } }}
                                    data={ aBusinessVolumeNumData }
                                    domain = { {y: [0,  maxIncNum]} }
                                />
                        </VictoryChart>
                    </ReportCard>
                </ScrollView>
            </MenuProvider>
            
        )
    }

    _onNavigatorEvent(event) {
        Utility.handleNavigatorEvent(this.props.navigator, event);
    }

    _onNavToScreen(screenId, passProps, title) {
        this.props.navigator.push({
            screen: screenId,
            title: title,
            backButtonTitle: '',
            navigatorStyle: Utility.navigatorStyle,
            passProps: passProps
        });
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EBEBEB',
        paddingLeft: 10,
        paddingRight: 10
    }
});


class ReportCard extends Component {

    render() {
        return (
            <View
                style = { cardStyles.container }>
                <View style = { cardStyles.headerContainer }>
                    <Text style = { cardStyles.title }>{this.props.title}</Text>
                    { this.props.hasMonthNav ?
                        <B1MonthSwitch 
                            date = {this.props.date}
                            didChange = { (selDate) => { this.props.getDataBySelDate(selDate);  }}
                        /> : null
                    }
                </View>
                <B1SeperatorLine style = { cardStyles.seperatorLine }/>
                <TouchableOpacity onPress = { this.props.onPressChart }>
                    <View pointerEvents = 'none'>
                    { this.props.children }
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const cardStyles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 10,
    },
    title: {
        fontSize: 15,
        color: '#76767B',
        lineHeight: 20
    },
    seperatorLine: {
        backgroundColor: '#D3D3D3'
    }
});