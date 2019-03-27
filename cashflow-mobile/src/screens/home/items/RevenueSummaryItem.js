import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import {
    VictoryPie,
    VictoryTheme
} from 'victory-native';

import ItemHeader from './base/ItemHeader';
import PieChart from '../../report/chart/base/PieChart';
import Utility from '../../utility';
import I18n from 'react-native-i18n';
import DonutChart from '../../base/chart/DonutChart';

export default class RevenueSummaryItem extends Component {

    render () {
        var data = this.props.data;
        var total = 0;
        data.map(item => {
            total += item.y;
        });

        return (
            <View
            //     pointerEvents = 'box-none'
                >
                // {/* <ItemHeader
                    // title = { I18n.t('home.revenue_title')}/> */}
                <DonutChart 
                colorScale={["#3CB8FC", "#3CFCCA", "#3C86FC"]}
                fontColor = {"#FFFFFF"}
                fontSize = {20}
                height = { 280 }
                charHeight = {150}
                labelStyle =  {{fontSize:14, fill: 'white' }}
                navigator={this.props.navigator}
                data = { this.props.data }/>
             </View>
        )

    }
}