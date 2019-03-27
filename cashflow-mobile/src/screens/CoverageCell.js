import {white} from 'color-name';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import I18n from 'react-native-i18n';
import SingleCell from './SingleCell';
import Utility from './utility';

export default class CoverageCell extends Component {
  //初始化数据，添加isShow属性，isShow属性控制展开与关闭
 constructor(props) {
    super(props);

    this.state = {
      isShow:false,
    };
  }

  detail=(action,title,param)=>{
    // console.log(action,title,param)
// 改变状态，刷新组件
    this.setState({
      isShow: !Utility.isNullOrEmpty(action)? this.state.isShow : !this.state.isShow
    });
// 子组件给父组件传点击的是哪一个分组
    this.props.detail(action,title,param);

  }


//初始化数据需要一个分组的titil和一个分组下的数组
  static defaultProps = {
    title:'',
    cars:[],
  }
//利用push输出分组下的cell
  isShowText(){
   const {title,cars,action} = this.props;
   var allChild = [];
   for (var i = 0; i < cars.length; i++) {
     allChild.push(
       <SingleCell   name={cars[i].name}
                     opt={cars[i].action}
                     param={cars[i].param}
                     detail={this.detail.bind(this)}/>
      )
    }
    return allChild;
  }

  render() {
    const {title,cars,icon,action,param} = this.props;
    // var path = icon;
    // var image = require(icon);
    return (
       <View  style= {{flex:1,backgroundColor:this.state.isShow ? '#1B417A':'#1E508B'}}>
             <View style={{flex:1,paddingLeft:20}}>
              <TouchableOpacity onPress={()=>{this.detail(action,title,param)}}
                  style={styles.itemContainer}
                                >

                 {this.createImageCell(icon)}
                 <Text style={styles.itemText}>{I18n.t(title)}</Text>
              </TouchableOpacity>
              {this.state.isShow?<View>{this.isShowText()}</View>:<View></View>}
             </View>

       </View>
    );
  }

  createImageCell(icon){

        switch (icon) {
          case 'home':
              return <Image source = {require('../../assets/img/home.png')}></Image>;
            break;
          case 'bps':
             return <Image source = {require('../../assets/img/business_partners.png')}></Image>;
              break;
          case 'payments':
             return <Image source = {require('../../assets/img/payments.png')}></Image>;
              break;
          case 'products':
             return <Image source = {require('../../assets/img/general_ledgers.png')}></Image>;
            break;
          case 'reports':
             return <Image source = {require('../../assets/img/reports.png')}></Image>;
           break;
           case 'accounts':
             return <Image source = {require('../../assets/img/accounts.png')}></Image>;
           break;

          default:
           return <View></View>;
        }
  }
}

const styles = StyleSheet.create({
  coverageCellStyleShow:{
    flex: 1,
    backgroundColor:'#1B417A'
  },
  coverageCellStyle:{
    flex: 1,
  },
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
  },

  itemContainer: {
      flexDirection: 'row',
      paddingTop: 8,
      paddingBottom: 8,
      alignItems: 'center'
  },
  itemText: {
      color: 'white',
      fontSize: 17,
      paddingLeft: 10
  },
});
