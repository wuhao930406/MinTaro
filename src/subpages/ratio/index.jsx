import React, { Component, useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtNavBar, AtListItem, AtCalendar, AtDrawer, AtList } from 'taro-ui'
import { BarChart } from '../../components/charts'
import './index.less'
import { connect } from 'remax-dva';
import { useRequest } from 'ahooks';
import { ratio } from '../../services/api'
import { Router, useRouter } from 'tarojs-router'
import fullpage from '../../assets/fullpage.png'
import moment from 'moment';

let types = [
  { name: '离线', val: "00", color: '#333333' },
  { name: '运行', val: "10", color: '#60baa0' },
  { name: '待机', val: "20", color: '#ff9e32' },
  { name: '故障', val: "30", color: '#ff4d30' },
];

let Ratio = (props) => {
  const { params } = useRouter();
  let { global } = props;
  let { theme } = global.global;
  const [data, setdata] = useState([]),
    [postdata, setpost] = useState({ id: params.id ? params.id : "2021020525881453168", productDate: moment().format("YYYY-MM-DD") })


  const { run, loading } = useRequest(ratio, {
    manual: true,
    onSuccess: (result, params) => {
      setdata(result);
    },
  });

  useEffect(() => {
    run(postdata)
  }, [postdata])


  const resdata = useMemo(() => {
    const res = data?.data?.dataList ? data?.data?.dataList : [];
    let reslist = res.map((it, i) => {
      let time = it.statusStartTime,
        endtime = it.statusEndTime;
      let typeItem = types.filter((item) => it.status == item.val)[0];


      let baseTime = moment(time).valueOf(),
        endTime = moment(endtime).valueOf(),
        duration = moment(endtime).diff(moment(time), 'milliseconds');

      return {
        name: typeItem.name,
        value: [
          0,
          baseTime,
          endTime,
          duration
        ],
        itemStyle: {
          normal: {
            color: typeItem.color
          }
        }
      }
    })
    return {
      reslist,
      res
    }
  }, [data])

  const [state, setstate] = useState({
    show: false,
    params: {}
  });


  return <View className='column' style={{ height: "100vh", overflow: "hidden" }}>
    <View style={{ height: wx.getSystemInfoSync().statusBarHeight, width: "100%" }}></View>

    <AtDrawer
      show={state.show}
      width="100%"
      style={{ zIndex: 9999 }}
    >
      <View className="column" style={{ height: "100%", position: "relative", overflow: "hidden" }}>
        <View style={{ height: wx.getSystemInfoSync().statusBarHeight + 10, width: "100%" }}></View>
        <AtCalendar currentDate={state?.date} style={{ height: "100%" }} isVertical maxDate={moment().format("YYYY-MM-DD")} onSelectDate={(val) => {
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
            setstate({
              ...state,
              date: state?.value?.start ? state?.value?.start : postdata.productDate,
              show: false
            })
            setpost({
              ...postdata,
              productDate: state?.value?.start ? state?.value?.start : postdata.productDate
            })
          }}>确定</AtButton>
          <View style={{ width: 20, height: 20 }}></View>
        </View>
      </View>
    </AtDrawer>

    <View style={{ transform: "scale(1)", paddingTop: "50PX", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
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
        title='效率分析'
        fixed={true}
        style={{ top: wx.getSystemInfoSync().statusBarHeight }}
        leftIconType="chevron-left"
        border={false}
      />
      <View className="spacebt"
        style={{ padding: 16 }}
        onClick={() => {
          setstate({
            ...state,
            type: "",
            show: true
          })
        }}>
        <Text>
          选择日期
        </Text>
        <Text>
          {
            state.date ? state.date : postdata.productDate
          }
        </Text>
      </View>
      <View className={"spacebt " + theme.bgclass + "light"} style={{ padding: 16, color: "#000" }}>
        <Text>{state.params?.name ? state.params?.name : "状态"}</Text>
        <View>
          <Text>{state.params?.value ? "起:" + moment(state.params?.value[1]).format("HH:mm") : "开始时间"}</Text>
          <Text style={{ margin: "0 6px" }}>{state.params?.value ? "止:" + moment(state.params?.value[2]).format("HH:mm") : "结束时间"}</Text>
          <Text>{state.params?.value ? ("持续:" + moment.duration(state.params?.value[3], 'milliseconds').hours() + "小时" + moment.utc(state.params?.value[3]).minutes() + "分") : "持续"}</Text>
        </View>
      </View>

      <View style={{marginBottom: 0,display:"flex",padding:"0 22px",justifyContent:"flex-end"}}>
        {
          types.map((it) => <View style={{padding:6,textAlign:"center",color:it.color,opacity:0.8,fontSize:14 }}>{it.name}</View>)
        }
      </View>
      {
        !state.show && <BarChart
          data={resdata ? resdata.reslist : []}
          emit={(params) => {
            setstate({
              ...state,
              params: params
            })
          }}
          style={{ width: "100%", height: 200 }} theme={theme}></BarChart>
      }
      <View style={{ padding: 12, borderTop: "#f9f9f9 solid 1px", marginTop: 12 }}>
        <Text style={{ borderLeft: "lightblue solid 2px", paddingLeft: 6 }}>数据明细</Text>
        <Text></Text>
      </View>
      <View style={{ flex: 1, overflow: "auto" }}>
        <AtList>
          {
            resdata.reslist && resdata.reslist.map((it, i) => <AtListItem key={i} hasBorder={false}
              title={it?.name}
              extraText={moment(it?.value[1]).format("HH:mm")}
              note={"持续:" + moment.duration(it?.value[3], 'milliseconds').hours() + "小时" + moment.utc(it?.value[3]).minutes() + "分"}
            />)
          }
        </AtList>

      </View>

    </View>
  </View>
}
export default connect((global) => ({
  global
}))(Ratio)