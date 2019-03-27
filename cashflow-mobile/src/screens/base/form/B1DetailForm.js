import React, {Component} from 'react';
import {
    SectionList,
    StyleSheet,
    Text,
    View,
    Modal,
    ActivityIndicator,
    KeyboardAvoidingView,
    Animated,
    Keyboard,
    ScrollView
} from 'react-native';
import B1TextField from './items/B1TextField';
import B1Button from '../control/B1Button';
import B1Select from './items/B1Select';
import B1DatePicker from './items/B1DatePicker';
import B1SeperatorLine from '../control/B1SeperatorLine';
import B1MoneyInput from "./items/B1MoneyInput";
import B1TextInput from "./items/B1TextInput";
import B1CustomTextInput from "./items/B1CustomTextInput";
import B1ProductGrid from "./items/B1ProductGrid";
import Utility from '../../utility';
import B1AttachmentList from './items/B1AttachmentList';

export const FORM_FIELD_TYPE = {
    //TEXT_FIELD: 1,
    SELECT: 2,
    BUTTON: 3,
    ATTACHMENT: 4,
    DATE_INPUT: 5,
    MONEY_INPUT: 6,
    TEXT_INPUT: 7,
    PRODUCT_GRID: 8,
    CUSTOM_BUTTON: 9,
    CUSTOM_TEXTINPUT:10
}

export default class B1DetailForm extends Component {
    render() {
        return (
            <ScrollView  >
            <KeyboardAvoidingView
                behavior = "padding"
                keyboardVerticalOffset = { 64 }
                enabled>
                    {this.props.loading ? <ActivityIndicator 
                        style = { formStyles.busyIndicator }
                        size = "large"/> : null}
                    <SectionList
                        style={formStyles.container}
                        renderItem={({item}) => this._renderItem(item)}
                        renderSectionHeader={({section: {title}}) => (
                            title ? <B1SectionHeader text={title}/> : null
                        )}
                        sections={this.props.layout}
                        keyExtractor={(item, index) => item + index}
                        ItemSeparatorComponent={ this._seperator }
                    />
            </KeyboardAvoidingView>
            </ScrollView>
            
            
        )
    }

    _seperator({leadingItem}) {
        if (leadingItem.options && leadingItem.options.animated && leadingItem.options.show === false) {
            return null;
        }
        if(leadingItem.options && leadingItem.changedField == 1 || leadingItem.changedField == 3 || leadingItem.changedField == 4 ){
            return null;
            //return <B1SeperatorLine style={{backgroundColor: '#ffffff'}}/>;
        }
        return <B1SeperatorLine/>;
    }

    _renderItem(item) {
        const defaultProps = {
            value: item.hasOwnProperty('value') ? item.value : Utility.getValueByPath(this.props.data, item.valueField), //this.props.data[item.valueField],
            desc: Utility.getValueByPath(this.props.data, item.descField),//this.props.data[item.descField],
            title: item.title || null,
            readonly: item.readonly,
            filter: item.filter,
            changed:Utility.getValueByPath(this.props.data, item.changedField),
            onChange: (value, desc) => {
                let data = Object.assign({}, this.props.data);

                if (item.valueField) {
                    Utility.setValueByPath(data, item.valueField, value);
                }

                if (item.descField && item.descField !== item.valueField) {
                    Utility.setValueByPath(data, item.descField, desc);
                }


                this._dataChanged(data, item.valueField);
            },
            ...item.options || {}
        };


        let itemObj = null;

        switch (item.type) {
            case FORM_FIELD_TYPE.SELECT:
                itemObj = <B1Select  {...defaultProps}
                                     onNavigatePush={this.props.onNavigatePush}
                                     onNavigatePop={this.props.onNavigatePop}/>;
                break;
            case FORM_FIELD_TYPE.BUTTON:
                itemObj = <B1Button {...defaultProps} style={formStyles.btnStyle}/>;
                break;
            case FORM_FIELD_TYPE.CUSTOM_BUTTON:
                itemObj = <B1CustomButtons {...defaultProps}/>;
                break;                
            case FORM_FIELD_TYPE.DATE_INPUT:
                itemObj = <B1DatePicker {...defaultProps} />;
                break;
            case FORM_FIELD_TYPE.MONEY_INPUT:
                itemObj = <B1MoneyInput {...defaultProps} />;
                break;
            case FORM_FIELD_TYPE.TEXT_INPUT:
                itemObj = <B1TextInput {...defaultProps} />;
                break;
            case FORM_FIELD_TYPE.CUSTOM_TEXTINPUT:
                itemObj = <B1CustomTextInput {...defaultProps} />;
                break;
            case FORM_FIELD_TYPE.PRODUCT_GRID:
                itemObj = <B1ProductGrid {...defaultProps}
                                         onNavigatePush={this.props.onNavigatePush}
                                         onNavigatePop={this.props.onNavigatePop}/>;
                break;
            case FORM_FIELD_TYPE.ATTACHMENT:
                itemObj = <B1AttachmentList {...defaultProps} />
                break;
            default:
                itemObj = <B1TextField {...defaultProps} />;
                break;
        }
        return (
            <B1FormBaseItem style={formStyles.lineItemContainer} {...defaultProps}>
                {itemObj}
            </B1FormBaseItem>
        )
    }

    _dataChanged(data, field) {
        this.props.onDataChange && this.props.onDataChange(data, field);
    }
}


const formStyles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: 'white'
    },
    lineItemContainer: {
        marginLeft: 14,
        marginRight: 14,
        paddingBottom: 6,
        // backgroundColor: 'red'
    },
    btnStyle: {
        marginTop: 20,
        marginBottom: 20
    },
    seperatorLine: {
        opacity: 1,
        backgroundColor: '#F7F7F7'
    },
    busyIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999
    }
});

class B1SectionHeader extends Component {
    render() {
        return (
            <View style={headerStyles.container}>
                <Text style={headerStyles.title}>{this.props.text}</Text>
            </View>
        )
    }
}


const headerStyles = StyleSheet.create({
    container: {
        backgroundColor: '#F7F7F7',
        paddingLeft: 14,
        paddingRight: 14,
    },
    title: {
        marginTop: 12,
        marginBottom: 12,
        color: '#297FCA',
        fontSize: 14
    }
});

const ANIMATION_DURATION = 250;
const ROW_HEIGHT = 56;
class B1FormBaseItem extends Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     height: new Animated.Value(64)
        // }
        if (props.hasOwnProperty("show") && props.show === false) {
            this._animated = new Animated.Value(0);
        } else {
            this._animated = new Animated.Value(1);
        }
    }

    render() {
        let rowStyles = {};
        if (this.props.animated) {
            rowStyles = {
                height: this._animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, ROW_HEIGHT],
                    extrapolate: 'clamp'
                }),
                opacity: this._animated
            }
        }
         
        return (
            <Animated.View style = { [ this.props.style, rowStyles ]}>
                { this.props.children }
            </Animated.View>
        )
    }

    componentDidUpdate() {
        if (!this.props.animated) {
            return;
        }
        
        let toValue = this.props.show ? 1 : 0;

        Animated.timing(this._animated, {
            toValue: toValue,
            duration: ANIMATION_DURATION
        }).start();
    }
}