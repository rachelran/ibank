import React, { Component } from 'react';
import {
    View,
    Image,
    Button,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity
} from 'react-native';
import {
    Pages 
} from 'react-native-pages';
import B1Button from '../base/control/B1Button';
import utility from '../utility';
import I18n from 'react-native-i18n';

const TITLE_POSITION = {
    LEFT_TOP: 1,
    RIGHT_TOP: 2,
    LEFT_BOTTOM: 3
}

export default class WelcomeScreen extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.setDrawerEnabled({
            side: 'left',
            enabled: false
        });
    }
    
    render() {
        return (
            <View style = { screenStyles.container }>
                <View style = { screenStyles.logoLineContainer }>
                    <Image source = { require('../../../assets/img/setup/logo.png')}/>
                    {/* <TouchableOpacity onPress = { () => utility.navigateToLogin(this.props.navigator)}>
                        <Text style = { screenStyles.loginBtn }>{ I18n.t('welcome.login_txt')}</Text>
                    </TouchableOpacity> */}
                </View>
                <Pages indicatorColor = '#297FCA'
                    containerStyle = { screenStyles.pages }>
                    <WelcomeContent 
                        bgImg = { require('../../../assets/img/setup/pic01.png')}
                        // descImg = { require('../../../assets/img/setup/cashflow_demystified.png') }
                        title = { I18n.t('welcome.cashflow_title')}
                        text = { I18n.t('welcome.cashflow_msg')}/>
                    <WelcomeContent 
                        bgImg = { require('../../../assets/img/setup/pic02.png')}
                        // descImg = { require('../../../assets/img/setup/seamless.png') }
                        title = { I18n.t('welcome.seamless_title')}
                        text = { I18n.t('welcome.seamless_msg')}
                        position = { TITLE_POSITION.RIGHT_TOP }/>
                    <WelcomeContent 
                        bgImg = { require('../../../assets/img/setup/pic03.png')}
                        // descImg = { require('../../../assets/img/setup/next.png') }
                        title = { I18n.t('welcome.next_title')}
                        text = { I18n.t('welcome.next_msg')}
                        position = { TITLE_POSITION.LEFT_BOTTOM }/>
                </Pages>
                <B1Button 
                    style = { screenStyles.startBtn }
                    title = { I18n.t('welcome.start_btn') }
                    // onPress = { () => { utility.navigateToSignUp(this.props.navigator) }}/>
                    onPress = { () => { utility.navigateToLogin(this.props.navigator) }}/>
            </View>
        )
    }
}

const screenStyles = new StyleSheet.create({
    container: {
        height: '100%',
        paddingTop: 50
    },
    logoLineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 30,
        paddingRight: 30
    },
    loginBtn: {
        fontSize: 14,
        color : '#0256FE'
    },
    pages: {
        marginBottom: 22,
        marginTop: 45
    },
    startBtn: {
        marginBottom: 40,
        marginLeft: 30,
        marginRight: 30
    },
    startBtnTitle: {
        fontSize: 16,
        color: 'white'
    }
});

class WelcomeContent extends Component {
    render() {
        var descPosStyle;
        switch (this.props.position) {
            case TITLE_POSITION.LEFT_BOTTOM:
                descPosStyle = contentStyles.descLeftBottom;
                break;
            case TITLE_POSITION.RIGHT_TOP:
                descPosStyle = contentStyles.descRightTop;
                break;
            default:
                descPosStyle = contentStyles.descLeftTop;
                break;
        }
        return (
            <View style = { contentStyles.container }>
                <View style = { contentStyles.imgContainer }>
                    <Image source = { this.props.bgImg }/>
                    <View style = { [ contentStyles.descContainer, descPosStyle ]}>
                        <Image source = { require('../../../assets/img/setup/b1lite.png') }/>
                        {/* <Image 
                            style = { contentStyles.descImg }
                            source = { this.props.descImg }/> */}
                        <Text
                            style = { contentStyles.title }>
                            {this.props.title}
                        </Text>
                    </View>
                </View>
                <Text style = { contentStyles.text }> { this.props.text } </Text>
            </View>
        )
    } 
}

const contentStyles = StyleSheet.create({
    container: {
        paddingLeft: 30,
        paddingRight: 30,
    },
    imgContainer: {
        alignItems: 'center',
    },
    descContainer: {
        position: 'absolute',
    },
    descLeftTop: {
        top: 20,
        left: 0
    },
    descRightTop: {
        top: 20,
        right: 0
    },
    descLeftBottom: {
        bottom: 20,
        left: 0
    },
    title: {
        marginTop: 25,
        color: '#3C86FC',
        fontSize: 30,
        fontWeight: 'bold'
    },
    text: {
        color: '#474747',
        fontSize: 16,
        marginTop: 30
    }
});