import React, {
    Component,
    svg
} from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    SectionList
} from 'react-native';
import {
    VictoryChart,
    VictoryAxis,
    VictoryBar,
    VictoryLegend
} from 'victory-native';
 
import Utility from '../utility';
import I18n from 'react-native-i18n';
import B1DecimalLabel from '../base/form/items/B1DecimalLabel';
import AnalyticManager from '../../manager/AnalyticManager';
 
const LEGEND_STYLE = ["#4593D6", "#46AA79", "#E8743B", "#ED4A7B", "#945ECF", "#48A5B4"];
 
export default class RevenueTrend extends Component {
    constructor(props) {
        super(props);
        let navigator = this.props.navigator;
 
        navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
        navigator.setStyle(Utility.navigatorStyle);
        navigator.setTitle({
            title: '产品毛利'
        });
    }
 
    componentDidMount() {
        this.__loadData();
        // this.__loadPrevMonthData();
    }
 
    componentWillUnmount() {
        //todo
    }
 
    render() {
        if (this.state === null) {
            return <View style={styles.conatiner}>
                </View>
        }
 
        return (
            <ScrollView>
                <VictoryChart   width={330} height={240} margin={{ left: 60, top: 30, bottom: 30 }} >
                    <VictoryAxis dependentAxis
                        style={{
                            grid: { stroke: "#DDDDDD" }
                        }}
                        tickValues={this.__prettyYaxis(this.state.tickValues)}
                    />
                    < VictoryBar
                        alignment="start"
                        data={this.state.revenueDetailsByCategory}
                        barWidth={
                            50
                        }
                    />
                </VictoryChart>
                <VictoryLegend height={50}
                    orientation="horizontal"
                    data={this.state.category}
                    itemsPerRow={3}
                    gutter={70}
                    rowGutter={10}
                    symbolSpacer={1}
                    x={30}
                    y={10}
                />
 
                {this.__summary()}
               
                <SectionList
                    style={formStyles.container}
                    renderItem={({ item }) => this.__renderSectionItem(item)}
                    renderSectionHeader={({ section: { title } }) => (
                        <View>
                            <View style = { styles.seperatorLine }/>
                            <Text style={{ color: '#393939', fontWeight: 'bold', fontSize: 16, marginLeft: 25 }}>{title}</Text>
                        </View>
                    )}
                    sections={this.__assembleSections()}
                    keyExtractor={(item, index) => item + index}
                />               
            </ScrollView>
        )
    }
 
    __summary(){
        sectionList = this.__assembleSummarySections();
        let max,min,avg,sum;
        sectionList.some((item,index) => {
            let data ={};
            data.label = item.title;
            data.value = item.data[0].kpiValue;
            switch (item.type) {
                case "MAX":                   
                    max = <B1DecimalLabel data={data}/>
                    break;
                case "MIN":
                    min = <B1DecimalLabel data={data}/>
                    break;
                case "AVG":
                    avg  = <B1DecimalLabel data={data}/>
                    break;
                case "SUM":
                    sum = <B1DecimalLabel data={data}/>
                    break;
            }   
        });
 
        return (   
            <View>
                <Text style={{ color: '#393939', fontWeight: 'bold', fontSize: 16, marginLeft: 25, marginTop: 25, marginBottom: 25}}>产品品类毛利摘要</Text>   
                <View style={styles.bodyContainer}>   
                    {max}
                    {min}
                </View>
 
                <View style={styles.bodyContainer}>   
                    {sum}
                    {avg}
                </View>
            </View>
        )
    }
    __renderSectionItem(item) {
        if(item.type === "RATIO"){
            return (   
                <View style={styles.sectionContainer}>   
                    <Text style={styles.desciption}>{item.desc1}
                        <Text style={styles.desciption}>{item.categoryName+item.desc2+item.month+item.desc3}
                            <Text style={styles.kpiValue}>{item.kpiValue}</Text>
                        </Text>
                    </Text>               
                </View>
            );
        }else if (item.type === "OUTLIER"){
            return (                   
                <View style={styles.sectionContainer}>                     
                    <Text style={styles.desciption}>{item.categoryName+item.desc1+item.month+item.desc2}
                        <Text style={styles.kpiValue}>{item.kpiValue}</Text>
                    </Text>  
                </View>
            );
        }else{
            return null;
        }
    }
 
    _onNavigatorEvent(event) {
        Utility.handleNavigatorEvent(this.props.navigator, event);
    }

    __loadPrevMonthData(prevYear, prevMonth){
        let stateData = this.state;
        //todo data will be assembled here according to UI models
        AnalyticManager.getGpPerCategory(prevYear,prevMonth).then(response => {
            let prevMonthData = [];               
            if (!!response && response.length > 0
                && !!response[0].gpPerGategoryList && response[0].gpPerGategoryList.length > 0) {
                response[0].gpPerGategoryList.some((rspItem,rspIndex) => {
                    stateData.category.some((item,index) => {
                        if(item.name === rspItem.category){
                            prevMonthData.push(
                                {
                                    name: rspItem.category,
                                    value: Math.abs(rspItem.value)
                                }
                            );
                        }
                    })                   
                });
            }           
            this.setState({               
                prevMonthData
            });           
        }).catch(err => {
            console.log(err);
        });
    }
 
    __loadData() {
        //let toIndex = this.props.params.length - 1;     
        let year =  this.props.params.substring(0,4);
        let month = parseInt(this.props.params.substring(5));
        let prevMonth = month - 1;
        let prevYear = year;
        if(prevMonth === 0) {
            prevMonth = 12;
            prevYear = year - 1;
        }
        let that = this;

        AnalyticManager.getGpPerCategory(year, month)
            .then(function(response){
                let category = [],
                    profit = [],
                    revenueDetailsByCategory = [],
                    tickValues = [];
            
                if (!!response && response.length > 0
                    && !!response[0].gpPerGategoryList && response[0].gpPerGategoryList.length > 0) {
                    response[0].gpPerGategoryList.some((item,index) => {
                        revenueDetailsByCategory.push({
                            y: Math.abs(item.value),
                            fill: LEGEND_STYLE[index]
                        });
                        profit.push(Math.abs(item.value)),
                        tickValues.push(Math.round(item.value));                   
                        //Using for legend
                        category.push(
                            {
                                name: item.category,
                                value: parseInt(item.value), //Only take Int
                                symbol: {
                                    fill: LEGEND_STYLE[index],
                                    type: "square",
                                    size: 5
                                }}
                        );
                        return index === 5;
                    });
                }           
                that.setState({               
                    tickValues,
                    revenueDetailsByCategory,
                    category,
                    profit
                });    
                that.__loadPrevMonthData(prevYear,prevMonth);
            })
        .catch(function(err){
            console.log(err);
        });
    }
 
    __prettyYaxis(tickValues){
        let result = [],
        ZERO = 0,
        maxValue,
        minValue,
        funAvarage,
        avarageValue,
        secondAvgValue;
 
        minValue = Math.min(...tickValues);
        maxValue = Math.max(...tickValues);
        funAvarage = array => array.reduce((a,b) => a + b, 0) / array.length;
        avarageValue = Math.round(this.__getAvgValueByArray(tickValues));
        result.push(ZERO);
        result.push(minValue);
        result.push(avarageValue);
        result.push(maxValue);
        secondAvgValue = (avarageValue + maxValue) / 2 ;
        result.push(Math.round(secondAvgValue));
        return result;
    }

    __getAvgValueByArray(array){
        if(!!array && array.length >0){
            return array.reduce((a,b) => a + b, 0) / array.length;
        }else{
            return 0;
        }   
    }
    __assembleSummarySections() {
        let sectionList =[];
 
        let rawData = this.state.profit;
       
        let sectionDef01 = {
            title: "最高",
            type: "MAX",
            data: [
                {
                    desc: "",
                    kpiValue: Math.max(...rawData).toLocaleString("en", {maximumFractionDigits : 2})
                }
            ]
        }
 
        let sectionDef02 = {
            title: "最低",
            type: "MIN",
            data: [
                {
                    desc: "",
                    kpiValue: Math.min(...rawData).toLocaleString("en", {maximumFractionDigits : 2})
                }
            ]
        }
 
        let sectionDef03 = {
            title: "平均",
            type: "AVG",
            data: [
                {
                    desc: "",
                    kpiValue: this.__getAvgValueByArray(rawData).toLocaleString("en", {maximumFractionDigits : 2})
                }
            ]
        }
       
        funSum = array => array.reduce((a,b) => a + b, 0);
       
        let sectionDef04 = {
            title: "总额",
            type: "SUM",
            data: [
                {
                    desc: "",
                    kpiValue: this.__getGrossProfit().toLocaleString("en", {maximumFractionDigits : 2})
                }
            ]
        }
        sectionList.push(sectionDef01)
        sectionList.push(sectionDef02)
        sectionList.push(sectionDef03)
        sectionList.push(sectionDef04);
       
        return sectionList;
    }
 
    __getGrossProfit(){       
        funSum = array => array.reduce((a,b) => a + b, 0);
        return funSum(this.state.profit);
    }
 
    __getOutliers(outStandingValue){
        let gpSum = this.__getGrossProfit();
        let outliers = outStandingValue / gpSum;
        return outliers.toLocaleString('en', {style: 'percent', maximumSignificantDigits: 4});
 
    }
    __assembleSections() {
        let toIndex = this.props.params.length - 1;       
        let month = parseInt(this.props.params.substring(5));
 
        let outStandingCategory = this.__getOutstandingCategory();
        let firstSection = [];
        let sectionDef01 = {
            title: "离群值",
            data: [
                {
                    type: 'OUTLIER',
                    desc1: "品类贡献了",
                    desc2: "月份毛利总额的",
                    categoryName: outStandingCategory.categoryName,
                    month: month,
                    kpiValue: this.__getOutliers(outStandingCategory.max)
                }
            ]
        }
        let maxRatio = this.__getMaxRatioIncreaseKPI();
        let sectionDef02 = {
            title: "最高同比增长率",
            data: [
                {
                    type: 'RATIO',
                    desc1: "同上个月相比较，",
                    desc2: "品类的毛利在",
                    desc3: "月份的增长率是所有品类中最高的，达到",
                    categoryName: maxRatio.name,
                    month: month,
                    kpiValue: maxRatio.value.toLocaleString('en', {style: 'percent', maximumSignificantDigits: 4})
                }
            ]
        }
        firstSection.push(sectionDef01);
        firstSection.push(sectionDef02);
        return firstSection;
    }
   
    __getMaxRatioIncreaseKPI(){
        let prevData = this.state.prevMonthData;
        let data = this.state.category;
        let ratio = [];
        if(!!prevData && !!data){
            data.some((item, index) => {
                prevData.some((prevData, prevIndex) => {
                    let ratioData = {};
                    if(item.name === prevData.name && item.value > prevData.value){
                        ratioData.value = (item.value - prevData.value) / prevData.value;
                        ratioData.name = item.name;
                        ratio.push(ratioData);                       
                    }
                })
            });
        }
        let maxRatio = {
            name: "Sth is wrong",
            value: 0
        };
       
        ratio.some((item,index) => {
            if(item.value >= maxRatio.value){
                maxRatio.value = item.value;
                maxRatio.name = item.name;
            }
        });
 
        return maxRatio ;         
    }
 
    __getOutstandingCategory() {
        let result = {
            categoryName: null,
            max: 0
        };
        categories = this.state.category;
        for (let i = 0; i < categories.length; i++) {
            if(categories[i].value > result.max){
                result.max = categories[i].value;
                result.categoryName = categories[i].name              
            }
        }
        return result;
    }
}
 
//Predefined style sheet
const styles = StyleSheet.create({
    seperatorLine: {
        marginTop: 10,
        marginBottom: 25,
        height: 1,
        backgroundColor: '#B9B9B9'
    },
    bodyContainer:{
        // paddingTop: 14,
        paddingLeft: 25,
        paddingBottom: 14,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    desciption: {
        marginTop:10,
        marginBottom:10,
        fontSize: 16,       
        color: '#B1B1B1'
    },
    kpiValue: {
        margin:10,
        fontSize: 16,
        color: '#297FCA'
    },
    sectionContainer: {
        flexDirection: 'row',
        marginLeft: 25
    },
    conatiner: {
        height: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#1E508B'
    }
});

const formStyles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: 'white'
    }
});
 