import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

export default class B1TextField extends Component {
    render() {
        return (
            <View>
                <Text style = { styles.title }>{ this.props.title }:</Text>
                <Text style = { styles.value }>{ this.props.value }</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        marginTop: 10,
        color: '#8A8A8A',
        fontSize: 12
    },
    value: {
        marginTop: 4,
        color: '#616161',
        fontSize: 16,
        marginBottom: 14,
    }
});