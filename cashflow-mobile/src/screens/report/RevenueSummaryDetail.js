import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    FlatList
} from 'react-native';

import B1SeperatorLine from '../base/control/B1SeperatorLine';
import B1MonthSwitch from '../base/control/B1MonthSwitch';
import PieChart from './chart/base/PieChart';
import Utility from '../utility';
import RemoteManager from '../../manager/RemoteManager';

const COLOR_SCALE = ["#3C86FC", "#3CB8FC", "#3CFCCA", "#15E067" ];

export default class RevenueSummaryDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // date: new Date(),
            chartData: []
        };
    }

    componentWillMount() {
        this._loadRevenueSummaryReport(this.state.date);
    }

    render() {
        var aCusData = this.state.chartData;
        var total = 0;
        aCusData.map((item, index) => {
            item.color = COLOR_SCALE[index%COLOR_SCALE.length]
            total += item.y;
        });

        return (
            <View style = { styles.container }>
                <View style = { styles.cardContainer }>
                    {/* <B1MonthSwitch didChange = { (date) => this._didChangeTimeRange(date)}/> */}
                    <PieChart 
                        colorScale = { COLOR_SCALE }
                        data = { this.state.chartData }
                        height = { 300 } 
                        text = { Utility.getCurrency() + Utility.formatShortNumber(total, 0, true) }/>
                    <B1SeperatorLine/>
                    <FlatList
                        data = { this.state.chartData }
                        keyExtractor={(item, index) => "" + index}
                        renderItem = { ({item}) => this._renderItem(item)}
                        ItemSeparatorComponent={() => <B1SeperatorLine/>}/>
                </View>
            </View>
        )
    }

    _didChangeTimeRange(date) {
        this.setState({
            date: date
        });
        this._loadRevenueSummaryReport(date);
    }

    _renderItem(item) {
        return (
            <View style = { styles.customerContainer}>
                <View style = { styles.customerNameContainer }>
                    <View style = { [ styles.customerIcon, { backgroundColor: item.color }]}/>
                    <Text style = { styles.customerName }>{item.x}</Text>
                </View>
                <View style = { styles.customerAmountContainer }>
                    <Text style = { styles.customerAmount }>{Utility.formatCurrencyNumber(item.y)}</Text>
                    <Image source={require('../../../assets/img/right_arrow.png')}/>
                </View>
            </View>
        )
    }
    
    _loadRevenueSummaryReport(date) {
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
                chartData: revenueSummaryData
            });
        }).catch(err => {
            console.log(err);
        });
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#1E508B',
        paddingLeft: 10,
        paddingRight: 10,
    },
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 10,
    },
    timeContainer: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    timeLabel: {
        fontSize: 15,
        color: '#474747',
        marginLeft: 33,
        marginRight: 33,
    },
    customerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 16,
        paddingRight: 10
    },
    customerNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    customerIcon: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10
    },
    customerName: {
        fontSize: 16,
        color: '#616161'
    },
    customerAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    customerAmount: {
        fontSize: 16,
        color: '#297FCA',
        marginRight: 8
    }
})