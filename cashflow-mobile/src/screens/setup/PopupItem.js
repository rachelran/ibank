import React, {Component} from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import B1SeperatorLine from '../base/control/B1SeperatorLine';

export default class PopupItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <View style={inputStyles.container}>
                    { this.props.children }
                </View>
                <B1SeperatorLine/>
            </View>
        )
    }
}

const inputStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20
    }
});