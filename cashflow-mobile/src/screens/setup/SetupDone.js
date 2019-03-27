import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';
import B1Button from '../base/control/B1Button';
import utility from '../utility';

export default class SetupDone extends Component {
    render() {
        return (
            <View style = { styles.container }>
                <Image 
                    style = { styles.bgImg }
                    source = { require('../../../assets/img/setup/background02.png') }/>
                <Image 
                    style = { styles.icon }
                    source = { require('../../../assets/img/setup/done.png')}/>
                <Text
                    style = { styles.doneText}>
                    All Done!
                </Text>
                <B1Button 
                    style = { [ styles.btn, styles.loginBtn ]}
                    title = 'Login'
                    onPress = { () => { utility.navigateToLogin(this.props.navigator) }}/>
                <Text
                    style = { styles.hintText}>
                    Want to get ahead of the curve?
                </Text>
                <B1Button 
                    style = { [ styles.btn, styles.watchBtn ]}
                    title = 'Watch a short video of Cashflow basics'/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%'
    },
    bgImg: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    icon: {
        marginTop: 130,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    doneText: {
        color: 'white',
        marginTop: 40,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    hintText: {
        color: 'white',
        marginTop: 54,
        textAlign: 'center'
    },
    btn: {
        backgroundColor: '#0256FE',
        marginLeft: 30,
        marginRight: 30,
    },
    loginBtn: {
        marginTop: 150
    },
    watchBtn: {
        marginTop: 12
    }
});