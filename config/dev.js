module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  uglify: {
    enable: true,
    config: {
      // 配置项同 https://github.com/mishoo/UglifyJS2#minify-options
    }
  },
  csso: {
    enable: true,
    config: {
      // 配置项同 https://github.com/css/csso#minifysource-options
    }
  },
  terser: {
    enable: true,
    config: {
      // 配置项同 https://github.com/terser/terser#minify-options
      extractComments: false,
      terserOptions: {
        format: {
          comments: false,
        },
      }
    }
  },
  mini: {},
  h5: {
    esnextModules: ['taro-ui'],
    webpackChain (chain, webpack) {
      chain.merge({
        proxy:{ 
          '/taro/': {
            target: 'http://172.21.3.128:8040/',
            changeOrigin: true,
            pathRewrite: { '^/taro': '' },
          },
        },
      })
    }
  }
}
