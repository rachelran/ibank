import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    FlatList
} from 'react-native';

import B1SeperatorLine from '../base/control/B1SeperatorLine';
import Utility from '../utility';
import ImageItem from './items/ImageItem';
import I18n from 'react-native-i18n';



export default class SingleImagePage extends Component {
    constructor(props) {
        // data: imageName, imgHeight
        super(props);
        console.log("SingleImagePage -----", this.props.params)

        if (this.props.params) {
            this.props.navigator.setTitle({
                title: this.props.params.imgName.replace("_detail", "")
            });
            this.state = {
                // date: new Date(),
                data:this.props.params
            };
        }
        else {
            this.props.navigator.setTitle({
                title: '利润表'
            });
            this.state = {
                // date: new Date(),
                data: {
                    imgName:'利润表',
                    imgHeight:448,
                }
            };
        }

        

        let navigator = this.props.navigator;
        navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));

        
    }

    _onNavigatorEvent(event) {
        console.log("eeee",event)
        Utility.handleNavigatorEvent(this.props.navigator, event);

    }

    componentWillMount() {

    }

    render() {
        var data = this.state.data;

        return (
            <View style={styles.conatiner}>
                
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.imageItemContainer}>
                    <ImageItem data={data} style={style.imageItem}/>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    conatiner: {
        height: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#1E508B'
    },
    title: {
        fontSize: 15,
        color: 'white',
        marginTop: 10,
    },
    imageItemContainer: {
        backgroundColor: 'white',
        marginTop: 10,
        borderRadius: 10,
        paddingLeft: 0,
        paddingRight: 10
    },
    imageItem: {

    }
})
