import React, { Component, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, CoverImage } from '@tarojs/components'
import { AtButton, AtAvatar, AtIcon } from 'taro-ui'
import VirtualList from '@tarojs/components/virtual-list'
import './index.less'
import { connect } from 'remax-dva';
import { useRequest } from 'ahooks';
//import { fakeAccountLogin } from '../../services/api'
import { Router } from 'tarojs-router'
const scrollTop = 0
const Threshold = 20

const src = "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=387639067,1599589691&fm=26&gp=0.jpg"

const Row = React.memo(({ id, index, style, data }) => {
  const [action, setaction] = useState(false);

  return index == 0 ? (
    <View id={id} style={{ overflow: "hidden", padding: 5 }} onClick={() => {
      Taro.scanCode({
        complete: (res) => {
          console.log(res)
        },
      })
    }}>
      <View className={'center'} style={{ backgroundColor: "#ecfaff", height: 130, borderRadius: 12, flexDirection: "column" }}>
        <AtIcon value='add' size='26' color='#00a8ff'></AtIcon>
        <Text style={{ paddingTop: 12, color: "#00a8ff" }}>添加设备</Text>
      </View>
    </View>
  ) : (
      <View id={id} style={{ overflow: "hidden", padding: 5 }} onClick={(e) => {
        Taro.showToast({
          title: "外框",
          icon: 'none'
        })

        Router.navigate({ url: '/subpages/detail/index' }, { data: [1, 2, 3, 4], params: { id: 11, name: "强大设备" } })
      }}>
        <View style={{ backgroundColor: "#FFF", height: 130, position: "relative", borderRadius: 12, overflow: "hidden" }}>
          <View className='img' style={{ margin: "12px 0px 12px 12px", backgroundImage: `url(${src})` }} />
          <View style={{ position: "absolute", width: "120rpx", height: "120rpx", right: 0, top: 0, zIndex: 999 }} className='center' onClick={(e) => {
            e.stopPropagation();
          }}>
            <AtIcon value='menu' size='18' color='#bfbfbf' onClick={() => {
              Taro.showToast({
                title: "菜单",
                icon: 'none'
              })
              setaction(true)
            }}></AtIcon>
          </View>
          <View
            className={action ? action == "over" ? 'reactionmask' : 'actionmask' : 'noactionmask'}
            style={{ transition: "all 0.4s", borderRadius: 12 }}
            onClick={(e) => {
              e.stopPropagation();
            }}>
            <View className="center" style={{ flex: 1 }}>
              <View className="center" style={{ flex: 1, flexDirection: "column" }}>
                <AtIcon value='edit' size='18' color='#00a8ff'></AtIcon>
                <Text style={{ marginTop: 6, color: "#00a8ff" }}>编辑</Text>
              </View>
              <View style={{ width: 1, height: 18, backgroundColor: "#f0f0f0" }}></View>
              <View className="center" style={{ flex: 1, flexDirection: "column" }}>
                <AtIcon value='trash' size='18' color='#f50'></AtIcon>
                <Text style={{ marginTop: 6, color: "#f50" }}>删除</Text>
              </View>
            </View>
            <View style={{ width: "100%", height: 48, backgroundColor: "#f9f9f9" }} className="center" onClick={() => {
              setaction("over");
              setTimeout(() => {
                setaction(false)
              }, 400);
            }}>
              取消
            </View>

          </View>

          <View className='column' style={{ marginLeft: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 500, color: "#959595", marginBottom: 4 }}>
              空气净化器
            </Text>
            <Text style={{ fontSize: 14, color: "#9d9d9d" }}>
              卧室   <Text style={{ color: "#ebaf70" }}>设备离线</Text>
            </Text>
          </View>
        </View>
      </View>
    );
})

let Index = ({ global }) => {
  console.log(global)
  //let { data } = useRequest(()=>fakeAccountLogin({pageIndex:1}))
  // const { loading, run } = useRequest(fakeAccountLogin, {
  //   manual: true,
  //   onSuccess: (result, params) => {
  //       console.log(result,params)
  //   },
  // });
  const [state, setstate] = useState({
    refreshing: false,
    data: [0, 1, 2, 3]
  });
  const [userinfo, setuser] = useState({});

  useEffect(() => {
    GetUserInfo()
  }, [])

  function GetUserInfo() {
    Taro.getUserInfo({
      success: function (res) {
        console.log(res)
        var userInfo = res.userInfo
        // var nickName = userInfo.nickName
        // var avatarUrl = userInfo.avatarUrl
        // var gender = userInfo.gender //性别 0：未知、1：男、2：女
        // var province = userInfo.province
        // var city = userInfo.city
        // var country = userInfo.country
        setuser(userInfo)
      },
      fail: function (res) {
        console.log(res)
        setuser({
          nickName: "点我登录"
        })
      }
    })
  }



  let onScrollToLower = () => {
  }

  let onScroll = (e) => {
  }



  return <View style={{
    height: "100vh",
    //background: "url(https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=752122510,4052620513&fm=26&gp=0.jpg) no-repeat center", backgroundSize: "cover"
    backgroundImage: `linear-gradient(
      #bce8ff 0%,
      #aae0fc 34%,
      #c8c8ff 100%
    );`,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  }}>
    <View className="center" style={{ padding: 20, paddingTop: wx.getSystemInfoSync().statusBarHeight, paddingBottom: 0 }}>
      <View style={{ marginTop: 6 }}>
        <AtAvatar circle openData={{ type: "userAvatarUrl" }} size="small" ></AtAvatar>
      </View>
      <Text style={{ flex: 1, textAlign: "center", fontSize: 18 }}>南高</Text>
      <View style={{ width: 44, height: 44 }}></View>
    </View>

    <View>
      <AtButton 
      openType='getUserInfo' 
      type='primary' 
      className="text"
      onGetUserInfo={() => {
        GetUserInfo()
      }}>您好，{userinfo.nickName}</AtButton>
    </View>


    <VirtualList
      height={500}
      width='100%'
      scrollY
      scrollWithAnimation
      enableBackToTop
      enableFlex
      refresherEnabled
      refresherDefaultStyle="white"
      refresherBackground="transparent"
      itemData={state.data} /* 渲染列表的数据 */
      itemCount={state.data.length} /*  渲染列表的长度 */
      itemSize={140}
      refresherTriggered={state.refreshing}
      position="relative"
      onRefresherRefresh={() => {
        setstate({
          ...state,
          refreshing: true
        })
        setTimeout(() => {
          setstate({
            ...state,
            refreshing: false
          })
        }, 1000);
      }}
      scrollTop={scrollTop}
      lowerThreshold={Threshold}
      upperThreshold={Threshold}
      onScrollToLower={onScrollToLower}
      onScroll={onScroll}
    >
      {Row}
    </VirtualList>
  </View>

}
export default connect((global) => ({
  global
}))(Index)


/* <Span><AtButton onClick={() => {
    Taro.showToast({
      title: "test",
      icon: 'none'
    })

    //run({pageIndex:1});

    Router.navigate({ url: '/pages/detail/index' }, { data: [1, 2, 3, 4],params: { id: 11 } })
  }}>跳转</AtButton> </Span> */