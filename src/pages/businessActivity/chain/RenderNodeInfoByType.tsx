import { Button, message, Popconfirm, Tabs, Alert, Tooltip, Empty } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { defaultColumnProps } from 'racc';
import React from 'react';
import { ActivityBean, NodeBean } from '../enum';
import BusinessActivityService from '../service';
import { NodeDetailsCollapse, NodeDetailsTable } from './NodeInfoCommonNode';
import { getDefaultNodeIconConf } from 'src/components/g6-graph/GraphNode';
import styles from '../index.less';
import classNames from 'classnames';
import ServiceList, { sortServiceList, AppNameLink } from './ServiceList';

const { TabPane } = Tabs;

interface NodeContentConfig {
  tabs: ('实例' | '对外服务' | '下游调用' | '表' | 'Topic' | '路径')[];
}

export const RenderNodeInfoByType = (
  { nodeInfo, details, graph, labelSetting },
  setState: any
) => {
  const iconCfg = getDefaultNodeIconConf(nodeInfo.nodeType);
  const configMap: Record<string, NodeContentConfig> = {
    APP: {
      tabs: ['对外服务', '下游调用', '实例'],
    },
    DB: {
      tabs: ['对外服务', '表', '实例'],
    },
    CACHE: {
      tabs: ['对外服务', '实例'],
    },
    MQ: {
      tabs: ['对外服务', 'Topic', '实例'],
    },
    OSS: {
      tabs: ['对外服务', '路径', '实例'],
    },
    OUTER: {
      tabs: ['对外服务', '实例'],
    },
    UNKNOWN: {
      tabs: ['对外服务', '实例'],
    },
    SEARCH: {
      tabs: ['对外服务', '实例'],
    },
  };

  /**
   * @name =========================================实例===========================================
   */
  const NodeDetailsCard: React.FC<{
    nodeInfo: NodeBean;
    extra?: React.ReactNode;
  }> = (props) => {
    const { extra } = props;
    const getColumns = (): ColumnProps<any>[] => {
      return [
        {
          ...defaultColumnProps,
          title: '地址',
          dataIndex: ActivityBean.地址,
        },
      ];
    };

    return (
      <>
        {extra}
        {props.nodeInfo.nodes && (
          <NodeDetailsCollapse title="实例" num={props.nodeInfo.nodes.length}>
            <NodeDetailsTable
              columns={getColumns()}
              dataSource={props.nodeInfo.nodes}
            />
          </NodeDetailsCollapse>
        )}
        {props.children}
      </>
    );
  };

  /**
   * @name ==========================================下游调用==================================================
   */
  const DownStream: React.FC<NodeBean> = (props) => {
    const callService = props.callService;
    if (!(callService?.length > 0)) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    return (
      <>
        {callService.map((item, i) => (
          <NodeDetailsCollapse
            title={item.label}
            key={item.label + item.nodeType + i}
          >
            <NodeDetailsTable
              showHeader={false}
              showOrder={false}
              columns={[
                {
                  dataIndex: 'label',
                  width: 120,
                  render: (text) => (
                    <span style={{ color: 'var(--Netural-10, #8E8E8E)' }}>
                      {text}
                    </span>
                  ),
                },
                {
                  dataIndex: 'dataSource',
                  render: (text) =>
                    text?.length > 0
                      ? text.map((x, j) => <div key={x + j}>{x}</div>)
                      : '--',
                },
              ]}
              dataSource={item.dataSource}
            />
            {/* <NodeDetailsCustomTable dataSource={item.dataSource} /> */}
          </NodeDetailsCollapse>
        ))}
      </>
    );
  };

  /**
   * @name ===========================================对外服务====================================================
   */
  const OuterService: React.FC<any> = (props) => {
    const list = sortServiceList([props.nodeInfo], details.activityId, props.nodeInfo.id);
    const initalQuery = {
      activityId: props.activityId,
      nodeId: props.nodeInfo.id,
      serviceName: undefined,
      bottleneckStatus: -1,
      bottleneckType: -1,
    };
    if (!(list?.length > 0)) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    return <ServiceList initailQuery={initalQuery} isInBaseInfoModal />;
  };

  /**
   * @name ==========================================数据库==================================================
   */
  const TableList: React.FC<NodeBean> = (props) => {
    const getColumns = (): ColumnProps<any>[] => {
      return [
        {
          ...defaultColumnProps,
          title: '表名称',
          dataIndex: ActivityBean.表名称,
        },
      ];
    };
    return <NodeDetailsTable columns={getColumns()} dataSource={props.db} />;
  };

  /**
   * @name ==========================================消息队列==================================================
   */
  const TopicList: React.FC<NodeBean> = (props) => {
    const getColumns = (): ColumnProps<any>[] => {
      return [
        {
          ...defaultColumnProps,
          title: 'Topic',
          dataIndex: ActivityBean.Topic,
        },
      ];
    };
    return <NodeDetailsTable columns={getColumns()} dataSource={props.mq} />;
  };

  /**
   * @name ==========================================文件OSS==================================================
   */
  const OSSList: React.FC<NodeBean> = (props) => {
    const getColumns = (): ColumnProps<any>[] => {
      return [
        // {
        //   ...defaultColumnProps,
        //   title: '文件名称',
        //   dataIndex: ActivityBean.文件名称
        // },
        {
          ...defaultColumnProps,
          title: '文件路径',
          dataIndex: ActivityBean.文件路径,
        },
      ];
    };
    return <NodeDetailsTable columns={getColumns()} dataSource={props.oss} />;
  };

  /** @name 标记为外部应用 */
  const handleMarkOuterApp = async () => {
    const {
      data: { success },
    } = await BusinessActivityService.markOuterApp({
      ...details,
      nodeId: nodeInfo.id,
    });
    if (success) {
      message.success('成功标记为外部应用');
      // 刷新
      setState({ reload: Date.now() });
    }
  };

  const toBeOuter = (
    <Alert
      style={{
        marginTop: 16,
      }}
      showIcon
      icon={
        <span
          className="iconfont icon-anquandefuben"
          style={{ color: 'var(--FunctionalError-500, #F15F4A)', top: 13 }}
        />
      }
      closable
      type="error"
      message="未知应用"
      description={
        <div>
          该节点为未知应用，若为外部服务请将其标记为外部服务；若为内部应用请将其接入探针
          <div>
            <Popconfirm
              onConfirm={handleMarkOuterApp}
              title="确定标记为外部应用吗?"
            >
              <Button
                type="danger"
                style={{
                  backgroundColor: 'var(--FunctionalError-500, #ED6047)',
                  color: '#fff',
                  marginTop: 8,
                }}
              >
                标记为外部应用
              </Button>
            </Popconfirm>
          </div>
        </div>
      }
    />
  );

  const tabPanelMap = {
    对外服务: {
      icon: 'icon-waibutiaoyong',
      num: nodeInfo.providerService?.length,
      content: <OuterService nodeInfo={nodeInfo} />,
    },
    下游调用: {
      icon: 'icon-xiayoutiaoyong',
      num: nodeInfo.callService?.length,
      content: <DownStream {...nodeInfo} />,
    },
    表: {
      icon: 'icon-biao',
      num: nodeInfo.db?.length,
      content: <TableList {...nodeInfo} />,
    },
    Topic: {
      icon: 'icon-Topic',
      num: nodeInfo.mq?.length,
      content: <TopicList {...nodeInfo} />,
    },
    路径: {
      icon: 'icon-lujing',
      num: nodeInfo.oss?.length,
      content: <OSSList {...nodeInfo} />,
    },
    实例: {
      icon: 'icon-jiedian',
      num: nodeInfo.nodes?.length,
      content: <NodeDetailsCard nodeInfo={nodeInfo} />,
    },
  };

  const tabConfig = configMap[nodeInfo.nodeType] || configMap.UNKNOWN;

  if (!nodeInfo || !nodeInfo) {
    return null;
  }
  return (
    <>
      <div
        style={{
          backgroundColor: 'var(--FunctionalNetural-50, #F5F7F9)',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          display: 'flex',
          // alignItems: 'flex-end',
        }}
      >
        <img
          src={require(`src/assets/node-detail-bg-${
            nodeInfo.nodeType === 'UNKNOWN' ? 2 : 1
          }.png`)}
          alt="app"
          style={{ height: 114, marginRight: 16 }}
        />
        <div
          style={{
            flex: 1,
            padding: '16px 8px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <img
            src={require(`src/assets/node-detail-bg-3.png`)}
            alt="app"
            style={{
              width: 100,
              position: 'absolute',
              top: 16,
              right: 8,
              marginBottom: 8,
              zIndex: 0,
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#393B4F',
                marginBottom: 8,
              }}
            >
              {iconCfg.title}
            </div>
            <div
              style={{
                color: 'var(--Netural-12, #666)',
                marginBottom: 8,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <span style={{ color: 'var(--Netural-10, #8e8e8e)' }}>
                名称：
              </span>
              <Tooltip title={nodeInfo.label}>
                <AppNameLink applicationName={nodeInfo.label} activityDetail={details}/>
              </Tooltip>
            </div>
            <div
              style={{
                color: 'var(--Netural-12, #666)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {['APP'].includes(nodeInfo.nodeType) && (
                <span
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    paddingRight: 8,
                  }}
                >
                  <Tooltip title={nodeInfo.manager}>
                    <span style={{ color: 'var(--Netural-10, #8e8e8e)' }}>
                      负责人：
                    </span>
                    {nodeInfo.manager || '-'}
                  </Tooltip>
                </span>
              )}
              {/* {!['CACHE', 'DB'].includes(nodeInfo.nodeType) && (
                <>
                  <span style={{ flex: 1 }}>
                    <span style={{ color: 'var(--Netural-10, #8e8e8e)' }}>
                      TPS：
                    </span>
                    <span
                      style={{
                        color: 'var(--BranSecondary-500, #00D77D)',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}
                    >
                      {nodeInfo.allTotalTps || 0}
                    </span>
                  </span>
                  <span style={{ flex: 1 }}>
                    <span style={{ color: 'var(--Netural-10, #8e8e8e)' }}>
                      RT：
                    </span>
                    <span
                      style={{
                        color: 'var(--BranSecondary-500, #00D77D)',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}
                    >
                      {nodeInfo.allTotalRt || 0}
                    </span>
                  </span>
                </>
              )} */}
            </div>
          </div>
        </div>
      </div>
      {nodeInfo.nodeType === 'UNKNOWN' && toBeOuter}
      <Tabs
        defaultActiveKey={tabConfig.tabs[0]}
        className={classNames(
          styles['splited-tabs'],
          styles[`splited-tabs-${tabConfig.tabs.length}`]
        )}
      >
        {tabConfig.tabs.map((x) => {
          const tabPanelConfig = tabPanelMap[x];
          const tabTitle = (
            <div style={{ textAlign: 'center' }}>
              <span
                className={`iconfont ${tabPanelConfig.icon}`}
                style={{ fontSize: 24 }}
              />
              <div>
                {x} {tabPanelConfig.num}
              </div>
            </div>
          );
          return (
            <TabPane tab={tabTitle} key={x}>
              {tabPanelConfig.content}
            </TabPane>
          );
        })}
      </Tabs>
    </>
  );
};
