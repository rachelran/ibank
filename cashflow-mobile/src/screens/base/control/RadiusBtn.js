import React, {
   Component,
   PropTypes,
  } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

export default class RadiusBtn extends Component {

  static propTypes = {
    //btnName: PropTypes.string,
    textStyle: Text.propTypes.style,
    btnStyle: TouchableHighlight.propTypes.style,
    underlayColor:TouchableHighlight.propTypes.underlayColor,
  };

  render() {
    return (
      <View style = {{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    }}>
          <TouchableHighlight
              underlayColor={this.props.underlayColor}
              activeOpacity={0.5}
              style={[styles.center, styles.btnDefaultStyle, this.props.btnStyle]}
              onPress={this.props.onPress}>
              <Text style={[styles.textDefaultStyle, this.props.textStyle]}>{this.props.btnName}</Text>
          </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    justifyContent:'center',
    alignItems: 'center',
  },
  btnDefaultStyle: {
    backgroundColor: '#808080',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  textDefaultStyle: {
    fontSize: 16,
    color: '#ffffff',
  },
});