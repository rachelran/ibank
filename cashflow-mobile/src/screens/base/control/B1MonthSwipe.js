import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    Dimensions
} from 'react-native';
import Utility from '../../utility';
const { width, height } = Dimensions.get("window");

class B1MonthSwipe extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            date: this.props.date || new Date(),
            data: this.props.data || [],
            isChartRefresh: props.isChartRefresh,
            currentSelectIndex: 4
        };
    }

    scrollToIndex = (index) => {
        if (this.swiper) {
            console.log("scrollToIndex ", index);
            this.swiper.scrollToIndex({
                animated: false,
                index: index
            });

            this.setState({
                currentSelectIndex: index
            });
        }
    };

    componentWillReceiveProps = (props) => {
        console.log("B1MonthSwipe componentWillReceiveProps");
        console.log(props);
        console.log(this.state);
        this.setState({
            date: props.date || new Date(),
            data: props.data || [],
            isChartRefresh: props.isChartRefresh
        });

        if (props.isChartRefresh) {
            this.scrollToIndex(4);
        }
    };

    onViewableItemsChanged = ({ viewableItems, changed }) => {
        if (viewableItems && viewableItems.length > 0) {
            var oldIndex = this.state.currentSelectIndex;
            var nexIndex = viewableItems[0].index;
            if (oldIndex != nexIndex) {
                console.log("onViewableItemsChanged nexIndex = ", nexIndex);

                let oNewDate = Utility.changeMonth(nexIndex > oldIndex ? 1 : -1, this.state.date);
                let isRefresh = (nexIndex == 0 || nexIndex == this.state.data.length - 1) ? true :  false;
                this.setState({
                    date: oNewDate,
                    currentSelectIndex: nexIndex
                }, () => {
                    console.log("setState", this.state);  
                    if (this.props.didChange) {
                        this.props.didChange(oNewDate, isRefresh);
                    }  
                });
            }
        }
    };

    renderSwipeItem = ({ item, index }) => {
        return (
            <View style={styles.slide}>
                {this.props.renderItem(item)}
            </View>
        );
    };

    getItemLayout = (data, index) => ({
        length: this.props.containerWidth,
        offset: this.props.containerWidth * index,
        index,
    });

    render() {
        
        //console.log(this.state.data);
        if (this.props.data.length === 0) {
            return (
                <SafeAreaView >
                    <View style={styles.container}>
                    </View>
                </SafeAreaView>)
        } else {
            console.log("render currentSelectIndex",this.state.currentSelectIndex);
            return (
                <SafeAreaView>
                    <View style={styles.container}>
                        <View style={[styles.wrapper, { width: this.props.containerWidth }]}>
                            <FlatList
                              ref={flatList => {
                                 this.swiper = flatList;
                              }}
                              data={this.state.data}
                              scrollEnabled={true}
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              renderItem={this.renderSwipeItem}
                              keyExtractor={(item, index) => index.toString()}
                              getItemLayout={this.getItemLayout}
                              pagingEnabled
                              initialScrollIndex={4}
                              onViewableItemsChanged={this.onViewableItemsChanged}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            );
        }
    }
}

B1MonthSwipe.defaultProps = {
    containerWidth: width
};

export default B1MonthSwipe;

const styles = StyleSheet.create({
    container: {
        height: 320,
        width: '100%'
    },
    wrapper: {
        flex: 1
    },
    slide : {
        justifyContent: "center",
        alignItems: "center"
    }
});