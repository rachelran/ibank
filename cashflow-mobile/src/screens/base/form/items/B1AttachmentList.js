import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import B1Button from '../../control/B1Button';
import Utility from '../../../utility';
import I18n from 'react-native-i18n';
import ImageViewer from 'react-native-image-zoom-viewer';
import B1ImageView from './B1ImageView';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const ATTACHMENT_MAX = 1;

export default class B1AttachmentList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showImage: false,
            showImageIndex: 0
        };
    }

    render() {
        let paths = [];

        if(!!this.props.value){
            this.props.value.forEach(item => {
                paths.push({
                    url: item.file
                });
            });
        }

        this.state = {
            attachmentPaths: paths,
            showImage: this.state.showImage,
            showImageIndex: this.state.showImageIndex
        };

        return ( 
            <View>
                <Text style={styles.title}>{this.props.title}:</Text>
                <FlatList
                  extraData={this.state}
                  data={this.state.attachmentPaths}   numColumns={5}
                  renderItem={({item, index}) => 
                      <TouchableOpacity onPress={() => this._onPressItem(index)}>
                        <Image key={item.url} 
                               source={ {uri: item.url} } 
                               style={ styles.attachment }/>
                      </TouchableOpacity>}
                  keyExtractor = {(item, index) => index.toString()}
                />
                <B1ImageView
                  attachmentPaths={this.state.attachmentPaths}
                  showImageIndex= {this.state.showImageIndex}
                  visible= {this.state.showImage}
                  onPress={() => this._onCancel()}/>
            </View>
        )
    }

    renderSeparator (){
        return (<View style={{width:10}}></View>)
    }

    _onPressItem(index) {
        this.setState({
            showImage: true,
            showImageIndex: index
        });
    }

    _onCancel() {
        this.setState({
            showImage: false
        });
    }
}

const styles = StyleSheet.create({
    title: {
        marginTop: 10,
        color: '#8A8A8A',
        fontSize: 12
    },
    attachment: {
        marginTop: 10,
        marginBottom: 4,
        marginRight: 2,
        width: 60,
        height: 60
    },
    button: {
        marginTop: 10
    }
});