import React, {Component} from 'react';
import {
    View,
    Image,
    TextInput,
    StyleSheet
} from 'react-native';
import B1SeperatorLine from '../base/control/B1SeperatorLine';
import PopupItem from './PopupItem';

export default class InputPopupItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <PopupItem>
                <Image source={this.props.img}/>
                <TextInput
                    style={inputStyles.input}
                    placeholder={this.props.placeholder}
                    underlineColorAndroid='transparent' secureTextEntry={this.props.password}
                    value={this.props.value}
                    onChangeText={text => this.props.onChangeText && this.props.onChangeText(text)}
                />
            </PopupItem>
        )
    }
}

const inputStyles = StyleSheet.create({
    input: {
        flex: 2,
        marginLeft: 10,
        fontSize: 14,
        paddingTop: 12,
        paddingBottom: 12,
    }
});