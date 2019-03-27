import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Platform
} from 'react-native';
import utility from '../../../utility';


export default class B1MoneyInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: utility.formatCurrencyNumber(this.props.value)
        }

        this._isFocused = false;
    }

    render() {
        return (
            <View>
                {this.props.title ? <Text style={styles.title}>{this.props.title}:</Text> : null}
                {this.props.readonly ?
                    (<Text
                        style={this.props.title ? styles.value : styles.valueNoTitle}>{utility.formatCurrencyNumber(this.props.value)}</Text>) :
                    (<TextInput ref='MoneyInput' style={this.props.title ? styles.value : styles.valueNoTitle}
                                value={this._isFocused ? this.state.inputValue : utility.formatCurrencyNumber(this.props.value)}
                                keyboardType = 'numeric'
                                returnKeyType='done'
                                underlineColorAndroid = 'transparent'
                                onChangeText={text => {
                                    let fMoney = text;
                                    this.setState({
                                        inputValue: text
                                    });
                                    if (text === "") {
                                        fMoney = 0;
                                    } else {
                                        fMoney = this._parseRealFloat(text);
                                    }
                                    if (!isNaN(fMoney)) {
                                        this.props.onChange && this.props.onChange(fMoney, fMoney);
                                    }
                                }}
                                onBlur={() => {
                                    let fMoney = this.props.value;

                                    this.setState({
                                        inputValue: utility.formatCurrencyNumber(fMoney)
                                    });

                                    this._isFocused = false;

                                }}
                                onFocus={() => {
                                    fMoney = this._parseRealFloat(this.state.inputValue);
                                    if (fMoney === 0) {
                                        this.setState({
                                            inputValue: ""
                                        });
                                    }
                                    this._isFocused = true;
                                }}
                                onEndEditing={() => this.props.onEndEditing && this.props.onEndEditing()}
                    />)}

            </View>
        )
    }

//     componentWillReceiveProps(nextProps) {
//         // You don't have to do this check first, but it can help prevent an unneeded render
//         let formattedValue = utility.formatCurrencyNumber(nextProps.value)
//         if (nextProps. !== this.state.startTime) {
//           this.setState({ startTime: nextProps.startTime });
//         }
// }

    _parseRealFloat(text) {
        text = text.replace(/[^\d.-\\+]/g, '');
        let fMoney = parseFloat(text);

        return fMoney;
    }
}

const styles = StyleSheet.create({
    title: {
        marginTop: 10,
        // color: '#8A8A8A',
        fontSize: 12
    },
    value: {
        marginTop: 4,
        // color: '#616161',
        color: 'green',
        fontSize: 24,
        marginBottom: 4,
        width: '100%',
        paddingTop: 0,
        paddingBottom: 0,
    },
    valueNoTitle: {
        marginTop: Platform.OS === 'ios' ? 6 : 2,
        color: '#616161',
        fontSize: 14,
        marginBottom: Platform.OS === 'ios' ? 6 : 2,
        textAlign: 'right',
        width: '100%',
        paddingTop: 0,
        paddingBottom: 0,
    }
});