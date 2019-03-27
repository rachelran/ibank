import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import {
    VictoryPie,
    VictoryChart,
    VictoryLabel,
    VictoryAxis
} from 'victory-native';
import Utility from '../../utility';
import I18n from 'react-native-i18n';
export default class DonutChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartWidth: 1
        };
    }

    render() {
        var that = this;
        var width = this.props.width || that.state.chartWidth;
        var fontSize = this.props.fontSize || 27;
        var fontColor = this.props.fontColor || "#3C86FC";
        var lableStyle = this.props.labelStyle
        var charHeight = this.props.charHeight || 285
        var total = 0;
        var dx = this.props.dx || 1;
        var dy = this.props.dy || 0;
        var radius = this.props.radius || 4;
        var angle = this.props.angle || 0;
        var labelRadius = this.props.labelRadius || 115;
        var numSymbol = this.props.numSymbol || "";
        var lableSymbol = this.props.labelSymbol || "\n";
        this.props.data.map(item => {
            total += item.y;
        });

        let colorScale = this.props.colorScale || ["#3C86FC", "#5899DA", "#96D0D9", "#BFDDFF", "#5AC8FA"];
        let legends = this.props.data.map((item, index) => {
            return {
                name: item.x,
                symbol: {
                    fill: colorScale[index % colorScale.length],
                    type: "square"
                },
                labels: {
                    fill: "#3678AF",
                    fontSize: 12
                }
            };
        });

        let pieChart = <VictoryPie
            animate={{
                duration:2000,
                onLoad:{duration:1000}
            }}
            {... this.props}
            colorScale={colorScale}
            data={this.props.data}
            width={width}
            innerRadius={width / radius}
            labelRadius={labelRadius}
            style={{ labels: lableStyle }}
            // labels={(data) => `${data.x}-${data.y}`} 
            labels={(data) => `${data.x}${lableSymbol}${(data.symbol || numSymbol) + Utility.getCurrency() + Utility.formatShortNumber(`${data.y}`, 1, false)}`}
            labelComponent={<VictoryLabel dx={dx} dy={dy} angle={angle} />}
            style={{ labels: lableStyle }}
            events={[
                {
                    target: "data",
                    eventHandlers: {
                        onPressIn: () => {
                            return [{
                                mutation: (data) => {
                                    if(this.props.didSelect)
                                        this.props.didSelect(data);
                                }
                            }];
                        }
                    }
                }
            ]}
        />

        return (
            <View
                style={styles.container}
                onLayout={(event) => {
                    if (this.props.width) {
                        that.setState({
                            chartWidth: this.props.width
                        });
                        return;
                    }

                    var width = event.nativeEvent.layout.width;
                    if (width > 0) {
                        if (this.props.height) {
                            width = Math.min(width, this.props.height);
                        }
                        that.setState({
                            chartWidth: width
                        });
                    }
                }}>
                <View style={styles.chartBgContainer}>
                    <Text style={{ fontSize: fontSize, color: fontColor, fontWeight: 'bold' }}> {`${numSymbol + Utility.getCurrency() + Utility.formatShortNumber(total, 1, false)}`}</Text>
                </View>
                {
                    <VictoryChart
                        height={charHeight}>
                        <VictoryAxis
                            tickFormat={(t) => ""}
                            style={{
                                axis: { stroke: "none" }
                            }} />
                        {pieChart}
                    </VictoryChart>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    chartBgContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})