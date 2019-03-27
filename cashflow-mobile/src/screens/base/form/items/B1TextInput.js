import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput
} from 'react-native';

export default class B1TextInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: `${props.value || ''}`
        };
    }

    render() {
        return (
            <View>
                <Text style={styles.title}>{this.props.title}:</Text>
                {
                    this.props.readonly ?
                        (<Text style={styles.value}>{this.props.value}</Text>)
                        :
                        (<TextInput style={styles.value} value={this.props.value}
                                    underlineColorAndroid = 'transparent'
                                    onChangeText={text => {
                                        this.setState({
                                            text: text
                                        });
                                        this.props.onChange && this.props.onChange(text, text);
                                    }}
                                    />)
                }

            </View>
        )
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.text === nextState.text) {
            return false;
        }

        return true;
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
        marginBottom: 4,
    }
});