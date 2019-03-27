import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import utility from '../../../utility';
import DatePicker from 'react-native-datepicker';
import I18n from 'react-native-i18n';

//todo: support android
//props.value: '20180101'
export default class B1DatePicker extends Component {
    render() {
        let date = utility.fromDateToYyyy_Mm_Dd(utility.fromYyyyMmDdToDate(this.props.value));

        return this.props.readonly ? (
            <View>
                <Text style={styles.title}>{this.props.title}:</Text>
                <Text style={styles.value}>{date}</Text>
            </View>
        ) : (
            <View>
                <Text style={styles.title}>{this.props.title}:</Text>
                <DatePicker date={date}
                            format="YYYY-MM-DD"
                            mode='date'
                            onDateChange={this._onChange.bind(this)}
                            confirmBtnText={ I18n.t('confirm_btn')}
                            cancelBtnText={ I18n.t('cancel_btn')}
                            showIcon={true}
                            iconSource={require('../../../../../assets/img/next.png')}
                            style={{width: '100%'}}
                            customStyles={{
                                dateInput: {
                                    borderWidth: 0,
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    height: 32
                                },
                                dateTouchBody: {
                                  height: 32
                                },
                                dateText: {
                                    fontSize: 16,
                                    color: '#616161',
                                    marginTop: 4,
                                    marginBottom: 4
                                },
                                dateIcon: {
                                    width: 16,
                                    height: 16,
                                    marginRight: 0
                                }
                            }}

                />
            </View>
        )
    }

    _onChange(date) {
        let yyyymmdd = utility.fromDateToYyyyMmDd(utility.fromYyyy_Mm_DdToDate(date));

        this.props.onChange && this.props.onChange(yyyymmdd, yyyymmdd);
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