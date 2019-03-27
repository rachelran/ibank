import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import {
    VictoryPie,
    VictoryChart,
    VictoryLegend,
    VictoryAxis
} from 'victory-native';

export default class PieChart extends Component {
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

        let colorScale = this.props.colorScale || ["#3C86FC", "#3CB8FC", "#3CFCCA", "#15E067" ];
        let legends =this.props.data.map((item,index) => {
            return {
                name: item.x, 
                symbol: { 
                    fill: colorScale[index%colorScale.length], 
                    type: "square" 
                }, 
                labels: { 
                    fill: "#3678AF", 
                    fontSize: 10 
                } 
            };
        });

        let pieChart = <VictoryPie
                            {... this.props}
                            colorScale={ colorScale }
                            data={ this.props.data }
                            width = { width }
                            innerRadius = { width / 4 }
                            labels = { [] }
                            padding = { 20 }
                            // labels = {(d) => {
                            //     if ( that.state.chartReady ) {
                            //         return d.x;
                            //     }
                            // }}
                        />;

        return (
            <View 
                style = { styles.container }
                onLayout = { (event) => {
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
                <View style = { styles.chartBgContainer }>
                    <Text style = { { fontSize: fontSize, color: fontColor} }> { this.props.text }</Text>
                </View>
                {
                    this.props.showLegend ? 
                    <VictoryChart>
                        <VictoryLegend
                            orientation="horizontal"
                            data={legends}
                            itemsPerRow={5}
                            gutter={40}
                            symbolSpacer={5}
                            x = { 20}
                            y = { 10}
                        />
                        <VictoryAxis
                            tickFormat={(t) => ""}
                            style={ { 
                                axis: {stroke: "none"}
                            }} />
                        { pieChart }
                    </VictoryChart> : pieChart
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
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