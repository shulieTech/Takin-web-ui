import React, { useEffect, useState } from 'react';
import { Table, Icon, Tooltip } from 'antd';
import styles from '../index.less';
import useListService from 'src/utils/useListService';
import { filterInTreeData } from 'src/utils/utils';
import { ColumnProps } from 'antd/lib/table';

import { Basic } from 'src/types';
import BaseResponse = Basic.BaseResponse;

interface Props {
  rowKey?: string;
  service: (params: any) => Promise<BaseResponse<any>>;
  defaultQuery?: any;
  selectedKey?: string | number;
  onChange?: (key: string | number, record) => void;
  extraColumns?: ColumnProps<any>[];
  tickerTime?: number;
  getRowDisabled?: (record: any) => boolean;
}

const TreeTable: React.FC<Props> = (props) => {
  const { getRowDisabled, rowKey = 'xpathMd5', extraColumns = [] } = props;
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const { selectedKey, onChange, tickerTime = 0 } = props;

  const columns = [
    {
      dataIndex: 'testName',
      ellipsis: true,
      render: (text, record) => {
        const isSelected = selectedKey === record[rowKey];
        const isDisbaled = getRowDisabled ? getRowDisabled(record) : false;
        return (
          <Tooltip title={text} placement="bottomLeft">
            <span
              style={{
                color: isSelected ? 'var(--BrandPrimary-500)' : 'inherit',
                cursor: isDisbaled ? 'not-allowed' : 'pointer',
                opacity: isDisbaled ? 0.6 : 1,
              }}
              onClick={() => {
                if (!isDisbaled) {
                  if (isSelected) {
                    onChange?.(null, null);
                  } else {
                    onChange?.(record[rowKey], record);
                  }
                }
              }}
            >
              {text}
            </span>
          </Tooltip>
        );
      },
    },
    ...extraColumns,
  ];

  const { list, getList, loading } = useListService({
    service: props.service,
    defaultQuery: props.defaultQuery,
    isQueryOnQueryChange: false,
  });

  useEffect(() => {
    setExpandedRowKeys(
      filterInTreeData({
        treeData: list,
        filter: (x) => Array.isArray(x.children) && x.children.length > 0,
      }).map((x) => x[rowKey])
    );
  }, [list]);

  useEffect(() => {
    getList();
    if (tickerTime > 0) {
      const timer = setInterval(() => {
        getList();
      }, tickerTime);
      return () => clearInterval(timer);
    }
  }, []);

  return (
    <Table
      loading={loading}
      rowKey={rowKey}
      className={styles['table-no-border']}
      dataSource={list}
      showHeader={false}
      columns={columns}
      size="small"
      pagination={false}
      // defaultExpandAllRows
      // defaultExpandedRowKeys={defaultExpandedRowKeys}
      expandedRowKeys={expandedRowKeys}
      onExpandedRowsChange={(keys) => {
        setExpandedRowKeys(keys);
      }}
      expandIcon={({ expanded, expandable, record, onExpand }) =>
        expandable ? (
          <Icon
            onClick={() => onExpand(record)}
            type="caret-right"
            rotate={expanded ? 90 : 0}
            style={{
              display: 'inline-block',
              width: 20,
              lineHeight: '20px',
              verticalAlign: 'middle',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          />
        ) : (
          <span />
        )}
    />
  );
};

export default TreeTable;
