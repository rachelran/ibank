import React, {
    Component
} from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Utility from '../utility';
import RevenueSummaryPieItem from './chart/RevenueSummaryPieItem';

import I18n from 'react-native-i18n';
import AnalyticManager from '../../manager/AnalyticManager';
import ProfitLineItem from './chart/ProfitLineItem'

const ITEM_TYPE = {
    PAYMENT: 1,
    REVENUE_SUMMARY: 2,
    EXPENSE: 3,
    IMAGE: 4,
    LINE: 5
}

// 二级页面 毛利分析
export default class ProfitAnalysis_v2 extends Component {
    constructor(props) {
        super(props);
        let navigator = this.props.navigator;
        navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
        navigator.setTitle({
            title: I18n.t('menu.profit_analysis')
        });
        navigator.setStyle(Utility.navigatorStyle);
        this.state = {
            revenueSummaryData: [
                {
                    x: '成本',
                    y: 0
                },
                {
                    x: '费用',
                    y: 0
                },
                {
                    x: '毛利',
                    y: 0
                }
            ]
        }
    }

    componentDidMount() {
        this._renderSummaryData();
        this._renderMonthTrendData();
    }

    _renderMonthTrendData() {
        AnalyticManager.getMonthTrend().then(response => {
            let lineDetailData = [];
            if (response != null && response.length > 0) {
                response.forEach(item => {
                    var dataResult = {
                        type: I18n.t('core.profit_analysis.' + item.type),
                        data: []
                    };
                    item.monthTrendList.forEach(trend => {
                        dataResult.data.push({
                            x: trend.month,
                            y: trend.value
                        });
                    });
                    if (dataResult.type === '毛利') {
                        lineDetailData.splice(0, 0, dataResult);
                    } else {
                        lineDetailData.push(dataResult);
                    }
                });
            }
            this.setState({
                lineDetailData
            });
        }).catch(err => {
            console.log(err);
        });
    }

    _renderSummaryData() {
        AnalyticManager.getRevenueSummary().then(response => {
            let revenueSummaryData = [];
            if (response !== null && response.length > 0) {
                response.forEach(item => {
                    revenueSummaryData.push({
                        x: I18n.t('core.profit_analysis.' + item.type),
                        y: Math.abs(item.value)
                    });
                });
            }
            this.setState({
                revenueSummaryData
            });
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        if (this.state === null) {
            return <View style={styles.conatiner}>
            </View>
        }
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
                                type: ITEM_TYPE.LINE,
                                navigator: this.props.navigator
                            }
                        ]}
                    renderItem={({ item }) => this._renderItem(item)}
                    keyExtractor={(item, index) => "" + index}
                />
            </View>
        )
    }

    _renderItem(item) {
        var content;
        switch (item.type) {
            case ITEM_TYPE.REVENUE_SUMMARY:
                if (item === null || item.data === undefined || item.data === null) {
                    break;
                }
                content = <RevenueSummaryPieItem data={item.data} />
                break;
            case ITEM_TYPE.LINE:             
                content = <ProfitLineItem data={item} />
                break;
            default:
                break;
        }
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.itemContainer}
            >
                {content}
            </TouchableOpacity>
        )
    }

    _onNavigatorEvent(event) {
        Utility.handleNavigatorEvent(this.props.navigator, event);
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