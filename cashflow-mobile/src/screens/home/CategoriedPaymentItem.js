import React, { Component } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native';
import Utility from '../utility';
import I18n from 'react-native-i18n';
import RadiusBtn from '../base/control/RadiusBtn';

export default class CategoriedPaymentItem extends Component {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}>
                <View style={styles.customerContainer}>
                    <View style={styles.customerNameContainer}>
                        <View style={[styles.customerIcon, { backgroundColor: this.props.color }]} />
                        <Text style={styles.customerName}>{this.props.name}</Text>
                    </View>
                    <View style={styles.customerAmountContainer}>
                        <Text style={styles.customerAmount}>{`${this.props.numSymbol + Utility.formatCurNumber(this.props.amount, 1)}`}</Text>
                        <Image source={require('../../../assets/img/right_arrow.png')} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
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
        height: 30
    },
    customerIcon: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10
    },
    customerName: {
        fontSize: 18,
        color: '#616161'
    },
    customerAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    customerAmount: {
        fontSize: 20,
        color: '#297FCA',
        marginRight: 8,
        fontWeight: 'bold'
    }
})