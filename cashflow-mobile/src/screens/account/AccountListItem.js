import React, {Component} from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';
import Utility from '../utility';
import I18n from 'react-native-i18n';
import B1SeperatorLine from '../base/control/B1SeperatorLine';


export default class AccountListItem extends Component {
    render() {
        let type = null;
        let Syn = null;
        this.props.amount>= 0 ?  Syn="+" : Syn="-";

        switch (this.props.typeId) {
            case 1:
            type = I18n.t('account.list.cashinstore')
            img = <Image source={require('../../../assets/img/counter.png')} style={itemStyles.image}/>
            break;
            case 2:
                type = I18n.t('account.list.bank')
                img = <Image source={require('../../../assets/img/bank.png')} style={itemStyles.image}/>
                break;
            case 3:
                type = I18n.t('account.list.alipay')
                img = <Image source={require('../../../assets/img/alipay.png')} style={itemStyles.image}/>
            break;
            case 4:
            type = I18n.t('account.list.wechatpay')
            img = <Image source={require('../../../assets/img/wechatpay.png')} style={itemStyles.image}/>
        break;
   
            default:
                break;}

        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={itemStyles.container}>
                <Text style={itemStyles.typeTitle}>{type}</Text>
                <B1SeperatorLine style={{backgroundColor: '#CAE4FB'}}/>
                <View style={itemStyles.line}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={itemStyles.imageContainer}>{img}</View>
                            <View style={itemStyles.textContainer}>
                                <Text style={itemStyles.name}>{this.props.accountName}</Text>
                                <Text style={itemStyles.code}>{this.props.accountCode}</Text>
                            </View>
                        </View>
                        <Text style={itemStyles.amount}>{Syn}{Utility.formatCurNumber(this.props.amount, 1)}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const itemStyles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginTop: 10,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10, 
        height:105,
    },
    line: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 15,
        height: 55
    },
    textContainer:{
        flexDirection: 'column', 
        justifyContent: 'center',
        marginLeft:8
    },
    name: {
        color: '#474747',
        fontSize: 18
    },
    code: {
        color: 'gray',
        fontSize: 12
    },
    amount: {
        color: '#297FCA',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight:8
    },
    typeTitle: {
        marginTop: 12,
        marginBottom: 8,
        color: '#297FCA',
        fontSize: 14,        
        marginLeft:4

    },
    image:{
        height: 40,
        width: 40,
        resizeMode:'contain',
        alignItems:'center',
        marginRight:4,
        marginLeft:4,
        },
    imageContainer:{
            height: 40,
            width: 40,
            alignItems:'center',
            marginRight:4,
            marginLeft:4,
            }
});