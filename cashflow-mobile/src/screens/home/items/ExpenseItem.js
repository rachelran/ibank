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

export default class ExpenseItem extends Component {
    render() {
        var obj = this.props.data;
        return (
            <View>
                <ItemHeader title="待确认" time={this._parseRelativeTime(obj.created)}/>

                <View style={styles.bodyContainer}>
                    <View style={styles.bodySubContainer}>
                        <Text style={styles.bodyText}>{obj.text}</Text>
                        {
                            obj.amount ? <Text style={styles.bodyText}>{Utility.formatCurrencyNumber(obj.amount)}</Text> : null
                        }
                        
                    </View>

                    {
                        obj.products ? <View>
                            {
                                obj.products.map(product => <Text key={product} style={styles.productText}>{`   ∙ ${product}`}</Text>)
                            }
                        </View> : null
                    }
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
    bodyContainer: {
        paddingTop: 14,
        paddingBottom: 14
    },
    // bodyText: {
    //     fontSize: 16,
    //     marginTop: 7
    // },
    bodySubContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        
    },
    bodyText: {
        fontSize: 13,
        color: '#777777'
    },
    productText: {
        fontSize: 13,
        color: '#777777',
        marginTop: 6
    }
});