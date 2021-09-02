import { resolve } from 'path';
import theme from './theme';
function getRouter(router) {
  if (router.routes) {
    router.routes = router.routes
      .filter(({ component }) => {
        if (component.indexOf('page.tsx') >= 0) {
          return true;
        }
        if (
          component.indexOf('Page.tsx') >= 0 ||
          component.indexOf('404.tsx') >= 0
        ) {
          return true;
        }
        return false;
      })
      .map(item => {
        if (!item.path) {
          return item;
        }
        return {
          ...item,
          path: item.path
            .replace('index/indexPage', '')
            .replace('indexPage', '')
            .replace('Page', '')
            .replace('page', '')
        };
      });
  }
  return router;
}
export default {
  // proxy,
  theme,
  history: 'hash',
  publicPath: './',
  hash: true,
  treeShaking: true,
  plugins: [
    [
      '@umijs/plugin-qiankun',
      {
        master: {
          defer: true, // 异步加载
          // jsSandbox: true,
          prefetch: true,
          // apps: [{
          //   name: 'pro', // 子应用唯一id
          //   entry: 'http://192.168.1.71/tro-pro/index.html', // html entry
          //   // entry: 'http://192.168.63.15:8001/',
          //   base: '/pro', // 子应用的路由前缀，通过这个前缀判断是否要启动该应用，通常跟子应用的 base 保持一致
          //   mountElementId: 'app-slave', // 子应用挂载点
          // }]
        },
      },
    ],
    [
      'umi-plugin-react',
      {
        antd: {
          dynamicImport: false
        },
        dva: {
          dynamicImport: false
        },
        dynamicImport: {
          loadingComponent: '../src/common/loading'
        },
        dll: false,
        routes: {
          update(routes) {
            return routes.map(item => {
              return getRouter(item);
            });
          }
        },
        hardSource: false
      }
    ]
  ],
  chainWebpack:  (config, { webpack }) => {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test: /^.*node_modules[\\/](?!lodash|antd|echarts|@antv[\\/]g6[\\/]dist[\\/]).*$/,
              priority: 10,
            },
            // rccalendar: {
            //   name: 'rccalendar',
            //   test: /[\\/]node_modules[\\/]rc-calendar[\\/]/,
            //   chunks: 'all',
            //   priority: -1
            // },
            // rctable: {
            //   name: 'rctable',
            //   test: /[\\/]node_modules[\\/]rc-table[\\/]es[\\/]/,
            //   chunks: 'all',
            //   priority: -1
            // },
            // rctimepicker: {
            //   name: 'rctimepicker',
            //   test: /[\\/]node_modules[\\/]rc-time-picker/,
            //   chunks: 'all',
            //   priority: 10
            // },
            // rcselect: {
            //   name: 'rc-select',
            //   test: /[\\/]node_modules[\\/]rc-select/,
            //   chunks: 'all',
            //   priority: 10
            // },
            lodash: {
              name: 'lodash',
              test: /[\\/]node_modules[\\/]lodash[\\/]/,
              chunks: 'all',
              priority: 10
            },
            antd: {
              name: 'antd',
              test: /[\\/]node_modules[\\/]antd[\\/]/,
              chunks: 'all',
              priority: 10
            },
            echarts: {
              name: 'echarts',
              test: /[\\/]node_modules[\\/]echarts[\\/]/,
              chunks: 'all',
              priority: 9
            },
            antv: {
              name: 'antv',
              test: /[\\/]node_modules[\\/]@antv[\\/]g6[\\/]/,
              chunks: 'all',
              priority: 9
            },
            codemirror: {
              name: 'codemirror',
              test: /[\\/]node_modules[\\/]codemirror[\\/]/,
              chunks: 'all',
              priority: 9
            },
            // racc: {
            //   name: 'racc',
            //   test: /[\\/]node_modules[\\/]racc[\\/]/,
            //   chunks: 'all',
            //   priority: 9
            // },
            // zrender: {
            //   name: 'zrender',
            //   test: /[\\/]node_modules[\\/]zrender[\\/]/,
            //   chunks: 'all',
            //   priority: 9
            // },
          },
        },
      }
    });
    // 过滤掉moment的那些不使用的国际化文件
    config.plugin('replace').use(require('webpack').ContextReplacementPlugin).tap(() => {
      return [/moment[/\\]locale$/, /zh-cn/];
    });
  },
  alias: {
    src: resolve(__dirname, '../src')
  }
};
