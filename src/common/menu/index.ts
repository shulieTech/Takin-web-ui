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
    title: '链路梳理',
    path: '/linkTease',
    type: MenuType.SubMenu,
    icon: 'home',
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
      // {
      //   title: '业务活动',
      //   path: '/businessActivity',
      //   type: MenuType.Item,
      //   key: 'businessActivity',
      //   children: [
      //     {
      //       title: '新增业务活动',
      //       path: '/businessActivity/addBusinessActivity',
      //       type: MenuType.NoMenu,
      //       key: 'businessActivity_addBusinessActivity'
      //     }
      //   ]
      // },
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
      }
    ]
  },
  {
    title: '应用配置',
    path: '/appManages',
    type: MenuType.SubMenu,
    icon: 'shop',
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
    title: '脚本管理',
    path: '/scriptManages',
    type: MenuType.SubMenu,
    icon: 'code',
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
  // {
  //   title: 'Shell脚本管理',
  //   path: '/shellManage',
  //   type: MenuType.Item,
  //   icon: 'file',
  //   key: 'shellManage',
  //   children: [
  //     {
  //       title: '脚本配置',
  //       path: '/shellManage/shellConfig',
  //       type: MenuType.NoMenu,
  //       key: 'shellManage_shellConfig'
  //     }
  //   ]
  // },
  // {
  //   title: '应用管理（体验）',
  //   path: '/appTrialManage',
  //   type: MenuType.Item,
  //   icon: 'shop',
  //   key: '1,0',
  //   children: [
  //     {
  //       title: '应用详情',
  //       path: '/appTrialManage/details',
  //       type: MenuType.NoMenu,
  //       key: '1,0'
  //     }
  //   ]
  // },
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
  },
  {
    title: '调试工具',
    path: '/debugTool',
    type: MenuType.SubMenu,
    icon: 'bug',
    key: 'debugTool',
    children: [
      {
        title: '链路调试',
        path: '/debugTool/linkDebug',
        type: MenuType.Item,
        key: 'debugTool_linkDebug',
        children: [
          {
            title: '链路调试详情',
            path: '/debugTool/linkDebug/detail',
            type: MenuType.NoMenu,
            key: 'debugTool_linkDebug_detail'
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
    children: [
      // {
      //   title: '压测开关设置',
      //   path: '/configCenter/pressureMeasureSwitch',
      //   type: MenuType.Item,
      //   key: 'configCenter_pressureMeasureSwitch'
      // },
      // {
      //   title: '白名单开关设置',
      //   path: '/configCenter/whitelistSwitch',
      //   type: MenuType.Item,
      //   key: 'configCenter_whitelistSwitch'
      // },
      {
        title: '全局配置',
        path: '/configCenter/globalConfig',
        type: MenuType.Item,
        key: 'configCenter_authorityConfig'
      },
      {
        title: '权限配置中心',
        path: '/configCenter/authorityConfig',
        type: MenuType.Item,
        key: 'configCenter_authorityConfig'
      },
      // {
      //   title: '黑名单',
      //   path: '/configCenter/blacklist',
      //   type: MenuType.Item,
      //   key: 'configCenter_blacklist'
      // },
      {
        title: '入口规则',
        path: '/configCenter/entryRule',
        type: MenuType.Item,
        key: 'configCenter_entryRule'
      },
      {
        title: '操作日志',
        path: '/configCenter/operationLog',
        type: MenuType.Item,
        key: 'configCenter_operationLog'
      },
      {
        title: '数据源配置',
        path: '/configCenter/dataSourceConfig',
        type: MenuType.Item,
        key: 'configCenter_dataSourceConfig'
      },
      {
        title: '开关配置',
        path: '/configCenter/bigDataConfig',
        type: MenuType.Item,
        key: 'configCenter_bigDataConfig'
      }
    ]
  },
  {
    title: '流量账户',
    path: '/flowAccount',
    type: MenuType.Item,
    icon: 'account-book',
    key: 'flowAccount'
  },
  {
    title: '压力机管理',
    path: '/pressMachineManage',
    type: MenuType.SubMenu,
    icon: 'desktop',
    key: 'flowAccount',
    children: [
      {
        title: '压力机管理',
        path: '/pressMachineManage/pressMachineManage',
        type: MenuType.Item,
        // icon: 'account-book',
        key: 'flowAccount'
      }
    ]
  },
  {
    title: '巡检大盘',
    path: '/e2eBigScreen',
    type: MenuType.Item,
    icon: 'account-book',
    key: 'patrolScreen'
  },
  {
    title: '巡检管理',
    path: '/missionManage',
    type: MenuType.Item,
    icon: 'account-book',
    key: 'patrolManage',
    children: [
      {
        title: '巡检场景详情',
        path: '/missionManage/sceneDetails',
        type: MenuType.NoMenu,
        key: 'missionManage_sceneDetails',
      }
    ]
  },
  {
    title: '瓶颈列表',
    path: '/bottleneckTable',
    type: MenuType.Item,
    icon: 'unordered-list',
    key: 'bottleneckTable',
    children: [
      {
        title: '巡检场景详情',
        path: '/bottleneckTable/bottleneckDetails',
        type: MenuType.NoMenu,
        key: 'bottleneckTable_bottleneckDetails',
      }
    ]
  },
  {
    title: '瓶颈通知',
    path: '/faultNotification',
    type: MenuType.Item,
    icon: 'menu-unfold',
    key: 'exceptionNoticeManage'
  },
  {
    title: '配置中心',
    path: '/setFocus',
    type: MenuType.Item,
    icon: 'setting',
    key: 'bottleneckConfig'
  },
];

export default menuList;
