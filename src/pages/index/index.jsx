import React, { Component, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtButton, AtAvatar, AtIcon, AtActivityIndicator, AtInput } from 'taro-ui'
import VirtualList from '@tarojs/components/virtual-list'
import './index.less'
import { connect } from 'remax-dva';
import { useRequest } from 'ahooks';
import { usersave, devicelist, addevice, terminatedevice, changedevicename } from '../../services/api'
import { Router } from 'tarojs-router'
const scrollTop = 0
const Threshold = 20
const status = {
  "0": "#333333",
  "1": "#60baa0",
  "2": "#ff9e32",
  "3": "#ff4d30",
}


let Index = ({ global, dispatch }) => {
  let { theme } = global.global;
  const [state, setstate] = useState({
    refreshing: false,
    data: [0]
  });
  //let { data } = useRequest(()=>fakeAccountLogin({pageIndex:1}))

  const { run, loading } = useRequest(devicelist, {
    manual: true,
    onSuccess: (result, params) => {
      setstate({
        ...state,
        refreshing: false,
        data: [0, ...result.data.dataList]
      })
    },
  });


  const [userinfo, setuser] = useState({});

  useEffect(() => {
    GetUserInfo(() => {
    });
    run({})
  }, [])

  function GetUserInfo(fn) {
    Taro.login({
      success: function (result) {
        if (result.code) {
          Taro.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              let userInfo = res.userInfo,
                iv = res.iv,
                { nickName, avatarUrl, gender, country, province, city } = userInfo,
                { code } = result;
              setuser(userInfo);//设置登录人信息

              usersave({ nickName, avatarUrl, gender, country, province, city, code, iv }).then(response => {
                Taro.setStorage({
                  key: "token",
                  data: response.data.openId
                }).then(() => {
                  //后端添加用户
                  fn ? fn() : null
                })
              })
            },
            fail: function (res) {
              setuser({
                nickName: "点我登录"
              })
            }
          })

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

  }

  let onScrollToLower = () => {
  }

  let onScroll = (e) => {
  }



  const Row = React.memo(({ index, rowData }) => {
    const [action, setaction] = useState(false),
      [value, setvalue] = useState(null);
    return index == 0 ? (
      <View className='at-col at-col-6' style={{ overflow: "hidden", padding: 5,height:140 }} onClick={() => {
        Taro.scanCode({
          complete: (res) => {
           
          },
          success: (res) => {
            addevice({ gatewayInfoId: res.result }).then(res => {
              if (res.code == "0000") {
                run({});
              }
            })
          }
        })
      }}>
        <View className={theme.type == "theme1" ? theme.bgclass + "light center" : "center"} style={{
          backgroundColor: "#ecfaff",
          height: 130,
          borderRadius: 12,
          flexDirection: "column"
        }}>
          <AtIcon value='add' size='26' color={theme.type == "theme1" ? "#333" : theme.primaryColor}></AtIcon>
          <Text style={{ paddingTop: 12, color: theme.type == "theme1" ? "#333" : theme.primaryColor }}>添加设备</Text>
        </View>
      </View>
    ) : (
        <View className='at-col  at-col-6' style={{ overflow: "hidden", padding: 5,height:140  }} onClick={(e) => {
          Router.navigate({ url: '/subpages/detail/index' }, { params: { id: rowData?.id, name: rowData?.equipmentName } })
        }}>
          <View style={{ backgroundColor: "#FFF", height: 130, position: "relative", borderRadius: 12, overflow: "hidden" }}>
            {
              rowData?.pictureUrl ?
                <View className='img' style={{ margin: "12px 0px 12px 12px", backgroundImage: `url(${rowData?.pictureUrl})` }} /> :
                <View style={{ margin: "12px 0px 12px 12px" }} >
                  <AtIcon value='image' className={theme.textclass} size='48'></AtIcon>
                </View>
            }

            <View style={{ position: "absolute", width: "120rpx", height: "120rpx", right: 0, top: 0, zIndex: 999 }} className='center' onClick={(e) => {
              e.stopPropagation();
            }}>
              <View className="center" style={{ width: "100%", height: "100%" }} onClick={() => {
                setaction(true)
              }}>
                <AtIcon value='menu' size='18' color='#bfbfbf'></AtIcon>
              </View>
            </View>

            <View
              className={action ? action == "over" ? 'reactionmask' : 'actionmask' : 'noactionmask'}
              style={{ transition: "all 0.4s", borderRadius: 12 }}
              onClick={(e) => {
                e.stopPropagation();
              }}>
              {
                action == 'edit' ?
                  <View className="center" style={{ flex: 1, position: "relative", paddingTop: 34 }}>
                    <AtInput
                      name='value'
                      type='text'
                      placeholder='请输入设备名称'
                      value={value}
                      onChange={(val) => {
                        setvalue(val)
                      }}
                    />
                    <View className='center' style={{ width: 40, height: 40, position: "absolute", top: 0, right: 0 }} onClick={() => {
                      setaction(true)
                    }}>
                      <AtIcon value='close' size='16'></AtIcon>
                    </View>
                  </View>
                  : <View className="center" style={{ flex: 1 }}>
                    <View className="center" style={{ flex: 1, flexDirection: "column" }} onClick={() => {
                      setaction("edit")
                    }}>
                      <AtIcon value='edit' size='18' color={theme.primaryColor}></AtIcon>
                      <Text style={{ marginTop: 6, color: theme.primaryColor }}>编辑</Text>
                    </View>
                    <View style={{ width: 1, height: 18, backgroundColor: "#f0f0f0" }}></View>
                    <View className="center" style={{ flex: 1, flexDirection: "column" }} onClick={() => {
                      Taro.showModal({
                        title: "确认删除？",
                        content: "此网关已配置，重新配置后，原数据将清空。",
                        success: function (res) {
                          if (res.confirm) {
                            terminatedevice({ id: rowData?.id }).then(res => {
                              if (res.code == "0000") {
                                run({});
                              }
                            })
                          } else if (res.cancel) {
                          }
                        }
                      })
                    }}>
                      <AtIcon value='trash' size='18' color='#f50'></AtIcon>
                      <Text style={{ marginTop: 6, color: "#f50" }}>删除</Text>
                    </View>
                  </View>
              }

              <View style={{ width: "100%", height: 48, backgroundColor: "#f9f9f9" }} className="center" onClick={() => {
                if (action == "edit") {
                  changedevicename({ id: rowData?.id, equipmentName: value }).then(res => {
                    if (res.code == "0000") {
                      run({});
                    }
                  })
                  return
                }
                setaction("over");
                setTimeout(() => {
                  setaction(false)
                }, 400);
              }}>
                {action == "edit" ? "确定" : "取消"}
              </View>

            </View>

            <View className='column' style={{ marginLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: 500, color: "#959595", marginBottom: 4,textOverflow:"ellipsis",whiteSpace:'nowrap',overflow:"hidden" }}>
                {rowData?.equipmentName}
              </Text>
              <Text style={{ fontSize: 14, color: "#9d9d9d" }}>
                <Text style={{ color: Object.values(status)[rowData?.collectStatus] }}>{rowData?.collectStatusName}</Text> {rowData?.equipmentModelName}
              </Text>
            </View>
          </View>
        </View>
      );
  })

  return <View className={theme.bgclass + "main"} style={{
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  }}>
    <View className="center" style={{ padding: 20, paddingTop: wx.getSystemInfoSync().statusBarHeight, paddingBottom: 0 }}>
      <View style={{ marginTop: 6 }} onLongPress={() => {
        dispatch({
          type: 'global/changetheme',
        })
      }}>
        <AtAvatar circle openData={{ type: "userAvatarUrl" }} size="small"></AtAvatar>
      </View>
      <Text style={{ flex: 1, textAlign: "center", fontSize: 18 }}>南高</Text>
      <View style={{ width: 44, height: 44 }}></View>
    </View>

    <View className='center'>
      <AtButton
        openType='getUserInfo'
        type='primary'
        className="text"
        onGetUserInfo={() => {
          GetUserInfo(() => {
            run({})
          })
        }}>
        您好，{userinfo.nickName}
      </AtButton>
      <View style={{ flex: 1, display: "flex", justifyContent: "flex-end", paddingRight: 24 }}>
        <AtActivityIndicator isOpened={loading}></AtActivityIndicator>
      </View>
    </View>
    <ScrollView
      height={wx.getSystemInfoSync().screenHeight}
      width='100%'
      className='at-row at-row--wrap'
      scrollY
      scrollWithAnimation
      enableBackToTop
      enableFlex
      refresherEnabled
      refresherDefaultStyle="white"
      refresherBackground="transparent"
      refresherTriggered={state.refreshing}
      onRefresherRefresh={() => {
        setstate({
          ...state,
          refreshing: true
        })
        run({})
      }}
      scrollTop={scrollTop}
      lowerThreshold={Threshold}
      upperThreshold={Threshold}
    >
      {
        state.data.map((it, i) => {
          return <Row index={i} rowData={it}></Row>
        })
      }
    </ScrollView>
  </View>

}
export default connect((global) => ({
  global
}))(Index)
