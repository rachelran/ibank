import React, {Component} from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet
} from 'react-native';
import Utility from '../utility';
import I18n from 'react-native-i18n';

export default class PaymentListItem extends Component {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={itemStyles.container}>
                <View style={itemStyles.line}>
                    <Text style={itemStyles.name}>{this.props.name}</Text>

                    {this.props.type === 'IN' ? <Text
                         style={itemStyles.inAmount}>+{Utility.formatCurrencyNumber(this.props.amount)}</Text> : <Text
                         style={itemStyles.outAmount}>-{Utility.formatCurrencyNumber(this.props.amount)}</Text>}
                </View>
                <View style={[itemStyles.line, itemStyles.marginTop]}>
                    <Text style={itemStyles.desc}>{this.props.time}</Text>
                    <Text style={itemStyles.desc}>{{
                        Draft: I18n.t('payment.status.draft'),
                        'Posted': I18n.t('payment.status.posted')
                    }[this.props.status]}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const itemStyles = StyleSheet.create({
    container: {
        padding: 14
    },
    line: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    marginTop: {
        marginTop: 4
    },
    name: {
        color: '#474747',
        fontSize: 18
    },
    inAmount: {
        fontWeight: 'bold',
        color: '#3C86FC',
        fontSize: 18
    },
    outAmount: {
        fontWeight: 'bold',
        color: '#3C86FC',
        fontSize: 18
    },
    desc: {
        color: '#8A8A8A',
        fontSize: 13
    }
});