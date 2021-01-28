module.exports = {
  env: {
    NODE_ENV: '"production"'
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
       cache: true,
      extractComments: false,
      terserOptions: {
        output: {
          comments: false
        }
      }
    }
  },
  proxy:{ 
    '/api/': {
      target: 'http://49.235.82.163:4000/mock/12/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  mini: {},
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
  }
}