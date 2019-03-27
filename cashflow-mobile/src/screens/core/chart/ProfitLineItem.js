import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';
import {
    VictoryChart,
    VictoryAxis,
    VictoryLine,
    VictoryGroup,
    VictoryScatter,
    VictoryLegend,
    VictoryVoronoiContainer
} from 'victory-native';

import Utility from '../../utility';
import B1SeperatorLine from '../../base/control/B1SeperatorLine';
import I18n from 'react-native-i18n';

export default class ProfitLineItem extends Component {

    render() {
        let colorScale = ["#945ECF", "#1393D6", "#1AA979", "#E8743B"];

        let itemHeader = <View>
            <View style={styles.container}>
                <Image source={require('../../../../assets/img/cfl.png')} />
                <Text style={styles.title}>{I18n.t('core.profit_analysis.profit_trend')}</Text>
                <Text style={styles.subtitle}>{I18n.t('core.profit_analysis.intelligent insight')}</Text>
            </View>
            <B1SeperatorLine style={styles.seperatorLine} />
        </View>;

        if (this.props == null || this.props.data.data === undefined || this.props.data.data === null) {
            return <View>
                {itemHeader}
            </View>

        }

        let grossProfitLine = <VictoryGroup
            color={colorScale[0]}
            data={this.props.data.data[0].data}
        >
            <VictoryLine />
            <VictoryScatter size={6.5}
                events={[
                    {
                        target: 'data',
                        eventHandlers: {
                            onPressIn: () => {
                                return {
                                    target: 'data',
                                    mutation: (props) => {
                                        this._goToGrossDetail(props.datum.x);
                                    }
                                };
                            },
                        },
                    },
                ]}
            />
        </VictoryGroup>;

        let otherLines = <VictoryGroup >
            {
                this.props.data.data.map((item, index) => {
                    if (index !== 0) {
                        return <VictoryLine
                            standalone={false}
                            key={'' + index}
                            color={colorScale[index % colorScale.length]}
                            data={item.data} />
                    }
                })
            }
        </VictoryGroup>;

        let legendData = this.props.data.data.map((item, index) => {
            return {
                name: item.type,
                symbol: {
                    fill: colorScale[index],
                    type: "square",
                    size: 5
                },
                labels: {
                    fill: "#626262",
                    fontSize: 15,
                }
            };
        });

        return (
            <View>
                {itemHeader}
                <VictoryChart
                    height={220} containerComponent={<VictoryVoronoiContainer />}
                    padding={{ left: 40, right: 80, top: 30, bottom: 30 }} >

                    <VictoryAxis style={X_AXIS_STYLE} tickFormat={(t)=>t.substr(5, 2)}/>
                    <VictoryAxis dependentAxis
                        style={Y_AXIS_STYLE}
                        tickFormat={(t) => Utility.formatShortNumber(Math.round(t))}
                    />
                    {grossProfitLine}
                    {otherLines}
                </VictoryChart>
                <VictoryLegend height={50} orientation="horizontal" data={legendData}
                    gutter={50} symbolSpacer={3} x={20} y={15}
                />
            </View>
        )
    }

    _goToGrossDetail(month) {
        this.props.data.navigator.push({
            screen: 'b1lite.RevenueTrend',
            title: '产品毛利排名',
            backButtonTitle: '',
            navigatorStyle: Utility.navigatorStyle,
            passProps: {
                params: month
            }
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
    },
    title: {
        color: '#297FCA',
        fontSize: 17,
        paddingTop: 6,
        paddingLeft: 2,
        fontWeight: '400'
    },
    subtitle: {
        color: '#297FCA',
        fontSize: 17,
        paddingTop: 6,
        paddingLeft: 160,
        fontWeight: '400'

    },
    seperatorLine: {
        backgroundColor: '#CAE4FB'
    }
});

const X_AXIS_STYLE = {
    axis: { stroke: "#D9D9D9" },
    grid: { stroke: '#D9D9D9' },
    tickLabels: { fontSize: 8, stroke: '#3678AF', fontWeight: '100', letterSpacing: '1px' }
};
const Y_AXIS_STYLE = {
    axis: { stroke: "#D9D9D9" },
    tickLabels: { fontSize: 10, stroke: '#3678AF', fontWeight: '100', letterSpacing: '1px' }
};