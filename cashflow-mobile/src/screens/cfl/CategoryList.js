import React, {Component} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import Utility from '../utility';
import B1Manager from "../../manager/B1Manager";
import AllServices from '../../service';

export default class CategoryList extends Component {
    constructor(props) {
        super(props);
        let navigator = this.props.navigator;
        navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));

        this.state = {
            data: null
        }
    }

    componentWillMount() {
        let oCategoryService = AllServices.CategoryService(B1Manager.getConnection());
        oCategoryService.findByOption({where: this.props.filter}).then(res => {
            console.log(res);
            this.setState({
                data: res
            });
        });
    }

    render() {
        return (
            <FlatList
                data={this.state.data}
                renderItem={({item}) =>
                    <ListItem
                        data={item}
                        onPress={() => this._onPressItem(item)}
                    />
                }
                keyExtractor={item => item.id}
            />
        )
    }

    _onNavigatorEvent(event) {
        Utility.handleNavigatorEvent(this.props.navigator, event);
    }

    _onPressItem(item) {
        if (this.props.onChoose) {
            this.props.onChoose(item);
        }
    }

}

class ListItem extends Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} style={itemStyles.container}>
                <View style={itemStyles.line}>
                    <Text style={itemStyles.name}>{this.props.data.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}


const itemStyles = StyleSheet.create({
    container: {
        padding: 14
    },
    line: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    marginTop: {
        marginTop: 4
    },
    name: {
        color: '#474747',
        fontSize: 16
    },
    amount: {
        color: '#3C86FC',
        fontSize: 13
    },
    desc: {
        color: '#8A8A8A',
        fontSize: 13
    }
});