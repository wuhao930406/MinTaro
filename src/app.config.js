export default {
  pages: [
    'pages/index/index',
    
  ],
  subpackages: [
    {
      "root": "subpages",
      "pages": [
        "detail/index",
        "jia/index",//稼动率
        "parameter/index",//全部参数
        "ratio/index",//效率分析
        "history/index",//历史故障
      ]
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
