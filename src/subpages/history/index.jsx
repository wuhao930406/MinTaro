import React, { Component, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtList, AtNavBar, AtIcon, AtButton, AtListItem, AtDrawer, AtCalendar } from 'taro-ui'
import { BarChart, LineChart } from '../../components/charts'
import './index.less'
import { connect } from 'remax-dva';
import { useRequest } from 'ahooks';
import { history } from '../../services/api'
import { Router, useRouter } from 'tarojs-router'
import sort from '../../assets/sort.png'
import moment from 'moment'




let History = (props) => {
  let { global } = props;
  let { theme } = global.global;

  const { params } = useRouter();
  const [state, setstate] = useState({
    show: false,
    type: "name",
    params: {
      id: params.id,
      startDate: moment().format("YYYY-MM-DD") ,
      endDate: moment().format("YYYY-MM-DD") 
    }
  }), [data, setdata] = useState([]);


  const { run, loading } = useRequest(history, {
    manual: true,
    onSuccess: (result, params) => {
      setdata(result.data.dataList);
    },
  });

  useEffect(() => {
    run(state.params)
  }, [state.params])



  return <View className='column' style={{ height: "100vh", overflow: "hidden" }}>
    <AtDrawer
      show={state.show}
      width="100%"
      style={{ zIndex: 9999 }}
    >
      <View className="column" style={{ height: "100%", position: "relative", overflow: "hidden" }}>
        <View style={{ height: wx.getSystemInfoSync().statusBarHeight + 10, width: "100%" }}></View>
        <AtCalendar  currentDate={[state?.params?.startDate, state?.params?.endDate]} style={{ height: "100%" }} isMultiSelect isVertical maxDate={moment().format("YYYY-MM-DD")} onSelectDate={(val) => {
          setstate({
            ...state,
            ...val
          })
        }} />
        <View className='spacebt' style={{ overflow: 'hidden', position: "absolute", bottom: 24, width: "100%" }}>
          <View style={{ width: 20, height: 20 }}></View>
          <AtButton className="cancle" style={{ flex: 1 }} full onClick={() => {
            setstate({
              ...state,
              show: false
            })
          }}>取消</AtButton>
          <AtButton style={{ flex: 1 }} type="primary" full onClick={() => {
             if (!state?.value?.start || !state?.value?.end) {
              Taro.showToast({
                title: '请选择开始/结束日期',
                icon: 'none',
              })
              return
            }
            setstate({
              ...state,
              params:{
                ...state.params,
                startDate:state?.value?.start,
                endDate: state?.value?.end,
              },
              show: false
            })
          }}>确定</AtButton>
          <View style={{ width: 20, height: 20 }}></View>
        </View>
      </View>
    </AtDrawer>
    <View style={{ height: wx.getSystemInfoSync().statusBarHeight, width: "100%" }}></View>
    <View style={{ transform: "scale(1)", paddingTop: "50PX", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <AtNavBar
        onClickLeftIcon={() => {
          Router.back();
        }}
        color='#000'
        title='历史故障'
        fixed={true}
        style={{ top: wx.getSystemInfoSync().statusBarHeight }}
        leftIconType="chevron-left"
        border={false}
      />


      <View className="spacebt" style={{
        padding: "12PX 24rpx",
        backgroundColor: "#f9f9f9",
        fontSize: 14,
      }}>
        <Text onClick={() => {
          setstate({
            ...state,
            type: "",
            show: true
          })
        }}>
          {
            state.params.startDate ? state.params.startDate : "开始日期"
          }
          <Text style={{ margin: "0 6px" }}>至</Text>
          {
            state.params.endDate ? state.params.endDate : "结束日期"
          }
        </Text>

        {/* <View className='spacebt' style={{justifyContent:"flex-end"}}>
          <View onClick={() => {
            setstate({
              ...state,
              type: "name"
            })
          }}
            className={state.type == "name" ? theme.bgclass + "lights center" : "lightgrey center"}
            style={{ padding: "16rpx 12rpx", color: state.type == "name" ? theme.primaryColor : "#333" }}>
            <Image src={sort} style={{ width: 16, height: 16, opacity: 0.4 }}></Image> 按名称
          </View>
          <View onClick={() => {
            setstate({
              ...state,
              type: "time"
            })
          }}
            className={state.type == "time" ? theme.bgclass + "lights center" : "lightgrey center"}
            style={{ marginLeft: 12, padding: "16rpx 12rpx", color: state.type == "time" ? theme.primaryColor : "#333" }}>
            <Image src={sort} style={{ width: 16, height: 16, opacity: 0.4 }}></Image> 按时间
          </View>
        </View> */}
      </View>

      <View style={{ flex: 1, overflow: "auto" }}>
        <AtList>
          {
            data && data.map((it, i) => <AtListItem key={i} hasBorder={false}
              title={it?.faultName}
              note={it?.faultCreateTime}
              extraText={it?.faultRunTime}
            />)
          }
        </AtList>
        {
          (data && data.length == 0) && <View className={"center " + theme.bgclass + "lights"} style={{ width: "100%", height: "25vh" }}>
            <Text className={theme.textclass}> 暂无数据 </Text>
          </View>
        }
      </View>
    </View>

  </View>
}
export default connect((global) => ({
  global
}))(History)