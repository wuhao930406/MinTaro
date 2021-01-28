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






export default () => {
  const { params, data } = useRouter()
  console.log(params, data)
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: params.name })
  }, [])


  return <View>
    <View className="bgimg" style={{width:"100%",height:"22vh",backgroundImage:"url(https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg1.bmlink.com%2Fbig%2Fsupply%2F2015%2F11%2F4%2F22%2F654367159425452.jpg&refer=http%3A%2F%2Fimg1.bmlink.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614414613&t=9f73ed66afcd2739e60818a9e2f92417)"}}>

    </View>
    <BarChart />
    <LineChart />
  </View>
}