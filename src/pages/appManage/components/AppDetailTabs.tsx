import { Tabs } from 'antd';
import React from 'react';
import DetailTabs from 'src/common/detail-tabs';
import BasicInfo from './BasicInfo';
import BlackList from './BlackList';
import DbAndTable from './DbAndTable';
import ExitJob from './ExitJob';
import Job from './Job';
import MiddlewareList from './MiddlewareList';
import MockList from './MockList';
import NodeManageList from './NodeManageList';
import NodeManageListOld from './NodeManageListOld';
import PluginManageList from './PluginManageList';
import ShadowConsumer from './ShadowConsumer';
import WhiteList from './WhiteList';

interface Props {
  detailData?: any;
  tabKey?: string;
  id?: string;
  detailState?: any;
  action?: any;
  isNewAgent?: number;
}
const AppDetailTabs: React.FC<Props> = props => {
  const { detailData, id, detailState, action, isNewAgent } = props;

  const tabsData = [
    {
      title: '基础信息',
      tabNode: <BasicInfo detailData={detailData} />,
      show: true
    },
    {
      title: '中间件',
      tabNode: (
        <MiddlewareList
          id={id}
          detailData={detailData}
          detailState={detailState}
          action={action}
        />
      ),
      show: true
    },
    {
      title: '影子库/表',
      tabNode: (
        <DbAndTable
          id={id}
          detailData={detailData}
          detailState={detailState}
          action={action}
        />
      ),
      show: true
    },
    {
      title: '出口挡板',
      tabNode: (
        <ExitJob
          id={id}
          detailData={detailData}
          detailState={detailState}
          action={action}
        />
      ),
      show: true
    },
    {
      title: 'Job任务',
      tabNode: (
        <Job
          id={id}
          detailData={detailData}
          detailState={detailState}
          action={action}
        />
      ),
      show: true
    },
    {
      title: '远程调用',
      tabNode: (
        <MockList
          id={id}
          detailData={detailData}
          detailState={detailState}
          action={action}
        />
      ),
      show: isNewAgent === 1 ? true : false
    },
    {
      title: '影子消费者',
      tabNode: (
        <ShadowConsumer
          id={id}
          detailData={detailData}
          detailState={detailState}
          action={action}
        />
      ),
      show: true
    },
    {
      title: '白名单',
      tabNode: (
        <WhiteList
          id={id}
          detailData={detailData}
          detailState={detailState}
          action={action}
        />
      ),
      show: isNewAgent === 1 ? false : true
    },
    {
      title: '节点管理',
      tabNode: (
        <NodeManageListOld
          id={id}
          detailData={detailData}
          detailState={detailState}
          action={action}
        />
      ),
      show: isNewAgent === 1 ? false : true
    },
    {
      title: '黑名单',
      tabNode: (
        <BlackList
          id={id}
          detailData={detailData}
          detailState={detailState}
          action={action}
        />
      ),
      show: true
    },
    {
      title: '探针管理',
      tabNode: (
        <NodeManageList
          id={id}
          detailData={detailData}
          detailState={detailState}
          action={action}
        />
      ),
      show: isNewAgent === 1 ? true : false
    },
    {
      title: '插件管理',
      tabNode: (
        <PluginManageList
          id={id}
          detailData={detailData}
          detailState={detailState}
          action={action}
        />
      ),
      show: true
    }
  ];

  return (
    <DetailTabs defaultActiveKey={props.tabKey}>
      {tabsData.map((item, index) => {
        if (item.show) {
          return (
            <Tabs.TabPane tab={item.title} key={`${index}`}>
              {item.tabNode}
            </Tabs.TabPane>
          );
        }
      })}
    </DetailTabs>
  );
};
export default AppDetailTabs;
