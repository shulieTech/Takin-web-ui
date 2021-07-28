import { MenuBean, MenuType } from 'src/common/menu/type';

const menuList: MenuBean[] = [
  {
    title: '系统概览',
    path: '/dashboard',
    type: MenuType.Item,
    icon: 'dashboard',
    key: 'dashboard'
  },
  {
    title: '仿真平台',
    type: MenuType.SubMenu,
    icon: 'shop',
    key: 'dashboard',
    children: [ 
      {
        title: '应用配置',
        path: '/appManages',
        type: MenuType.SubMenu,
        key: 'appManage',
        children: [
          {
            title: '应用管理',
            path: '/appManage',
            type: MenuType.Item,
            key: 'appManage',
            children: [
              {
                title: '应用详情',
                path: '/appManages/details',
                type: MenuType.NoMenu,
                key: 'appManage_details'
              },
            ]
          },
          {
            title: '白名单列表',
            path: '/appWhiteList',
            type: MenuType.Item,
            key: 'appWhiteList'
          }
        ]
      },
      {
        title: '链路管理',
        path: '/linkTease',
        type: MenuType.SubMenu,
        key: 'linkTease',
        children: [
          {
            title: '业务活动',
            path: '/businessActivity',
            type: MenuType.Item,
            key: 'businessActivity',
            children: [
              {
                title: '新增业务活动',
                path: '/businessActivity/addEdit',
                type: MenuType.NoMenu,
                key: 'businessActivity_addBusinessActivity'
              }
            ]
          },
          {
            title: '业务流程',
            path: '/businessFlow',
            type: MenuType.Item,
            key: 'businessFlow',
            children: [
              {
                title: '新增业务流程',
                path: '/businessFlow/addBusinessFlow',
                type: MenuType.NoMenu,
                key: 'businessFlow_addBusinessFlow'
              }
            ]
          },
          {
            title: '入口规则',
            path: '/configCenter/entryRule',
            type: MenuType.Item,
            key: 'configCenter_entryRule'
          }
        ]
      },
      {
        title: '脚本管理',
        path: '/scriptManages',
        type: MenuType.SubMenu,
        key: 'scriptManages',
        children: [
          {
            title: '测试脚本',
            path: '/scriptManage',
            type: MenuType.Item,
            key: 'scriptManage',
            children: [
              {
                title: '脚本配置',
                path: '/scriptManage/scriptConfig',
                type: MenuType.NoMenu,
                key: 'scriptManage_scriptConfig'
              },
              {
                title: '脚本调试详情',
                path: '/scriptManage/scriptDebugDetail',
                type: MenuType.NoMenu,
                key: 'scriptManage_scriptConfig'
              }
            ]
          },
          {
            title: '运维脚本',
            path: '/scriptOperation',
            type: MenuType.Item,
            key: 'scriptOperation'
          }
        ]
      },
      {
        title: '数据源管理',
        path: '/configCenter',
        type: MenuType.SubMenu,
        key: 'configCenter',
        children: [{
          title: '数据源配置',
          path: '/configCenter/dataSourceConfig',
          type: MenuType.Item,
          key: 'configCenter_dataSourceConfig'
        }]
      }
    ]
  },
  {
    title: '压测平台',
    path: '/p',
    type: MenuType.SubMenu,
    icon: 'dashboard',
    key: 'dashboard',
    children: [
      {
        title: '压测管理',
        path: '/pressureTestManage',
        type: MenuType.SubMenu,
        icon: 'hourglass',
        key: 'pressureTestManage',
        children: [
          {
            title: '压测场景',
            path: '/pressureTestManage/pressureTestScene',
            type: MenuType.Item,
            key: 'pressureTestManage_pressureTestScene',
            children: [
              {
                title: '压测场景配置',
                path:
                  '/pressureTestManage/pressureTestScene/pressureTestSceneConfig',
                type: MenuType.NoMenu,
                key: 'pressureTestManage_pressureTestScene_pressureTestSceneConfig'
              }
            ]
          },
          {
            title: '压测报告',
            path: '/pressureTestManage/pressureTestReport',
            type: MenuType.Item,
            key: 'pressureTestManage_pressureTestReport',
            children: [
              {
                title: '压测实况',
                path: '/pressureTestManage/pressureTestReport/pressureTestLive',
                type: MenuType.NoMenu,
                key: 'pressureTestManage_pressureTestReport_pressureTestLive'
              },
              {
                title: '压测报告详请',
                path: '/pressureTestManage/pressureTestReport/details',
                type: MenuType.NoMenu,
                key: 'pressureTestManage_pressureTestReport_details'
              }
            ]
          },
          {
            title: '压测统计',
            path: '/pressureTestManage/pressureTestStatistic',
            type: MenuType.Item,
            key: 'pressureTestManage_pressureTestStatistic'
          }
        ]
      }
    ]
  },
  {
    title: '设置中心',
    path: '/configCenter',
    type: MenuType.SubMenu,
    icon: 'setting',
    key: 'configCenter',
    children: [{
      title: '系统管理',
      path: '/configCenter',
      type: MenuType.SubMenu,
      icon: 'setting',
      key: 'configCenter',
      children: [
        {
          title: '全局配置',
          path: '/configCenter/globalConfig',
          type: MenuType.Item,
          key: 'configCenter_authorityConfig'
        },
        {
          title: '中间件库管理',
          path: '/configCenter/middlewareManage',
          type: MenuType.Item,
          key: 'configCenter_middlewareManage'
        },
        {
          title: '开关配置',
          path: '/configCenter/bigDataConfig',
          type: MenuType.Item,
          key: 'configCenter_bigDataConfig'
        }
      ]
    }]
  }
];

export default menuList;
