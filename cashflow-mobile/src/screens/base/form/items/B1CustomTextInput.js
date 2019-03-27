import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput
} from 'react-native';
import I18n from 'react-native-i18n';


export default class B1CustomTextInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: `${props.value || ''}`,
            title:I18n.t('account.detail.account_number')
        };
    }

    render() {
        if(!!this.props.changed && this.props.changed == 1){
            this.state = {
                title: I18n.t('account.detail.store_address')
            };        }
        if(!!this.props.changed && this.props.changed == 2){
            this.state = {
                title: I18n.t('account.detail.account_number')
            };
        }
        if(!!this.props.changed && this.props.changed == 3){
            this.state = {
                title: I18n.t('account.detail.alipay_account')
            };
        }
        if(!!this.props.changed && this.props.changed == 4){
            this.state = {
                title: I18n.t('account.detail.wechat_account')
            };
        }
        return (
            <View>
                <Text style={styles.title}>{this.state.title}:</Text>
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
        if (!!nextProps.changed){
            return true;
        }
        else if (this.props.changed === nextProps.changed && this.state.text === nextState.text) {
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