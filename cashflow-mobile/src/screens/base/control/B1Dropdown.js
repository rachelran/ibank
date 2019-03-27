import React, { Component } from 'react';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-popup-menu';

export default class B1Dropdown extends Component {
    render() {
        return (
            <Menu onSelect={ this.props.onSelect }>
                <MenuTrigger 
                    text={this.props.options.filter(({key}) => key === this.props.selectedKey)[0].text}
                    customStyles={this.props.customStyles ? this.props.customStyles : {
                        triggerWrapper: {
                            paddingTop: 5,
                            paddingBottom: 5,
                            paddingLeft: 15, 
                            paddingRight: 15,
                            backgroundColor: '#F5F4F4', 
                            borderRadius: 100,
                            alignItems: 'center'
                        },
                        triggerText: {fontSize: 15, color: '#76767B'}
                    }}/>
                <MenuOptions>
                    {
                        this.props.options.map(({key, text}) => {
                            return (<MenuOption key={key} value={key} text={text}/>);
                        })
                    }
                </MenuOptions>
            </Menu>
        )
    }
}