module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  proxy:{ 
    '/api/': {
      target: 'http://49.235.82.163:4000/mock/12/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  h5: {
    esnextModules: ['taro-ui']
  }
}
