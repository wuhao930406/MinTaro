import React, { Component,useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import Span from '../../components/test'
import './index.less'
import { connect } from 'remax-dva';
import { useRequest } from 'ahooks';
import { fakeAccountLogin } from '../../services/api'
import { Router } from 'tarojs-router'


function changeUsername(username) {
  console.log(username);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
}

let Index = ({ global }) => {
  console.log(global)
  useEffect(() => {
    fakeAccountLogin({pageIndex:1}).then(res=>{
      console.log(res)
    })
  }, []);
 
  let { data } = useRequest(()=>fakeAccountLogin({pageIndex:1}))



  const { loading, run } = useRequest(fakeAccountLogin, {
    manual: true,
    onSuccess: (result, params) => {
        console.log(result,params)
    },
  });


  return <Span><AtButton onClick={() => {
    Taro.showToast({
      title: "test",
      icon: 'none'
    })

    run({pageIndex:1});

    Router.navigate({ url: '/pages/user/index' }, { data: [1, 2, 3, 4],params: { id: 11 } })
  }}>{data?.code}</AtButton> </Span>
}
export default connect((global) => ({
  global
}))(Index)