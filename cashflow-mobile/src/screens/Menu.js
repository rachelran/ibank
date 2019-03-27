import React, { Component } from 'react';
import {
      ScrollView,
          Image,
  AppRegistry,
  StyleSheet,
  Text,
      FlatList,
  View,
  ListView,
  TouchableOpacity,
Alert,
AsyncStorage

} from 'react-native';
import CoverageCell from './CoverageCell';
import VersionCheck from 'react-native-version-check';
import Config from '../manager/Config';
import B1Manager from '../manager/B1Manager';
import I18n from 'react-native-i18n';
import Utility from './utility';
// 数据源
var CoverageArrs =
          [
              {title:'menu.home', action:'b1lite.Home', icon:'home',childs:[]},
              {title:'menu.payments', action:'b1lite.PaymentList', icon:'payments',childs:[]},
              {title:'menu.reports', action:'b1lite.DemoReportList', icon:'reports',childs:[]},
              {title:'menu.account', action:'b1lite.AccountList', icon:'accounts',childs:[]}
          ];
export default class SectionDemo extends Component {
  constructor(props) {
    super(props);

    this.state = {
       dataSource:new ListView.DataSource({rowHasChanged:(r1,r2) => r1!==r2}).cloneWithRows(CoverageArrs),
    };
  }

  detail(action,title,param){
   // alert(action);
  if(action == '') return;


  console.log("SectionDemo ---*",action,title,param)

  this.props.navigator.handleDeepLink({
                  link: action,
                  payload: param,

              });

   // this.props.navigator.push({
   //                  screen: 'b1lite.SingleImagePage',
   //                  title: I18n.t('home.revenue_title'),
   //                  backButtonTitle: '',
   //                  navigatorStyle: Utility.navigatorStyle,
   //                  // navigatorButtons: {
   //                  //     rightButtons: [{
   //                  //         title: 'CLOSE'
   //                  //     }]
   //                  // }
   //                  passProps: {
   //                      id: "12324234",
   //                      type: "你好哇"
   //                  }
   //              });

  this.props.navigator.toggleDrawer({
    side: 'left',
    animated: true
});


  }
  //引用组件把数组传进去
  renderMover(data){
    const {title,childs,action,icon,param} = data;
    return(
        <CoverageCell title={title}
                      action={action}
                      icon={icon}
                      param= {param}
                      cars={childs}
                      detail={this.detail.bind(this)}/>
    );
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.infoContainer}>
          <Image source={require('../../assets/img/photo.png')}/>
        <View>
        <Text style={[styles.infoText, styles.infoName]}>{this.state.name}</Text>
        <Text style={styles.infoText}>EPC Computer</Text>
       </View>
     </View>

        <ListView  style={{flex:1,marginTop:20,backgroundColor:'white'}}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderMover.bind(this)}/>
                    <View style={styles.seperatorLine}/>
            <FlatList
                data={
                    [
                        {
                            icon: require('../../assets/img/settings.png'),
                            text: I18n.t('menu.settings'),
                            screenId: 'b1lite.Setting'
                        },
                        {
                            icon: require('../../assets/img/logout.png'),
                            text: I18n.t('menu.logout'),
                            screenId: 'b1lite.Login'
                        }
                    ]
                }
                keyExtractor={(item, index) => "" + index}
                renderItem={
                    ({item}) =>
                        <TouchableOpacity
                            style={styles.itemContainer}
                            onPress={() => this._onPressItem(item)}>
                            <Image source={item.icon}/>
                            <Text style={styles.itemText}>{item.text}</Text>
                        </TouchableOpacity>
                }/>
            <View style={{marginTop: 20,paddingLeft:20}}>
                <Text style={{color: "#FFF", fontSize: 10}}>{ I18n.t('menu.version') + ' ' + VersionCheck.getCurrentVersion()}</Text>
            </View>

      </ScrollView>
    );
  }


  _onPressItem = (item) => {
      if (item.screenId) {
          if (item.screenId === 'b1lite.Login') {
              //do logout
              B1Manager.logout()
                  .then(() => {
                      this.props.navigator.handleDeepLink({
                          link: item.screenId
                      });
                  })
          } else {
              this.props.navigator.handleDeepLink({
                  link: item.screenId,
                  payload: item
              });
          }
          this.props.navigator.toggleDrawer({
            side: 'left',
            animated: true
        });
      } else {
          Alert.alert(I18n.t('menu.todo'));
      }
  }

}


const styles = StyleSheet.create({

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  container: {
    height: '100%',
    backgroundColor: '#1E508B',

},
infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    paddingLeft:20
},
infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: 'white'
},
infoName: {
    marginBottom: 5
},
itemContainer: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
    paddingLeft:20
},
itemText: {
    color: 'white',
    fontSize: 17,
    marginLeft: 10
},
seperatorLine: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.30)',
    marginRight: 20,
    marginTop: 24,
    marginBottom: 24
}

});

AppRegistry.registerComponent('SectionDemo', () => SectionDemo);
