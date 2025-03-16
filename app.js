// app.js
App({
  onLaunch() {
    // 小程序启动逻辑
    console.log('小程序启动');
  },
  
  globalData: {
    // 全局共享数据
    // 用于在页面间传递计算结果数据
    calculationResults: null
  }
})
