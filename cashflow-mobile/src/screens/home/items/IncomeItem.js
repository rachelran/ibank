import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';
import DonutChart from '../../base/chart/DonutChart';
import ItemHeader from './base/ItemHeader';
const COLOR_SCALE = ["#3C86FC", "#96D0D9", "#BFDDFF", "#5AC8FA", "#5899DA"];
export default class IncomeItem extends Component {
    render(){
        return(
            <View 
            pointerEvents = 'none'
            style={styles.itemContainer}
            >
            <View style={styles.sectionContainer}>
            <ItemHeader 
            img = {require('../../../../assets/img/intelcards.png')}
            title = { I18n.t('home.income_title')}/>
            </View>
            <View style={styles.pieContainer}>
            <DonutChart
                labelRadius={75}
                height={190}
                charHeight={190}
                radius={2.7}
                fontSize={18}
                numSymbol={"+"}
                labelStyle={{ fontSize: 10, fontFamily:'Helvetica'}}
                data={this.props.data}
                colorScale={COLOR_SCALE} />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: 'white',
        marginTop: 10,
        borderRadius: 10
    },
    sectionContainer: {
        marginLeft:20,
        marginRight:20
    },
    pieContainer: {
        marginLeft:-10,
        marginRight:-10
    },
    title: {
        fontSize: 15,
        color: 'white',
        marginTop: 10,
    },
    cardsTitle: {
        color: '#FFFFFF',
        fontSize: 13
    }
});