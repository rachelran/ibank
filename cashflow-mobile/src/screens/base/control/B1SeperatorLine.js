import React, { Component } from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

export default class B1SeperatorLine extends Component {
    render() {
        var lineStyle = styles.line;
        if ( this.props.style ) {
            lineStyle = [lineStyle, this.props.style];
        }

        return (
            <View style = { lineStyle }/>
        )
    }
}

const styles = StyleSheet.create({
    line: {
        height: 1,
        backgroundColor: '#F7F7F7'
    }
});