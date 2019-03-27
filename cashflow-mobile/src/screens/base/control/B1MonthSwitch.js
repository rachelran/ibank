import React, { Component } from 'react';
import {
     View,
     TouchableOpacity,
     Image,
     Text,
     StyleSheet
} from 'react-native';
import Utility from '../../utility';

export const MONTH_SWITCH_MODE = {
    LIGHT: 0,
    DARK: 1
}

export default class B1MonthSwitch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: this.props.date || new Date()
        };
    }

    componentWillReceiveProps = (props) => {
        this.setState({
            date: props.date || new Date()
        });
    };

    render() {
        var textColor = '#474747', 
            leftImg = require('../../../../assets/img/left_arrow.png'), 
            rightImg = require('../../../../assets/img/right_arrow.png');
        if (this.props.mode === MONTH_SWITCH_MODE.LIGHT) {
            textColor = 'white',
            leftImg = require('../../../../assets/img/left_arrow01.png'), 
            rightImg = require('../../../../assets/img/right_arrow01.png');
        }

        return (
            <View style={styles.timeContainer}>
                <TouchableOpacity onPress={() => this._changeMonth(-1)}>
                    <Image source={leftImg}/>
                </TouchableOpacity>
                <Text style={[styles.timeLabel, { color: textColor}]}>{Utility.fromDateToMMM_Yyyy(this.state.date)}</Text>
                <TouchableOpacity onPress={() => this._changeMonth(+1)}>
                    <Image source={rightImg}/>
                </TouchableOpacity>
            </View>
        )
    }

    _changeMonth(iMonthDiff) {
        let oNewDate = Utility.changeMonth(iMonthDiff, this.state.date);

        this.setState({
            date: oNewDate
        }, () => {
            // this._loadPayments();
            if (this.props.didChange) {
                this.props.didChange(oNewDate);
            }
        });
    }
}

const styles = StyleSheet.create({
    timeContainer: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    timeLabel: {
        fontSize: 15,
        color: '#474747',
        marginLeft: 33,
        marginRight: 33,
    }
})