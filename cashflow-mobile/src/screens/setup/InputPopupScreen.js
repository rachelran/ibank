import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';

export default class InputPopupScreen extends Component {
    render() {
        return (
            <View style = { styles.container }>
                <View style = { styles.headerContainer }>
                    <Image 
                        style = { styles.bgImg }
                        source = { require('../../../assets/img/setup/background01.png')}/>
                    <Image source = { require('../../../assets/img/setup/b1logo.png')}/>
                    <Text style = { styles.productNameText }>{ I18n.t('product_name')}</Text>
                </View>
                <Text
                    style = { styles.footerText}>
                    { I18n.t('copyright_txt')}
                </Text>
                <View style = { styles.configContainer }>
                    { this.props.children }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
        alignItems: 'center',
        paddingTop: 70
    },
    productNameText: {
        fontSize: 20,
        color: 'white',
        marginTop: 10,
        fontWeight: 'bold',
    },
    bgImg: {
        width: '100%',
        position: 'absolute',
        top: 0
    },
    footerText: {
        position: 'absolute',
        bottom: 10,
        fontSize: 12,
        color: '#9B9B9B',
        width: '100%',
        textAlign: 'center'
    },
    configContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        left: 10,
        right: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 30,
        top: '25%'
    }
});

