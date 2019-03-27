import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import {
    VictoryPie,
    VictoryTheme,
    VictoryChart,
    VictoryLegend,
    VictoryAxis,
    VictoryLabel

} from 'victory-native';

import Utility from '../../utility';
import I18n from 'react-native-i18n';

export default class RevenueSummaryPieItem extends Component {

    render() {
        var colorScale = ["#5899DA", "#E8743B", "#1AA979"];
        let legends = this.props.data.map((item, index) => {
            return {
                name: item.x,
                symbol: {
                    fill: colorScale[index % colorScale.length],
                    size: 7
                },
                labels: {
                    fill: "#626262",
                    fontSize: 15,
                    fontWeight: '700'
                }
            };
        });
        var data = this.props.data;
        var total = 0;
        var width = this.props.width || 1;
        data.map(item => {
            total += item.y;
        });

        return (
            <View pointerEvents='none' >
                <VictoryChart padding={{ top: 40, bottom: 40, left: -180 }} height={220} >
                    <VictoryLegend
                        orientation="vertical"
                        rowGutter={40}
                        symbolSpacer={5}
                        data={legends}
                        x={200}
                        y={30}
                    />
                    <VictoryLabel
                        style={{ fontSize: 18, fill: "#5D9FD7", fontWeight: '3000' }}
                        x={210} y={60}                      
                        text={`${Utility.getCurrency() + Utility.formatCurrencyNumber(data[0].y, true)}`}
                    />
                    <VictoryLabel
                        style={{ fontSize: 18, fill: "#5D9FD7", fontWeight: '3000' }}
                        x={210} y={120}                       
                        text={`${Utility.getCurrency() + Utility.formatCurrencyNumber(data[1].y, true)}`}
                    />
                    <VictoryLabel
                        style={{ fontSize: 18, fill: "#5D9FD7", fontWeight: '3000' }}
                        x={210} y={180}                       
                        text={`${Utility.getCurrency() + Utility.formatCurrencyNumber(data[2].y, true)}`}
                    />
                    <VictoryAxis
                        tickFormat={(t) => ""}
                        style={{
                            axis: { stroke: "none" }
                        }} />
                    <VictoryPie
                        colorScale={colorScale}
                        data={data}
                        innerRadius={50}
                        labels={(d) => ''}
                    />
                    <VictoryLabel
                        textAnchor="middle"
                        style={{ fontSize: 15 }}
                        x={85} y={100}
                        text={I18n.t('core.profit_analysis.revenue')}
                    />
                    <VictoryLabel
                        textAnchor="middle"
                        style={{ fontSize: 18, fill: "#4289FC", fontWeight: '500' }}
                        x={95} y={120}
                        text={`${Utility.getCurrency() + Utility.formatShortNumber(total, 0, true)}`}
                    />
                </VictoryChart>

            </View>
        )
    }
}