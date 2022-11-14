import React, { Fragment } from 'react';
import { Collapse } from 'antd';
import CustomTable from 'src/components/custom-table';
import styles from './../index.less';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';

interface Props {
  data?: any;
  id?: string;
  detailData?: any;
}
const BusinessActivityFailList: React.FC<Props> = (props) => {
  const { data, id, detailData } = props;
  const dataCheckingText =
    detailData?.calibration === 1 ? (
      <span style={{ fontSize: 12, color: '#999' }}>校准中</span>
    ) : (
      ''
    );

  const getBusinessActivityFailColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '业务活动',
        dataIndex: 'businessActivityName',
      },
      {
        ...customColumnProps,
        title: '平均TPS（实际/目标）',
        dataIndex: 'tps',
        render: (text, row) => {
          return (
            <Fragment>
              {dataCheckingText || (
                <span
                  style={{
                    color:
                      Number(text && text.result) < Number(text && text.value)
                        ? '#FE7D61'
                        : '',
                  }}
                >
                  {text.result || 0}
                </span>
              )}
              <span style={{ margin: '0 8px' }}>/</span>
              <span>{text?.value === -1 ? '-' : text?.value || 0}</span>
            </Fragment>
          );
        },
      },
      {
        ...customColumnProps,
        title: '平均RT（实际/目标）',
        dataIndex: 'avgRT',
        render: (text, row) => {
          return (
            <Fragment>
              {dataCheckingText || (
                <span
                  style={{
                    color:
                      Number(text && text.result) >
                        Number(text && text.value) && text.value !== -1
                        ? '#FE7D61'
                        : '',
                  }}
                >
                  {text.result}ms
                </span>
              )}
              <span style={{ margin: '0 8px' }}>/</span>
              <span>{text?.value === -1 ? '-' : `${text?.value || 0}ms`}</span>
            </Fragment>
          );
        },
      },
      {
        ...customColumnProps,
        title: '成功率（实际/目标）',
        dataIndex: 'successRate',
        render: (text, row) => {
          return (
            <Fragment>
              {dataCheckingText || (
                <span
                  style={{
                    color:
                      Number(text && text.result) < Number(text && text.value)
                        ? '#FE7D61'
                        : '',
                  }}
                >
                  {text.result}%
                </span>
              )}
              <span style={{ margin: '0 8px' }}>/</span>
              <span>{text?.value === -1 ? '-' : `${text?.value || 0}%`}</span>
            </Fragment>
          );
        },
      },
      {
        ...customColumnProps,
        title: 'SA（实际/目标）',
        dataIndex: 'sa',
        render: (text, row) => {
          return (
            <Fragment>
              {dataCheckingText || (
                <span
                  style={{
                    color:
                      Number(text && text.result) < Number(text && text.value)
                        ? '#FE7D61'
                        : '',
                  }}
                >
                  {text.result}%
                </span>
              )}
              <span style={{ margin: '0 8px' }}>/</span>
              <span>{text?.value === -1 ? '-' : `${text?.value || 0}%`}</span>
            </Fragment>
          );
        },
      },
    ];
  };
  return (
    <div className={styles.failWrap}>
      <Collapse expandIconPosition="right">
        <Collapse.Panel
          header={
            <span
              style={{
                color: '#393B4F',
                fontSize: '18px',
                fontWeight: 600,
                marginLeft: 16,
              }}
            >
              <span
                style={{
                  color: '#FE7D61',
                  fontSize: '24px',
                  fontWeight: 500,
                  marginRight: 6,
                }}
              >
                {data && data.length}
              </span>
              个业务活动不达标
            </span>
          }
          key="1"
        >
          <CustomTable
            columns={getBusinessActivityFailColumns()}
            dataSource={data}
          />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
export default BusinessActivityFailList;
