import { Collapse } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import EmptyNode from 'src/common/empty-node';
import CustomTable from 'src/components/custom-table';
import { customColumnProps } from 'src/components/custom-table/utils';
import { LinkDebugState } from '../indexPage';
import LinkDebugService from '../service';
import styles from './../index.less';
interface Props {
  missingData: any[];
  type: 'debug' | 'detail';
}

const DataValidationWrap: React.FC<Props> = props => {
  const { missingData, type } = props;
  const { Panel } = Collapse;
  const customPanelStyle = {
    background: '#ffffff',
    borderRadius: 2,
    marginBottom: 8,
    border: '1px solid #F0F0F0',
    overflow: 'hidden'
  };

  const getDataValidationWrapColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '序号',
        dataIndex: 'order',
        width: 80
      },
      {
        ...customColumnProps,
        title: '命令',
        dataIndex: 'sql'
      }
    ];
  };

  const getResultDataValidationWrapColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '序号',
        dataIndex: 'order',
        width: 80
      },
      {
        ...customColumnProps,
        title: '命令',
        dataIndex: 'sql',
        render: (text, row) => {
          return (
            <span
              style={{
                color:
                  row.statusResponse && row.statusResponse.value !== '0'
                    ? '#EA5B3C'
                    : ''
              }}
            >
              {text}
            </span>
          );
        }
      },
      {
        ...customColumnProps,
        title: '结果',
        dataIndex: 'statusResponse',
        render: (text, row) => {
          return (
            <span
              style={{
                color:
                  row.statusResponse && row.statusResponse.value !== '0'
                    ? '#EA5B3C'
                    : ''
              }}
            >
              {text && text.label}
            </span>
          );
        }
      }
    ];
  };
  return (
    <div
      className={styles.missingDataWrap}
      style={{ height: 600, overflowY: 'scroll', marginTop: 16 }}
    >
      <Collapse
        defaultActiveKey={['0']}
        expandIconPosition="right"
        bordered={false}
      >
        {missingData && missingData.length > 0 ? (
          missingData.map((item, k) => {
            return (
              <Panel
                style={customPanelStyle}
                header={
                  <div style={{ position: 'relative' }}>
                    {item.statusResponse &&
                      item.statusResponse.value !== '0' && (
                        <span className={styles.louIcon}>!</span>
                      )}
                    <span className={styles.title}>{item.name}</span>
                    <p className={styles.subTitle}>
                      <span style={{ color: '#11BBD5' }}>url: </span>
                      {item.jdbcUrl}
                    </p>
                  </div>}
                key={k}
              >
                <div>
                  <CustomTable
                    bordered={false}
                    defaultExpandAllRows={true}
                    columns={
                      type === 'debug'
                        ? getDataValidationWrapColumns()
                        : getResultDataValidationWrapColumns()
                    }
                    dataSource={item.vos}
                  />
                </div>
              </Panel>
            );
          })
        ) : (
          <EmptyNode />
        )}
      </Collapse>
    </div>
  );
};
export default DataValidationWrap;
