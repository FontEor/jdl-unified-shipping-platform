const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const { SgmWebWebpackPlugin } = require('@jd/sgm-web')

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "~@/assets/styles/_variables.scss";',
      },
    },
  },
  configureWebpack: () => {
    return {
      plugins: [
        AutoImport({
          resolvers: [ElementPlusResolver()],
        }),
        Components({
          resolvers: [ElementPlusResolver()],
        }),
        // 说明：webpack4中需将它做为最后一个插件
        new SgmWebWebpackPlugin({
          sid: process.env.VUE_APP_SGM_SID,
          pid: process.env.VUE_APP_SGM_PID,
        }, true),
      ],
    }
  },
  devServer: {
    host: 'local.jdl.com',
    port: 8080,
    proxy: {
      '/fe': {
        target: 'http://fahuo-uat-2.jd.local',
        /** 是否允许跨域 */
        changeOrigin: true,
        pathRewrite: { '^/fe': '' },
      },
    },
  },
})
