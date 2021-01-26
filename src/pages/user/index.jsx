import React, { Component, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { BarChart, LineChart } from '../../components/charts'
import './index.less'
import { connect } from 'remax-dva';
import { useRequest } from 'ahooks';
import { fakeAccountLogin } from '../../services/api'
import { useRouter } from 'tarojs-router'
import { EChart } from "echarts-taro3-react";

// const { params, data } = useRouter()
// console.log( params, data )




export default () => {
  return <View>

    <BarChart />
    <LineChart />
  </View>
}