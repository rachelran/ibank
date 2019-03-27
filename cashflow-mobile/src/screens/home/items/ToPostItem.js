import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import ItemHeader from './base/ItemHeader';
import Utility from "../../utility";
import I18n from 'react-native-i18n';

export default class ToPostItem extends Component {
    render() {
        var obj = this.props.data;
        return (
            <View>
                <ItemHeader title={ I18n.t('home.payment_card_title')} time={this._parseRelativeTime(obj.created)}/>

                <Text style={styles.bodyText}>{obj.bp && obj.bp.name}</Text>
                <View style={styles.bodySubContainer}>
                    <Text style={styles.bodySubText}>{obj.accountType && obj.accountType.name}</Text>
                    <Text
                        style={styles.bodyValue}>{Utility.formatCurrencyNumber(obj.amount * (obj.type === 1 ? 1 : -1), true)}</Text>
                </View>
            </View>
        )
    }

    _parseRelativeTime(created) {
        let oCreatedTime = new Date(parseInt(created));
        let oNow = new Date();

        let seconds = (oNow.getTime() - oCreatedTime.getTime()) / 1000;

        if (seconds < 60) {
            return I18n.t('home.time_now');
        } else if (seconds >= 60 && seconds < 60 * 60) {
            let min = Math.round(seconds / 60);
            let transKey = min > 1 ? 'home.time_mins_ago' : 'home.time_min_ago';
            return I18n.t(transKey, {min: min});
        } else if (seconds >= 60 * 60 && seconds < 3600 * 24) {
            let hour = Math.round(seconds / 3600);
            let transKey = hour > 1 ? 'home.time_hours_ago' : 'home.time_hour_ago';
            return I18n.t(transKey, {hour: hour});
        } else {
            let day = Math.round(seconds / (3600 * 24));
            let transKey = day > 1 ? 'home.time_days_ago' : 'home.time_day_ago';
            return I18n.t(transKey, {day: day});
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginTop: 10,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    bodyText: {
        fontSize: 16,
        marginTop: 7
    },
    bodySubContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 7,
        paddingBottom: 14
    },
    bodySubText: {
        fontSize: 15,
        color: '#777777'
    },
    bodyValue: {
        fontSize: 16,
        color: '#297FCA'
    }
});