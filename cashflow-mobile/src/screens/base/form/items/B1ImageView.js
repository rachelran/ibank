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

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const ATTACHMENT_MAX = 1;

export default class B1AttachmentList extends Component {
    render() {

        this.state = {
            attachmentPaths: this.props.attachmentPaths,
            showImageIndex: this.props.showImageIndex,
            visible: this.props.visible,
        };

        return (<View>
                {this.state.visible? 
                    (<View style={styles.container}>
                        <Modal
                            animationType={"slide"}
                            transparent={true}
                            visible={true}
                        >
                            <ImageViewer
                                imageUrls={this.state.attachmentPaths}
                                enableImageZoom={true}
                                index={this.state.showImageIndex}
                                enableSwipeDown={false}
                                onChange={(index) => { }}
                                onClick={this.props.onPress}
                            />
                        </Modal>
                    </View>): null} 
                </View>              
        )
    }

}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0, 
        bottom: 0, 
        left: 0, 
        right: 0
    }
});