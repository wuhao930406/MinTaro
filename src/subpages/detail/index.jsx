import React, { Component, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtNavBar, AtDivider, AtIcon } from 'taro-ui'
import { BarChart, LineChart } from '../../components/charts'
import './index.less'
import { connect } from 'remax-dva';
import { useRequest } from 'ahooks';
import { devicedetail } from '../../services/api'
import { Router, useRouter } from 'tarojs-router'
import chart from '../../assets/chart.png'
import fault from '../../assets/fault.png'
import line from '../../assets/line.png'
import cpu from '../../assets/cpu.png'


let Detail = (props) => {
  let { global } = props;
  let { theme } = global.global;

  const { params } = useRouter();

  const { data, loading } = useRequest(() => {
    return devicedetail({ id: params.id })
  });

  let res = data?.data?.data
  console.log(res)

  useEffect(() => {
    //Taro.setNavigationBarTitle({ title: params.name })


  }, [])


  return <View className='column' style={{ minHeight: "100vh", backgroundColor: "#f0f0f0", }}>
    <View style={{ height: wx.getSystemInfoSync().statusBarHeight, width: "100%", backgroundColor: "#fff" }}></View>
    <View style={{ transform: "scale(1)", paddingTop: "44PX" }}>
      <AtNavBar
        onClickLeftIcon={() => {
          Router.back();
        }}
        color='#000'
        title={params.name}
        fixed={true}
        leftIconType="chevron-left"
        border={false}
      />
    </View>

    {
      res?.pictureUrl ?
        <View className="bgimg" style={{ width: "100%", height: "28vh", backgroundImage: "url(https://www.nangaoyun.com/eiu" + res?.pictureUrl + ")" }}>
        </View> :
        <View className={"bgimg center " + theme.bgclass + "light"} style={{ width: "100%", height: "28vh" }} >
          <AtIcon value='image' className={theme.textclass} size='64'></AtIcon>
        </View>

    }

    <View className="status">
      <View className={"statusbar " + theme.bgclass} onClick={() => {
        Router.navigate({
          url: '/subpages/parameter/index',
        },
          {
            params: { id: params.id }
          })

      }}>
        <View className="spacebt">
          <View className='sptxt column' style={{ flex: 1 }}>
            <Text>
              {res?.collectStatusName}
            </Text>
            <Text>
              {res?.productDate ? res?.productDate : "-"}
            </Text>
          </View>
          <View className='sptxt column' style={{ flex: 1, textAlign: "right" }}>
            <Text>
              {res?.runTime ? res?.runTime : "-"}
            </Text>
            <Text>
              运行时长
            </Text>
          </View>
        </View>
        <AtDivider height={40} lineColor="rgba(255,255,255,0.4)"></AtDivider>
        <View className='spacebt' style={{ flex: 1, color: "#fff" }}>
          <Text>
            全部参数
          </Text>
          <AtIcon value="chevron-right" size="16" color="rgba(255,255,255,0.6)"></AtIcon>
        </View>
      </View>

      <View className="center" style={{ flexWrap: "wrap", marginTop: 10 }}>
        <View className='spacebt card' onClick={() => {
          Router.navigate({
            url: '/subpages/ratio/index'
          },{
              params: { id: params.id }
          })
        }}>
          <Text>
            效率分析
          </Text>
          <Image src={chart} style={{ width: 16, height: 16 }}></Image>

        </View>
        <View style={{ width: 12, height: 12 }}></View>
        <View className='spacebt card' onClick={() => {
          Router.navigate({
            url: '/subpages/history/index'
          },{
              params: { id: params.id }
          })
        }}>
          <Text>
            历史故障
          </Text>
          <Image src={fault} style={{ width: 16, height: 16 }}></Image>
        </View>
      </View>

      <View className="center" style={{ flexWrap: "wrap", marginTop: 10 }}>
        {/* <View className='spacebt card'>
          <Text>
            MTBF
          </Text>
          <Image src={line} style={{ width: 16, height: 16 }}></Image>

        </View>
        <View style={{ width: 12, height: 12 }}></View> */}
        <View className='spacebt card' onClick={() => {
          Router.navigate({
            url: '/subpages/jia/index'
          },
            {
              params: { id: params.id }
            })

        }}>
          <Text>
            稼动率
          </Text>
          <Image src={cpu} style={{ width: 16, height: 16 }}></Image>
        </View>
      </View>


      {/* <BarChart />
      <LineChart /> */}



    </View>


  </View>
}

export default connect((global) => ({
  global
}))(Detail)