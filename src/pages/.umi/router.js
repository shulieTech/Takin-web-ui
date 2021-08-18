import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/',
    component: __IS_BROWSER
      ? dynamic({
          loader: () => import('../../layouts/index.tsx'),
          loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
            .default,
        })
      : require('../../layouts/index.tsx').default,
    routes: [
      {
        path: '/404',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../404.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../404.tsx').default,
      },
      {
        path: '/analysisManage/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../analysisManage/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../analysisManage/indexPage.tsx').default,
      },
      {
        path: '/appManage/details',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../appManage/detailsPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../appManage/detailsPage.tsx').default,
      },
      {
        path: '/appManage/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../appManage/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../appManage/indexPage.tsx').default,
      },
      {
        path: '/appWhiteList/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../appWhiteList/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../appWhiteList/indexPage.tsx').default,
      },
      {
        path: '/businessActivity/addEdit',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../businessActivity/addEditPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../businessActivity/addEditPage.tsx').default,
      },
      {
        path: '/businessActivity/details',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../businessActivity/detailsPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../businessActivity/detailsPage.tsx').default,
      },
      {
        path: '/businessActivity/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../businessActivity/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../businessActivity/indexPage.tsx').default,
      },
      {
        path: '/businessFlow/addBusinessFlow',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../businessFlow/addBusinessFlowPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../businessFlow/addBusinessFlowPage.tsx').default,
      },
      {
        path: '/businessFlow/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../businessFlow/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../businessFlow/indexPage.tsx').default,
      },
      {
        path: '/configCenter/bigDataConfig/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () =>
                import('../configCenter/bigDataConfig/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../configCenter/bigDataConfig/indexPage.tsx').default,
      },
      {
        path: '/configCenter/dataSourceConfig/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () =>
                import('../configCenter/dataSourceConfig/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../configCenter/dataSourceConfig/indexPage.tsx').default,
      },
      {
        path: '/configCenter/entryRule/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../configCenter/entryRule/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../configCenter/entryRule/indexPage.tsx').default,
      },
      {
        path: '/configCenter/globalConfig/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () =>
                import('../configCenter/globalConfig/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../configCenter/globalConfig/indexPage.tsx').default,
      },
      {
        path: '/configCenter/middlewareManage/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () =>
                import('../configCenter/middlewareManage/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../configCenter/middlewareManage/indexPage.tsx').default,
      },
      {
        path: '/configCenter/pressureMeasureSwitch/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () =>
                import('../configCenter/pressureMeasureSwitch/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../configCenter/pressureMeasureSwitch/indexPage.tsx')
              .default,
      },
      {
        path: '/configCenter/systemInfo/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../configCenter/systemInfo/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../configCenter/systemInfo/indexPage.tsx').default,
      },
      {
        path: '/configCenter/whitelistSwitch/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () =>
                import('../configCenter/whitelistSwitch/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../configCenter/whitelistSwitch/indexPage.tsx').default,
      },
      {
        path: '/dashboard/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../dashboard/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../dashboard/indexPage.tsx').default,
      },
      {
        path: '/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../index/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../index/indexPage.tsx').default,
      },
      {
        path: '/pressureTestManage/pressureTestReport/details',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () =>
                import('../pressureTestManage/pressureTestReport/detailsPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../pressureTestManage/pressureTestReport/detailsPage.tsx')
              .default,
      },
      {
        path: '/pressureTestManage/pressureTestReport/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () =>
                import('../pressureTestManage/pressureTestReport/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../pressureTestManage/pressureTestReport/indexPage.tsx')
              .default,
      },
      {
        path: '/pressureTestManage/pressureTestReport/pressureTestLive',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () =>
                import('../pressureTestManage/pressureTestReport/pressureTestLivePage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../pressureTestManage/pressureTestReport/pressureTestLivePage.tsx')
              .default,
      },
      {
        path: '/pressureTestManage/pressureTestScene/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () =>
                import('../pressureTestManage/pressureTestScene/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../pressureTestManage/pressureTestScene/indexPage.tsx')
              .default,
      },
      {
        path: '/pressureTestManage/pressureTestScene/pressureTestSceneConfig',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () =>
                import('../pressureTestManage/pressureTestScene/pressureTestSceneConfigPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../pressureTestManage/pressureTestScene/pressureTestSceneConfigPage.tsx')
              .default,
      },
      {
        path: '/pressureTestManage/pressureTestStatistic/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () =>
                import('../pressureTestManage/pressureTestStatistic/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../pressureTestManage/pressureTestStatistic/indexPage.tsx')
              .default,
      },
      {
        path: '/scriptManage/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../scriptManage/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../scriptManage/indexPage.tsx').default,
      },
      {
        path: '/scriptManage/scriptConfig',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../scriptManage/scriptConfigPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../scriptManage/scriptConfigPage.tsx').default,
      },
      {
        path: '/scriptManage/scriptDebugDetail',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../scriptManage/scriptDebugDetailPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../scriptManage/scriptDebugDetailPage.tsx').default,
      },
      {
        path: '/scriptManage/version',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../scriptManage/versionPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../scriptManage/versionPage.tsx').default,
      },
      {
        path: '/scriptOperation/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../scriptOperation/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../scriptOperation/indexPage.tsx').default,
      },
      {
        path: '/user/login',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../user/loginPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../user/loginPage.tsx').default,
      },
      {
        path: '/userManage/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../userManage/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../userManage/indexPage.tsx').default,
      },
      {
        path: '/visionalize/',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../visionalize/indexPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../visionalize/indexPage.tsx').default,
      },
      {
        path: '/visionalize/relation',
        exact: true,
        component: __IS_BROWSER
          ? dynamic({
              loader: () => import('../visionalize/relationPage.tsx'),
              loading: require('/Users/xieshuyu/Desktop/full-link-public/src/common/loading')
                .default,
            })
          : require('../visionalize/relationPage.tsx').default,
      },
    ],
  },
  {
    component: () =>
      React.createElement(
        require('/Users/xieshuyu/Desktop/full-link-public/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: false },
      ),
  },
];
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return <Router history={history}>{renderRoutes(routes, props)}</Router>;
  }
}
