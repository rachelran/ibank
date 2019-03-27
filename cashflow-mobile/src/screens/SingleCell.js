import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import I18n from 'react-native-i18n';

export default class SingleCell extends Component {
  //初始化数据，添加isShow属性，isShow属性控制展开与关闭
 constructor(props) {
    super(props);
  }

  detail=(action,title,param)=>{

// 子组件给父组件传点击的是哪一个分组
    this.props.detail(action,title,param);
  }
//初始化数据需要一个分组的titil和一个分组下的数组
  static defaultProps = {
    title:'',
    cars:[],
  }


  render() {
    const {name,opt,param} = this.props;
    return (
       <View style={{flex: 1}}>
             <View style={{flex:1,backgroundColor:'#1B417A'}}>
              <TouchableOpacity onPress={()=>{this.detail(opt,name,param)}}
                                style={{
                                     height:40,
                                     flexDirection:'row',
                                     alignItems:'center'}}>
                 <Text style={{color:'white',paddingLeft:30}}>{I18n.t(name)}</Text>
              </TouchableOpacity>
             </View>
       </View>
    );
  }
}

const styles = StyleSheet.create({
    headerLine:{
    height:50,
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor:'red',
  },
  headerRows:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  showitemContain:{
    borderWidth:1,
    borderColor:'red',
    height:110,
    justifyContent:'center',
    alignItems:'center',
  }
});
