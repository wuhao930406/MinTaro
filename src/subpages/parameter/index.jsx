import React, { Component, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtList, AtNavBar, AtIcon, AtButton, AtListItem } from 'taro-ui'
import { BarChart, LineChart } from '../../components/charts'
import './index.less'
import { connect } from 'remax-dva';
import { useRequest } from 'ahooks';
import { deviceparams } from '../../services/api'
import { Router, useRouter } from 'tarojs-router'
import sort from '../../assets/sort.png'
import { isEmpty } from 'lodash'



const now = new Date(),
  year = now.getFullYear(),
  month = now.getMonth() + 1,
  date = now.getDate()

let Parameter = (props) => {
  let { global } = props;
  let { theme } = global.global;

  const { params } = useRouter();
  const [state, setstate] = useState({
    type: "name",
    params: {}
  });

  const { data, loading } = useRequest(() => {
    return deviceparams({ id: params.id })
  });

  let res = data?.data?.dataList


  return <View className='column' style={{ height: "100%", paddingTop: wx.getSystemInfoSync().statusBarHeight }}>
    <View style={{ transform: "scale(1)", paddingTop: "50PX" }}>
      <AtNavBar
        onClickLeftIcon={() => {
          Router.back();
        }}
        color='#000'
        title='全部参数'
        fixed={true}
        style={{ top: wx.getSystemInfoSync().statusBarHeight }}
        leftIconType="chevron-left"
        border={false}
      />
      <View className="spacebt" style={{
        padding: "12PX 24rpx",
        backgroundColor: "#f9f9f9",
        fontSize: 14,
        justifyContent: theme.type == "theme2" ? "flex-start" : "flex-end",
      }}>
        {
          theme.type == "theme1" && <View style={{ flex: 1, fontSize: 16 }}>
            参数名
          </View>
        }

        <View onClick={() => {
          setstate({
            ...state,
            type: "name"
          })
        }}
          className={state.type == "name" ? theme.bgclass + "lights center" : "lightgrey center"}
          style={{ padding: "16rpx 24rpx", color: state.type == "name" ? theme.primaryColor : "#333" }}>
          <Image src={sort} style={{ width: 16, height: 16, opacity: 0.4 }}></Image> 按名称
          </View>
        <View onClick={() => {
          setstate({
            ...state,
            type: "time"
          })
        }}
          className={state.type == "time" ? theme.bgclass + "lights center" : "lightgrey center"}
          style={{ marginLeft: 12, padding: "16rpx 24rpx", color: state.type == "time" ? theme.primaryColor : "#333" }}>
          <Image src={sort} style={{ width: 16, height: 16, opacity: 0.4 }}></Image> 按时间
          </View>
      </View>

      <AtList>
        {
          res && res.map((it, i) => <AtListItem key={i} hasBorder={false}
            title={it?.collectParam}
            note={it?.status?.time}
            extraText={it?.status?.statusName}
          />)
        }
      </AtList>
      {
       ( res&&res.length==0 )&& <View className={"center "+theme.bgclass+"lights"} style={{width:"100%",height:"25vh"}}>
          <Text className={theme.textclass}> 暂无数据 </Text>
        </View>
      }
    </View>


  </View>
}
export default connect((global) => ({
  global
}))(Parameter)