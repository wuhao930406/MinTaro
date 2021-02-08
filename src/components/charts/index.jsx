import React, { Component, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import Span from '../../components/test'
import './index.less'
import moment from 'moment';
import { useRequest } from 'ahooks';
import { fakeAccountLogin } from '../../services/api'
import { useRouter } from 'tarojs-router'
import { EChart } from "echarts-taro3-react";
import echarts from 'echarts-taro3-react/lib/ec-canvas/echarts';



function renderItem(params, api) {
    var categoryIndex = api.value(0);
    var start = api.coord([api.value(1), categoryIndex]);
    var end = api.coord([api.value(2), categoryIndex]);
    var height = api.size([0, 1])[1];

    var rectShape = echarts.graphic.clipRectByRect({
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height
    }, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
    });

    return rectShape && {
        type: 'rect',
        shape: rectShape,
        style: api.style()
    };
}
class BarChart extends Component {
    componentDidMount() {
        this.toRefresh(this.props)
    }

    toRefresh(props) {
        const { data, reverse } = props;

        let xAxisoption = {
            min: data[0]?.value[1],
            max: data[data.length - 1]?.value[2],
            scale: true,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                formatter: (val) => {
                    return moment(val).format("HH:mm")
                }
            }

        }, yAxisoption = {
            data: [],
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            }
        }
        const defautOption = {
            grid: {
                left: '6%',
                right: '6%',
                bottom: '2%',
                top: '2%',
                containLabel: true
            },
            tooltip: {
                position: { top: -100, left: -100 },
                formatter: function (params) {
                    props.emit(params.data)
                    return params.name + ': ' + moment.duration(params?.value[3], 'milliseconds').hours() + "小时" + moment.utc(params?.value[3]).minutes() + "分";
                }
            },
            dataZoom: [{
                type: 'inside',
                filterMode: 'weakFilter'
            }],
            xAxis: reverse ? yAxisoption : xAxisoption,
            yAxis: reverse ? xAxisoption : yAxisoption,
            series: [{
                type: 'custom',
                renderItem: renderItem,
                itemStyle: {
                    opacity: 0.8
                },
                encode: {
                    x: [1, 2],
                    y: 0
                },
                data: data
            }]
        };
        this.barChart.refresh(defautOption);
    }


    componentWillReceiveProps(np) {
        if (this.props.data != np.data) {
            this.toRefresh(np)
        }
    }


    barChart = {};

    refBarChart = (node) => (this.barChart = node);

    render() {
        return (
            <View className='bar-chart' style={this.props.style}>
                <EChart ref={this.refBarChart} canvasId='bar-canvas' />
            </View>
        );
    }
}

class LineChart extends Component {

    componentDidMount() {
        setTimeout(() => {
            this.toRefresh(this.props)
        }, 1000)
    }

    toRefresh(props) {
        let { data, reverse, theme } = props;
        let { xAxis, yAxis } = data ? data : { xAxis: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], yAxis: [120, 200, 150, 80, 70, 110, 130] };
        let ro = reverse ? 90 : 0;
        let xAxisoption = {
            type: "category",
            inverse: reverse,
            data: xAxis,
            axisLabel: {
                rotate: -1 * ro
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        }, yAxisoption = {
            position: 'top', //x 轴的位置【top bottom】
            nameRotate: -1 * ro,
            axisLabel: {
                margin: 20,
                rotate: ro,
                formatter: (val) => {
                    return val+"%"
                }
            },
            type: "value",
            scale: true,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        }
        console.log(data)

        const defautOption = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '2%',
                top: '8%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                position: { top: -100, left: -100 },
                formatter: (params) => {
                    this.props.emit(params)
                    return ''
                }
            },
            xAxis: reverse ? yAxisoption : xAxisoption,
            yAxis: reverse ? xAxisoption : yAxisoption,
            series: [
                {
                    data: yAxis,
                    type: "line",
                    showSymbol: false,
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: theme.primaryColor
                        }
                    }
                },
            ],
        };
        this.lineChart.refresh(defautOption);
    }

    componentWillReceiveProps(np) {
        if (this.props.style != np.style) {

        }
    }



    lineChart = {};

    refLineChart = (node) => (this.lineChart = node);

    render() {
        return (
            <View className='bar-chart' style={this.props.style}>
                <EChart ref={this.refLineChart} canvasId='line-canvas' />
            </View>
        );
    }
}

export { BarChart, LineChart }