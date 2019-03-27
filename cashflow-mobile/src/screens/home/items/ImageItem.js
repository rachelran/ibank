 import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';
import {
    VictoryPie,
    VictoryTheme
} from 'victory-native';
import SVG from 'react-native-svg';

import ItemHeader from './base/ItemHeader';
import PieChart from '../../report/chart/base/PieChart';
import Utility from '../../utility';
import I18n from 'react-native-i18n';
import ImageList from '../../base/ImageList'

export default class ImageItem extends Component {

    constructor(props) {
      super(props);
    }


    render () {
        var data = this.props.data;
        console.log('**** ImageItem render', data);
        defaultImg  =  require('../../../../assets/img/benchmark.png');
        imgPath = defaultImg;
        if (typeof data != "undefined") {
            height = data.imgHeight ?  data.imgHeight : 448;
            imgPath = ImageList[data.imgName];
        }



        return (
            <View 
                pointerEvents = 'none'
                style={styles.itemContainer}
            >
            <ItemHeader 
                img = {require('../../../../assets/img/intelcards.png')}
                title = { I18n.t(data.title)}/>
            <Image
                source={imgPath}
                style={{height:height, width:315}}
                resizeMode={Image.resizeMode.contain} />
            </View>
        )
    }


}

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: 'white',
        marginTop: 10,
        borderRadius: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    imageBody: {
        // height: 431,
        width: 350,
        // 设置宽度
        // width:Dimensions.get('window').width,
        // // 设置高度
        // height:150
    },

});
