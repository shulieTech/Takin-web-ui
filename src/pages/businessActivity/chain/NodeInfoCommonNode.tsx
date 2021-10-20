import { Col, Collapse, Icon, Row, Tooltip, Tabs } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { TabsProps } from 'antd/lib/tabs';
import { CommonTable, CommonTabs, defaultColumnProps } from 'racc';
import { CommonTableProps } from 'racc/dist/common-table/CommonTable';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { BusinessActivityDetailsContext } from '../detailsPage';
import { ActivityBean, NodeBean, NodeType } from '../enum';
import styles from '../index.less';

/**
 * @name ===========================================公共头部===========================================
 * @param props
 */
export const NodeDetailsHeader: React.FC<{
  title: string;
  details: { label: string; value: any }[];
  actions?: React.ReactNode;
  type: NodeType;
}> = (props) => {
  const imgUrlMap = {
    [NodeType.应用]: 'app_details_icon',
    [NodeType.外部应用]: 'outer_details_icon',
    [NodeType.数据库]: 'db_details_icon',
    [NodeType.文件]: 'oss_details_icon',
    [NodeType.未知应用]: 'unknow_details_icon',
    [NodeType.消息队列]: 'mq_details_icon',
    [NodeType.缓存]: 'cache_details_icon',
  };
  return (
    <Row className="mg-b3x" align="middle" type="flex" justify="space-between">
      <Col>
        <Row type="flex" align="middle">
          <Col>
            <img
              src={require(`../../../assets/${imgUrlMap[props.type]}.png`)}
              style={{ width: 64, height: 64 }}
              alt=""
            />
          </Col>
          <Col className="mg-l2x">
            <div>
              {props.title?.length > 24 ? (
                <Tooltip title={props.title}>
                  <span
                    style={{
                      fontSize: 22,
                      color: '#393B4F',
                      fontWeight: 'bold',
                    }}
                  >
                    {props.title.substr(0, 24)}...
                  </span>
                </Tooltip>
              ) : (
                <span
                  style={{ fontSize: 22, color: '#393B4F', fontWeight: 'bold' }}
                >
                  {props.title}
                </span>
              )}
            </div>
            <Row type="flex" gutter={24} className="mg-t1x">
              {props.details.map((item, index) => (
                <Col key={index} style={{ fontSize: 13, fontWeight: 400 }}>
                  <span style={{ color: '#9e9e9e' }}>{item.label}：</span>
                  <span style={{ color: '#11BBD5', fontWeight: 'bold' }}>
                    {item.value || '--'}
                  </span>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Col>
      <Col>{props.actions}</Col>
    </Row>
  );
};

interface CommonTabsProps {
  onRender: (
    item: any,
    index: number,
    initActivityKey: number
  ) => React.ReactNode;
  tabsProps?: TabsProps;
  onChange?: (activeKey: string) => void;
  dataSource: any[];
}

/**
 * @name ===========================================公共tab===========================================
 */
export const NodeDetailsTab: React.FC<CommonTabsProps> = (props) => {
  const [activeKey, setActiveKey] = useState(0);
  const { state } = useContext(BusinessActivityDetailsContext);
  useEffect(() => {
    setActiveKey(0);
  }, [state.nodeInfo]);
  return (
    <CommonTabs
      tabsProps={{
        // tabBarStyle: { border: '1px solid #e8e8e8' },
        ...props.tabsProps,
        activeKey: activeKey.toString(),
        renderTabBar: () => (
          <div className={styles.tabBar}>
            {props.dataSource.map((item, index) => {
              const current = index === activeKey;
              return (
                <div
                  className={styles.tabBarItem}
                  onClick={() => setActiveKey(index)}
                  key={index}
                >
                  <span
                    style={{
                      borderBottom: index === activeKey && '3px solid #11BBD5',
                      padding: '8px 16px',
                      color: current && '#434343',
                      fontSize: current && 14,
                      fontWeight: current ? 'bold' : 400,
                    }}
                  >
                    {item.tab}
                  </span>
                </div>
              );
            })}
          </div>
        ),
      }}
      dataSource={props.dataSource}
      onRender={props.onRender}
    />
  );
};

/**
 * @name =========================================公共collspane===========================================
 */
export const NodeDetailsCollapse: React.FC<{
  title: string | React.ReactNode;
  num?: number;
  showNum?: boolean;
}> = (props) => {
  const { showNum = true } = props;
  const title: React.ReactNode = (
    <span className={styles.collspaneTitle}>
      <span
        style={{ fontSize: 14, fontWeight: 600, color: 'var(--Netural-14, #424242)' }}
      >
        {props.title}
      </span>
      {showNum && (
        <span
          style={{
            color: 'var(--Netural-10, #8E8E8E)',
            fontWeight: 'bold',
            marginLeft: 8,
          }}
        >
          {props.num}
        </span>
      )}
    </span>
  );
  return (
    <Collapse
      expandIconPosition="right"
      defaultActiveKey={['1']}
      className={styles.collspane}
      expandIcon={(panelProps) => {
        if (panelProps.isActive) {
          return <Icon type="caret-up" />;
        }
        return <Icon type="caret-down" />;
      }}
    >
      <Collapse.Panel header={title} key="1">
        {props.children}
      </Collapse.Panel>
    </Collapse>
  );
};

/**
 * @name =========================================公共Table===========================================
 */
export const NodeDetailsTable: React.FC<
  CommonTableProps & { showOrder?: boolean }
> = (props) => {
  const { showOrder = true, ...restProps } = props;
  const getColumns = (columns: ColumnProps<any>[]): ColumnProps<any>[] => {
    const newColumns: any[] = columns.map((item) => ({
      ...item,
      align: 'left',
    }));
    if (!showOrder) {
      return newColumns;
    }
    return [
      {
        ...defaultColumnProps,
        title: '序号',
        dataIndex: 'index',
        width: 60,
        render: (text, row, index) => (
          <span style={{ color: 'var(--Netural-10, #8E8E8E)' }}>
            {index + 1 < 10 ? `0${index + 1}` : index + 1}
          </span>
        ),
      },
      ...newColumns,
    ];
  };
  return (
    <CommonTable
      {...restProps}
      columns={getColumns(props.columns)}
      className={styles.table}
      dataSource={props.dataSource || []}
      rowKey={(row, index) => index.toString()}
    />
  );
};

/**
 * @name =========================================公共定制Table===========================================
 */
interface NodeDetailsCustomTableProps {
  dataSource: { label: string; dataSource: string[] }[];
}
export const NodeDetailsCustomTable: React.FC<NodeDetailsCustomTableProps> = (
  props
) => {
  const style: React.CSSProperties = {
    lineHeight: '18px',
    color: '#434343',
    fontWeight: 600,
    borderBottom: '1px dashed #DCDCDC',
    padding: '12px 0',
  };
  return (
    <Fragment>
      {props.dataSource.map((item, index) => (
        <Row key={index}>
          <Col span={5} style={{ color: '#8C8C8C', marginTop: 12 }}>
            {item.label}
          </Col>
          <Col span={19}>
            {item.dataSource && item.dataSource.length ? (
              item.dataSource.map((item2, index2) => (
                <div key={index2} style={style}>
                  {item2}
                </div>
              ))
            ) : (
              <div style={style}>--</div>
            )}
          </Col>
        </Row>
      ))}
    </Fragment>
  );
};
