import { MenuBean, MenuType } from 'src/common/menu/type';

const menuList: MenuBean[] = [
  {
    title: '系统概览',
    path: '/dashboard',
    type: MenuType.Item,
    icon: 'dashboard'
  },
  {
    title: '仿真平台',
    type: MenuType.SubMenu,
    path: '/shop',
    icon: 'shop',
    children: [
      {
        title: '应用配置',
        type: MenuType.SubMenu,
        path: '/appConfig',
        children: [
          {
            title: '应用管理',
            path: '/appManage',
            type: MenuType.Item,
            children: [
              {
                title: '应用详情',
                path: '/appManage/details',
                type: MenuType.NoMenu
              }
            ]
          },
          {
            title: '白名单列表',
            path: '/appWhiteList',
            type: MenuType.Item
          }
        ]
      },
      {
        title: '链路管理',
        type: MenuType.SubMenu,
        path: '/linkManage',
        children: [
          {
            title: '入口规则',
            path: '/configCenter/entryRule',
            type: MenuType.Item
          },
          {
            title: '业务活动',
            path: '/businessActivity',
            type: MenuType.Item,
            children: [
              {
                title: '新增业务活动',
                path: '/businessActivity/addEdit',
                type: MenuType.NoMenu
              }
            ]
          },
          {
            title: '业务流程',
            path: '/businessFlow',
            type: MenuType.Item,
            children: [
              {
                title: '新增业务流程',
                path: '/businessFlow/addBusinessFlow',
                type: MenuType.NoMenu
              },
              {
                title: '编辑业务流程',
                path: '/businessFlow/details',
                type: MenuType.NoMenu
              }
            ]
          }
        ]
      },
      {
        title: '脚本管理',
        type: MenuType.SubMenu,
        path: '/scriptManages',
        children: [
          {
            title: '测试脚本',
            path: '/scriptManage',
            type: MenuType.Item,
            children: [
              {
                title: '脚本配置',
                path: '/scriptManage/scriptConfig',
                type: MenuType.NoMenu
              },
              {
                title: '脚本调试详情',
                path: '/scriptManage/scriptDebugDetail',
                type: MenuType.NoMenu
              }
            ]
          },
          {
            title: '运维脚本',
            path: '/scriptOperation',
            type: MenuType.Item
          }
        ]
      },
      {
        title: '数据源管理',
        type: MenuType.SubMenu,
        path: '/dataSourceManage',
        children: [
          {
            title: '数据源配置',
            path: '/configCenter/dataSourceConfig',
            type: MenuType.Item
          }
        ]
      }
    ]
  },
  {
    title: '压测平台',
    type: MenuType.SubMenu,
    path: '/hourglass',
    icon: 'hourglass',
    children: [
      {
        title: '压测管理',
        type: MenuType.SubMenu,
        path: '/pressureTestManage',
        children: [
          {
            title: '压测场景',
            path: '/pressureTestManage/pressureTestScene',
            type: MenuType.Item,
            children: [
              {
                title: '压测场景配置',
                path:
                  '/pressureTestManage/pressureTestScene/pressureTestSceneConfig',
                type: MenuType.NoMenu
              }
            ]
          },
          {
            title: '压测报告',
            path: '/pressureTestManage/pressureTestReport',
            type: MenuType.Item,
            children: [
              {
                title: '压测实况',
                path: '/pressureTestManage/pressureTestReport/pressureTestLive',
                type: MenuType.NoMenu
              },
              {
                title: '压测报告详请',
                path: '/pressureTestManage/pressureTestReport/details',
                type: MenuType.NoMenu
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: '设置中心',
    type: MenuType.SubMenu,
    path: '/setting',
    icon: 'setting',
    children: [
      {
        title: '系统管理',
        type: MenuType.SubMenu,
        path: '/configCenter',
        children: [
          {
            title: '系统信息',
            path: '/configCenter/systemInfo',
            type: MenuType.Item
          },
          {
            title: '全局配置',
            path: '/configCenter/globalConfig',
            type: MenuType.Item
          },
          {
            title: '中间件库管理',
            path: '/configCenter/middlewareManage',
            type: MenuType.Item
          },
          {
            title: '开关配置',
            path: '/configCenter/bigDataConfig',
            type: MenuType.Item
          }
        ]
      }
    ]
  }
];

export default menuList;
