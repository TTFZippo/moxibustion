module.exports = {
  // 部署路径
  publicPath: './',
  productionSourceMap: false,
  chainWebpack: config => {
    // 发布
    config.when(process.env.NODE_ENV === "production", config => {
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals', {
        echarts: 'echarts'
      })
    })

    // 开发
    config.when(process.env.NODE_ENV === "development", config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }

}