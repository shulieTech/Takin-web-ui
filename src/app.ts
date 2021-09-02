export const qiankun = Promise.resolve({
  apps: [
    {
      name: 'pro', // 子应用唯一id
      entry: 'http://192.168.1.71/tro-pro/index.html', // html entry
   // entry: 'http://192.168.63.15:8001/',
      base: '/pro', // 子应用的路由前缀，通过这个前缀判断是否要启动该应用，通常跟子应用的 base 保持一致
      mountElementId: 'app-slave', // 子应用挂载点
      history: 'hash' // 避免404
    }
      // 其他子应用
  ]
});