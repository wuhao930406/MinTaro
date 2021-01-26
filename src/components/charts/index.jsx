import React, { Component, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import Span from '../../components/test'
import './index.less'
import { connect } from 'remax-dva';
import { useRequest } from 'ahooks';
import { fakeAccountLogin } from '../../services/api'
import { useRouter } from 'tarojs-router'
import { EChart } from "echarts-taro3-react";



class BarChart extends Component {

    componentDidMount() {
        this.toRefresh(this.props)
    }

    toRefresh(props) {
        let { data } = props,color = ["#ff9e32","#80c7b2","#60baa0"];
        let { xAxis, yAxis } = data ? data : {yAxis:[0, 1, 2, 0, 1, 2, 1]};

        let colorList = yAxis.map((it)=>{
            return color[it]
        })


        const defautOption = {
            grid: {
                left: '0%',
                right: '6%',
                bottom: '2%',
                top:'4%',
                containLabel: true
            },
            dataZoom:{
                type:"inside"
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: "category",
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
            },
            yAxis: {
                type: "value",
                show:false
            },
            series: [
                {
                    name:"状态",
                    data: [1, 1, 1, 1, 1, 1, 1],
                    type: "bar",
                    // showBackground: true,
                    // backgroundStyle: {
                    //     color: "rgba(220, 220, 220, 0.8)",
                    // },
                    barWidth:"100%",
                    itemStyle: {
                        normal: {
                            color:function(params) {
                                return colorList[params.dataIndex]
                            }
                        }
                    }
                },
            ],
        };
        this.barChart.refresh(defautOption);
    }


    barChart = {};

    refBarChart = (node) => (this.barChart = node);

    render() {
        return (
            <View className='bar-chart'>
                <EChart ref={this.refBarChart} canvasId='bar-canvas' />
            </View>
        );
    }
}

class LineChart extends Component {

    componentDidMount() {
        this.toRefresh(this.props)
    }

    toRefresh(props) {
        let { data } = props;
        let { xAxis, yAxis } = data ? data : {};
        const defautOption = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '2%',
                top:'8%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: "category",
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
            },
            yAxis: {
                type: "value",
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    margin: 20
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                }
            },
            series: [
                {
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: "line",
                    showSymbol: false,
                    itemStyle: {
                        normal: {
                            color:"lightblue"
                        }
                    }
                },
            ],
        };
        this.lineChart.refresh(defautOption);
    }




    lineChart = {};

    refLineChart = (node) => (this.lineChart = node);

    render() {
        return (
            <View className='bar-chart'>
                <EChart ref={this.refLineChart} canvasId='line-canvas' />
            </View>
        );
    }
}


export { BarChart,LineChart }