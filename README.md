## 环境准备：
首先得有 node【https://nodejs.org/en/】，并确保 node 版本是 10.13 或以上，建议使用版本14.16.1。（mac 下推荐使用 nvm【https://github.com/nvm-sh/nvm】 来管理 node 版本）
推荐使用 yarn 管理 npm 依赖，并使用国内源
## 国内源
$ npm i yarn tyarn -g
# 后面文档里的 yarn 换成 tyarn
$ tyarn -v

安装依赖：yarn
启动项目：yarn start
构建：yarn build
部署：把 dist 目录部署到服务器上（找到文件夹里 index.html 文件，替换 serverUrl 地址为服务地址即可，需在后端接口地址后增加 /api）


## 注意事项
- 为了使用umi约定式路由的嵌套路由，使用_layout.tsx文件，不再限制路由页面tsx文件以page结尾，但是依然兼容这种方式，详见`config/config.ts`中的 `getRouter` 方法，[参考](https://v2.umijs.org/zh/guide/router.html#%E5%B5%8C%E5%A5%97%E8%B7%AF%E7%94%B1)