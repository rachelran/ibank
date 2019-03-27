import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';
import B1SeperatorLine from '../../../base/control/B1SeperatorLine';

export default class ItemHeader extends Component {
    render() {
        return (
            <View>
                <View>
                    <View style = { styles.title_container }>
                        <Image source = { this.props.img }/>
                        <Text style = { styles.title }>{ this.props.title }</Text>
                    </View>
                    {this.props.time ? <Text style = { styles.time }>{ this.props.time }</Text> : null }
                </View>
                <B1SeperatorLine style = { styles.seperatorLine }/> 
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 10,
    },
    title_container: {
        flexDirection: 'row',
        paddingBottom: 5,
    },
    title: {
        color: '#297FCA',
        fontSize: 13
    },
    time: {
        color: '#B9B9B9',
        fontSize: 13
    },
    seperatorLine: {
        backgroundColor: '#CAE4FB'
    }
});