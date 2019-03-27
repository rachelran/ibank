import React, { Component } from 'react';
import {
    FlatList,
    View,
    Text,
    StyleSheet,
} from 'react-native';
import Utility from '../utility';
import B1SeperatorLine from '../base/control/B1SeperatorLine';
import B1Manager from '../../manager/B1Manager';
import PaymentListItem from '../payment/PaymentListItem';
import I18n from 'react-native-i18n';
import AllServices from '../../service';

export default class CategoriedPaymentList extends Component {
    constructor(props) {
        super(props);
        let navigator = this.props.navigator;
        navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
        navigator.setTitle({
            // title: I18n.t('moneydetail.category.' + this.props.categoryCode)
            title: this.props.categoryName
        });
        this.state = {
            payments: [],
            date: this.props.date || new Date(),
            type: this.props.type,
            categoryName: this.props.categoryName
        };
    }


    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.payments}
                    renderItem={({ item }) =>
                        <PaymentListItem
                            name={item.type === 'IN' ? item.fromName : item.toName}
                            time={Utility.fromDateToYyyy_Mm_Dd(Utility.fromYyyyMmDdToDate(item.transDate))}
                            amount={item.amount}
                            status={item.status}
                            type={item.type} 
                            onPress={() => this._onPressItem(item)}/>
                    }
                    keyExtractor={(item, index) => "" + index}
                    ItemSeparatorComponent={() => <B1SeperatorLine style={styles.seperatorLine} />} />
            </View>
        )
    }

    _loadPayments() {

        AllServices.CategoryService(B1Manager.getConnection()).find({
            where: Object.assign(
                {
                    name: this.state.categoryName,
                    type: this.state.type
                },
            )
        }
        ).then(res => {
            AllServices.PaymentService(B1Manager.getConnection()).find({
                where: Object.assign(
                    {
                        month: this.state.date.getMonth() + 1,
                        year: this.state.date.getFullYear(),
                        category: { id: res[0].id },
                        type: this.state.type,
                        isActive:true
                    },
                )
            }
            ).then(res => {
                this.setState({
                    payments: res
                });
            });
        });
    }

    _onNavigatorEvent(event) {
        if (event.id === 'willAppear') {
            this._loadPayments();
        }
        Utility.handleNavigatorEvent(this.props.navigator, event);
    }

    _onPressItem = (item) => {
        this._gotoDetailPage(item.id, item.type);
    }

    _gotoDetailPage(id, type) {
        this.props.navigator.push({
            screen: 'b1lite.PaymentDetail',
            title: {IN: I18n.t('payment.detail.in_title'), OUT: I18n.t('payment.detail.out_title')}[type],
            backButtonTitle: '',
            navigatorStyle: Utility.navigatorStyle,
            passProps: {
                id: id,
                type: type
            }
        });
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%'
    },
});

