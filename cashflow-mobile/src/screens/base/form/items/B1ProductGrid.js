import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    TouchableOpacity,
    Image,
    ImageBackground
} from 'react-native';
import B1Select from '../items/B1Select';
import B1MoneyInput from "./B1MoneyInput";
import Utility from '../../../utility';
import I18n from 'react-native-i18n';

export default class B1ProductGrid extends Component {
    render() {
        const {itemValueField, itemDescField, amountValueField, readonly} = this.props;

        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                marginTop: 12,
                borderColor: '#DEDEDE',
                borderRadius: 8
            }}>
                {readonly ? null : (
                    <View style={{
                        width: '100%',
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        paddingLeft: 10,
                        paddingRight: 10
                    }}>
                        <Button title="+" onPress={() => {
                            let aNewArray = Object.assign([], this.props.value);
                            let obj = {};

                            Utility.setValueByPath(obj, itemValueField, null);
                            Utility.setValueByPath(obj, itemDescField, null);
                            Utility.setValueByPath(obj, amountValueField, 0);

                            aNewArray.push(obj);

                            this.props.onChange && this.props.onChange(aNewArray, aNewArray);
                        }}/>
                    </View>
                )}
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    width: '100%',
                    height: 40,
                    backgroundColor: '#f5f9ff',
                    paddingTop: 10,
                    paddingBottom: 10
                }}>
                    <View style={{width: '10%'}}>
                        <Text> </Text>
                    </View>
                    <View style={{width: '45%', borderRightWidth: 1, borderRightColor: '#DDDDDD'}}>
                        <Text style={{color: '#777777', paddingLeft: 10}}>{ I18n.t('payment.detail.product_column')}</Text>
                    </View>
                    <View style={{width: '45%', alignItems: 'flex-end'}}>
                        <Text style={{color: '#777777', paddingRight: 10}}>{ I18n.t('payment.detail.amount_column')}</Text>
                    </View>
                </View>
                {
                    (this.props.value || []).map((item, i) => {
                        return (
                            <View key={`${i}`}
                                  style={{
                                      width: '100%',
                                      flex: 1,
                                      flexDirection: 'row',
                                  }}>
                                <View style={{width: '10%'}}>
                                    {readonly ? null : (<TouchableOpacity onPress={() => {
                                        let aNewArray = Object.assign([], this.props.value);

                                        aNewArray.splice(i, 1);

                                        this.props.onChange && this.props.onChange(aNewArray, aNewArray);
                                    }}>
                                        <Image style={{width: 20, height: 20, margin: 10}}
                                               source={require('../../../../../assets/img/Slice.png')}/>
                                    </TouchableOpacity>)}
                                </View>
                                <View style={{width: '45%', paddingRight: 5, paddingLeft: 5}}>
                                    <ImageBackground
                                        source={require('../../../../../assets/img/grid_input_background.png')}
                                        style={styles.imageBackground}
                                        imageStyle={{resizeMode: 'stretch'}}
                                    >
                                        <B1Select
                                            readonly={readonly}
                                            value={Utility.getValueByPath(item, itemValueField)}
                                            desc={Utility.getValueByPath(item, itemDescField)}
                                            screen='b1lite.ProductList'
                                            descField='name'
                                            valueField='id'
                                            inGrid={true}
                                            onNavigatePush={this.props.onNavigatePush}
                                            onNavigatePop={this.props.onNavigatePop}
                                            onChange={(value, desc) => {
                                                let data = Object.assign({}, this.props.value[i]);

                                                if (itemValueField) {
                                                    Utility.setValueByPath(data, itemValueField, value);
                                                }

                                                if (itemDescField) {
                                                    Utility.setValueByPath(data, itemDescField, desc);
                                                }

                                                let aNewArray = Object.assign([], this.props.value);
                                                aNewArray[i] = data;

                                                this.props.onChange && this.props.onChange(aNewArray, aNewArray);
                                            }}
                                        />
                                    </ImageBackground>
                                </View>
                                <View style={{
                                    width: '45%',
                                    paddingRight: 5,
                                    paddingLeft: 5
                                }}>
                                    <ImageBackground
                                        source={require('../../../../../assets/img/grid_input_background.png')}
                                        style={styles.imageBackground}
                                        imageStyle={{resizeMode: 'stretch'}}
                                    >
                                        <B1MoneyInput readonly={readonly} value={item[amountValueField]}
                                                      onChange={(value, desc) => {
                                                          let data = Object.assign({}, this.props.value[i]);

                                                          if (amountValueField) {
                                                              data[amountValueField] = value;
                                                          }

                                                          let aNewArray = Object.assign([], this.props.value);
                                                          aNewArray[i] = data;

                                                          this.props.onChange && this.props.onChange(aNewArray, aNewArray);
                                                      }}/>
                                    </ImageBackground>
                                </View>
                            </View>
                        );
                    })
                }


            </View>
        )
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
        marginBottom: 14,
    },
    imageBackground: {
        width: null,
        height: null,
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: 8,
        paddingRight: 8
    }
});