import React, { Component } from 'react';
import {
    View,
    Text,
    Span,
    StyleSheet,
    TextInput,
    Platform
} from 'react-native';
import utility from '../../../utility';

export default class B1DecimalLabel extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let label = this.props.data.label;
        let value = this.props.data.value;
        return (
            <View style={styles.bodySubContainer}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.subContainer}> 
                    <Text style={styles.amount}>{value}</Text>
                    <Text style={styles.currency}>元</Text>
                </View>                                    
            </View>
        )
    }

    __formatCurrencyWithNumber(amount) {
        return amount + "元";
    }
}

const styles = StyleSheet.create({
    subContainer: {
        flexDirection: 'row',        
        paddingTop: 10
    },
    bodySubContainer: {
        width: 180,
        flexDirection: 'column'
    },
    currency: {        
        fontSize: 12,
        textAlignVertical: 'bottom',
        color: '#B1B1B1',
        marginTop: 5
    },
    amount: {
        fontSize: 16,
        color: '#297FCA'
    },
    label: {    
        // paddingTop: 5,    
        fontSize: 16
        // marginTop: 17
    }
});