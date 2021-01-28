export default {
  pages: [
    'pages/index/index',
  ],
  subpackages: [
    {
      "root": "subpages",
      "pages": [
        "detail/index"
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
