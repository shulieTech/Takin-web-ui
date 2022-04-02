import React, { useEffect, useState } from 'react';
import { Table, Icon, Tooltip } from 'antd';
import styles from '../index.less';
import { ColumnProps } from 'antd/lib/table';

interface Props {
  tableTreeData: any[];
  loading?: boolean;
  rowKey?: string;
  selectedKey?: string | number;
  onChange?: (key: string | number, record) => void;
  extraColumns?: ColumnProps<any>[];
  getRowDisabled?: (record: any) => boolean;
}

const TreeTable: React.FC<Props> = (props) => {
  const {
    loading,
    tableTreeData = [],
    getRowDisabled,
    rowKey = 'xpathMd5',
    extraColumns = [],
  } = props;
  
  const { selectedKey, onChange } = props;

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
            >
              {text}
            </span>
          </Tooltip>
        );
      },
    },
    ...extraColumns,
  ];

  return (
    <Table
      loading={loading}
      rowKey={rowKey}
      className={styles['table-no-border']}
      dataSource={tableTreeData}
      showHeader={false}
      columns={columns}
      size="small"
      pagination={false}
      defaultExpandAllRows
      onRow={(record) => {
        const isSelected = selectedKey === record[rowKey];
        const isDisbaled = getRowDisabled ? getRowDisabled(record) : false;
        return {
          onClick: () => {
            if (!isDisbaled) {
              onChange?.(record[rowKey], record);
              // if (isSelected) {
              //   onChange?.(null, null);
              // } else {
              //   onChange?.(record[rowKey], record);
              // }
            }
          },
        };
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
