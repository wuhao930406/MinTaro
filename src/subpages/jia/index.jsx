import React, { Component, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtNavBar, AtIcon, AtCalendar, AtDrawer } from 'taro-ui'
import { BarChart, LineChart } from '../../components/charts'
import './index.less'
import { connect } from 'remax-dva';
import { useRequest } from 'ahooks';
import { jia } from '../../services/api'
import { Router, useRouter } from 'tarojs-router'
import fullpage from '../../assets/fullpage.png'
import moment from 'moment';



const now = new Date(),
  year = now.getFullYear(),
  month = now.getMonth() + 1,
  date = now.getDate()

let Jia = (props) => {
  const { params } = useRouter();
  let { global } = props;
  let { theme } = global.global;
  let [data, setdata] = useState([]);
  const [state, setstate] = useState({
    show: false,
    params: {
      id: params.id,
      startDate: moment().add("day",-6).format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD") 
    },
    tooltip:{}
  });

  
  const { run, loading } = useRequest(jia, {
    manual: true,
    onSuccess: (result, params) => {
      setdata(result.data.dataList);
    },
  });

  useEffect(() => {
    run(state.params)
  }, [state.params]);





  return <View className='column' style={{ height: "100%", paddingTop: wx.getSystemInfoSync().statusBarHeight }}>

    <AtDrawer
      show={state.show}
      width="100%"
      style={{ zIndex: 9999 }}
    >
      {
        state.type == "full" ?
          <View className="center"
            style={{ width: wx.getSystemInfoSync().windowWidth, height: wx.getSystemInfoSync().windowHeight, overflow: "hidden" }}>

            <LineChart 
              theme={theme}
              data={{
                yAxis:data?data.map(it=>it.value):[],
                xAxis:data?data.map(it=>it.date):[],
              }}
              emit={(tooltip) => {
                setstate({
                  ...state,
                  tooltip: tooltip[0]
                })
              }} 
              reverse={true} 
              style={{
                width: wx.getSystemInfoSync().windowWidth - 70,
                height: wx.getSystemInfoSync().windowHeight - 6,
                marginLeft: 6,
                marginTop: 6
              }}>
            </LineChart>
            <View className="center" style={{ padding: 12, width: 32, backgroundColor: "#f9f9f9", height: "100%", flexDirection: "column" }}>
              <View style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ transform: "rotate(90deg)", marginBottom: "30vh",width:200 }}>{state.tooltip?.name ? state.tooltip?.name : "时间"}</Text>
                <Text style={{ transform: "rotate(90deg)" }}>{state.tooltip?.value ? state.tooltip?.value+"%" : "占比"}</Text>
              </View>
              <View style={{ paddingBottom: 24 }}>
                <AtIcon value="close" size={18} onClick={() => {
                  setstate({
                    ...state,
                    show: false
                  })
                }}></AtIcon>
              </View>
            </View>
          </View>
          :
          <View className="column" style={{ height: "100%", position: "relative", overflow: "hidden" }}>
            <View style={{ height: wx.getSystemInfoSync().statusBarHeight + 10, width: "100%" }}></View>
            <AtCalendar currentDate={[state?.start, state?.end]} style={{ height: "100%" }} isMultiSelect isVertical maxDate={`${year}/${month}/${date}`} onSelectDate={(val) => {
              console.log(val)
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

      }

    </AtDrawer>

    <View style={{ transform: "scale(1)", paddingTop: "50PX" }}>
      <AtNavBar
        onClickLeftIcon={() => {
          if (state.show) {
            setstate({
              ...state,
              show: false
            })
          } else {
            Router.back();
          }
        }}
        color='#000'
        title='稼动率'
        fixed={true}
        style={{ top: wx.getSystemInfoSync().statusBarHeight }}
        leftIconType="chevron-left"
        border={false}
      />
      <View className="spacebt" style={{ padding: 16 }}>
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
        <Image src={fullpage} style={{ width: 16, height: 16 }} onClick={() => {
          setstate({
            ...state,
            type: "full",
            show: true
          })
        }}></Image>
      </View>
      <View className={"spacebt " + theme.bgclass + "light"} style={{ padding: 16, marginBottom: 12, color: "#000" }}>
        <Text>{state.tooltip?.name ? state.tooltip?.name : "时间"}</Text>
        <Text>{state.tooltip?.value ? state.tooltip?.value+"%" : "占比"}</Text>
      </View>
      {
        state.show ? null : <LineChart 
        data={{
          yAxis:data?data.map(it=>it.value):[],
          xAxis:data?data.map(it=>it.date):[],
        }}
        emit={(tooltip) => {
          setstate({
            ...state,
            tooltip: tooltip[0]
          })
        }} style={{ width: "100%", height: 200 }} theme={theme}></LineChart>
      }

    </View>


  </View>
}
export default connect((global) => ({
  global
}))(Jia)