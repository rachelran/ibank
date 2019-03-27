import React, { Component } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native';

export default class B1Button extends Component {
    render() {
        var btnStyle = styles.btn;
        if ( this.props.style ) {
            btnStyle = [ btnStyle, this.props.style ];
        }

        return (
            <TouchableOpacity 
                style = { btnStyle } 
                onPress = { this.props.onPress }>
                    <Text style = { styles.btnText }>{ this.props.title }</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#297FCA',
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: 6,
        alignItems: 'center'
    },
    btnText: {
        fontSize: 16,
        color: 'white'
    }
});