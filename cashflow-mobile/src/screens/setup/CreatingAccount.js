import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';
import B1Button from '../base/control/B1Button';

export default class CreatingAccount extends Component {
    render() {
        return (
            <View style = { styles.container }>
                <Image 
                    style = { styles.bgImg }
                    source = { require('../../../assets/img/setup/background02.png') }/>
                <Image 
                    style = { styles.iconImg }
                    source = { require('../../../assets/img/setup/settingup.png') }/>
                <Text style = { styles.title }>We’re creating your account…</Text>
                <Text style = { styles.desc }>We’re setting up your very own Cashflow account right now. It shouldn’t take longer than a minute or two. Feel free to switch apps and we’ll send a notification when everything is ready.</Text>
                <Text
                    style = { styles.hintText }>
                    Want to get ahead of the curve?
                </Text>
                <B1Button 
                    style = { styles.btn }
                    title = 'Watch a short video of Cashflow basics'/>
            </View>
        )
    }

    componentDidMount() {
        var that = this;
        setTimeout( _ => {
            that.props.navigator.push({
                screen: 'b1lite.SetupDone',
                navigatorStyle: {
                    navBarHidden: true
                }
            });
        }, 3000);
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
    iconImg: {
        marginTop: 130,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    title: {
        marginTop: 40,
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    desc: {
        color: 'white',
        fontSize: 14,
        marginTop: 60,
        paddingLeft: 30,
        paddingRight: 30,
        lineHeight: 22
    },
    hintText: {
        color: 'white',
        marginTop: 94,
        textAlign: 'center'
    },
    btn: {
        backgroundColor: '#0256FE',
        marginTop: 12,
        marginLeft: 30,
        marginRight: 30,
    }
});