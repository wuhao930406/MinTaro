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
        "parameter/index"
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
