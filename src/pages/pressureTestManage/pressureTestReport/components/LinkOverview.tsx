import React, { Fragment } from 'react';
import { CommonTable } from 'racc';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';
import Header from 'src/common/header/Header';
interface Props {
  dataSource: any;
}
const LinkOverview: React.FC<Props> = props => {
  const { dataSource } = props;
  const getLinkOverviewColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '业务活动',
        dataIndex: 'testName'
      },
      {
        ...customColumnProps,
        title: '总请求数',
        dataIndex: 'totalRequest'
      },
      {
        ...customColumnProps,
        title: '平均TPS（实际/目标）',
        dataIndex: 'tps',
        render: (text, row) => {
          if (text) {
            return (
              <Fragment>
                <span
                  style={{
                    color:
                      Number(text.result) < Number(text.value) ? '#FE7D61' : ''
                  }}
                >
                  {text.result}
                </span>
                <span style={{ margin: '0 8px' }}>/</span>
                <span>{text.value === -1 ? '-' : text.value}</span>
              </Fragment>
            );
          }
          return '-';
        }
      },
      {
        ...customColumnProps,
        title: '平均RT（实际/目标）',
        dataIndex: 'avgRt',
        render: (text, row) => {
          if (text) {
            return (
              <Fragment>
                <span
                  style={{
                    color:
                      Number(text.result) > Number(text.value) &&
                      text.value !== -1
                        ? '#FE7D61'
                        : ''
                  }}
                >
                  {text.result}ms
                </span>
                <span style={{ margin: '0 8px' }}>/</span>
                <span>{text.value === -1 ? '-' : `${text.value}ms`}</span>
              </Fragment>
            );
          }
          return '-';
        }
      },
      {
        ...customColumnProps,
        title: '成功率（实际/目标）',
        dataIndex: 'successRate',
        render: (text, row) => {
          if (text) {
            return (
              <Fragment>
                <span
                  style={{
                    color:
                      Number(text.result) < Number(text.value) ? '#FE7D61' : ''
                  }}
                >
                  {text.result}%
                </span>
                <span style={{ margin: '0 8px' }}>/</span>
                <span>{text.value === -1 ? '-' : `${text.value}%`}</span>
              </Fragment>
            );
          }
          return '-';
        }
      },
      {
        ...customColumnProps,
        title: 'SA（实际/目标）',
        dataIndex: 'sa',
        render: (text, row) => {
          if (text) {
            return (
              <Fragment>
                <span
                  style={{
                    color:
                      Number(text.result) < Number(text.value) ? '#FE7D61' : ''
                  }}
                >
                  {text.result}%
                </span>
                <span style={{ margin: '0 8px' }}>/</span>
                <span>{text.value === -1 ? '-' : `${text.value}%`}</span>
              </Fragment>
            );
          }
          return '-';
        }
      }
    ];
  };
  return (
    <Fragment>
      <Header title="链路概览" />
      <CommonTable
        rowKey="xpathMd5"
        size="small"
        style={{ marginTop: 8 }}
        columns={getLinkOverviewColumns()}
        dataSource={dataSource}
      />
    </Fragment>
  );
};
export default LinkOverview;
