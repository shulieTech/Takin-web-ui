/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import { Drawer, Select, Icon, Spin, Tooltip } from 'antd';
import styles from '../index.less';
import { BusinessActivityDetailsContext } from '../detailsPage';
import { Link } from 'umi';
import ServiceList, { sortServiceList } from './ServiceList';

const { Option } = Select;

interface Props {
  activityId?: number;
}

const WatchList: React.FC<Props> = (props) => {
  const { state, setState } = useContext(BusinessActivityDetailsContext);

  const { watchListVisible } = state;

  const [loading, setLoading] = useState(false);

  const initalQuery = {
    activityId: props.activityId,
    nodeId: undefined,
    serviceName: undefined,
    bottleneckStatus: -1,
    bottleneckType: -1,
  };

  return (
    <Drawer
      maskClosable
      onClose={() => setState({ watchListVisible: false })}
      width={560}
      style={{
        position: 'absolute',
        height: 'calc(100% - 16px)',
        top: 8,
        right: 10,
      }}
      headerStyle={{ backgroundColor: 'var(--FunctionalNetural-50, #F5F7F9)' }}
      placement="right"
      className={styles.nodeInfoDrawer}
      mask={false}
      visible={watchListVisible}
      getContainer={document.getElementById('detail_graph_box')}
      destroyOnClose
      title={
        <div id="watchListHeader">
          链路性能监控
          <Tooltip
            title="1、「在链路图显示流量性能」：表示当前节点服务的性能数据显示在链路图中，对于单一节点来说，如果选中了多个服务，则显示多个服务性能数据的加权平均值，性能数据包括调用量、TPS、RT、成功率等。
            2、「瓶颈监控」：瓶颈监控是根据混合流量（包含压测流量+业务流量）的性能情况计算得出的性能瓶颈"
          >
            <Icon
              type="question-circle"
              style={{ cursor: 'pointer', marginLeft: 8 }}
            />
          </Tooltip>
        </div>
      }
    >
      <Spin spinning={loading}>
        <ServiceList
          initailQuery={initalQuery}
          afterChangeQuery={(query) => {
            setState({
              ...state.watchListQuery,
              ...query,
            });
          }}
        />
      </Spin>
    </Drawer>
  );
};

export default WatchList;
