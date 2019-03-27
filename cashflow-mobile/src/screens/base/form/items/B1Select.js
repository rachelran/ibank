import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Utility from '../../../utility';
import B1SeperatorLine from '../../control/B1SeperatorLine';


//props:
export default class B1Select extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(!!this.props.changed && this.props.changed != 2){
            return null
        }

        let {highlight} = this.props;

        let titleStyle = [ styles.title, highlight ? styles.highlightTitle : styles.normalTitle ];

        return this.props.readonly ?
            (
                <View>
                    {this.props.title ? <Text style={titleStyle}> {this.props.title}:</Text> : null}
                    <Text style={this.props.inGrid ? styles.valueNoTitle : styles.value}> {this.props.desc}</Text>
                </View>
            )
            : (
                <TouchableOpacity style={styles.container} onPress={this._onPress.bind(this)}>
                    <View>
                        {this.props.title ? <Text style={titleStyle}> {this.props.title}:</Text> : null}
                        <Text style={this.props.inGrid ? styles.valueNoTitle : styles.value}> {this.props.desc}</Text>
                    </View>
                    {this.props.inGrid
                        ?
                        <Image source={require('../../../../../assets/img/cfl.png')}
                               style={{width: 20, height: 20, resizeMode: 'stretch'}}/>
                        :
                        <Image source={require('../../../../../assets/img/next.png')} style={{marginTop: 6}}/>

                    }
                </TouchableOpacity>
            )
    }

    _onPress() {
        this.props.onNavigatePush && this.props.onNavigatePush({
            screen: this.props.screen,
            passProps: Object.assign({}, {
                onChoose: (item) => {
                    this.props.onChange && this.props.onChange(
                        Utility.getValueByPath(item, this.props.valueField),
                        Utility.getValueByPath(item, this.props.descField)
                    );
                    this.props.onNavigatePop && this.props.onNavigatePop();
                },
                filter: this.props.filter
            }, this.props.passProps)
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        marginTop: 10,
        fontSize: 12
    },
    normalTitle: {
        color: '#8A8A8A'
    },
    highlightTitle: {
        color: 'black'
    },
    value: {
        marginTop: 4,
        color: '#616161',
        fontSize: 16,
        marginBottom: 4,
    },
    valueNoTitle: {
        marginTop: 6,
        color: '#616161',
        fontSize: 14,
        marginBottom: 6,
    }
});