import { Icon, Popover } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { CommonTable, useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import { customColumnProps } from 'src/components/custom-table/utils';
import PressureTestReportService from '../service';
import styles from './../index.less';
interface Props {
  id?: string;
  detailData?: any;
}

interface State {
  data: any[];
  loading: boolean;
}
const ReportLinkOverviewDetail: React.FC<Props> = props => {
  const { id, detailData } = props;

  const [state, setState] = useStateReducer<State>({
    data: null,
    loading: false
  });

  useEffect(() => {
    queryPressureTestDetailList({ reportId: id });
  }, []);

  /**
   * @name 获取压测明细列表
   */
  const queryPressureTestDetailList = async value => {
    setState({
      loading: true
    });
    const {
      data: { success, data }
    } = await PressureTestReportService.queryPressureTestDetailList({
      ...value
    });
    if (success) {
      setState({
        data: data.scriptNodeSummaryBeans
      });
    }
    setState({
      loading: false
    });
  };

  const getReportLinkOverviewColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '业务活动',
        dataIndex: 'testName',
        width: 300
      },
      {
        ...customColumnProps,
        title: '请求数',
        dataIndex: 'totalRequest'
      },
      {
        ...customColumnProps,
        title: '平均TPS（实际/目标）',
        dataIndex: 'tps',
        render: (text, row) => {
          return (
            <Fragment>
              <span
                style={{
                  color:
                    Number(text && text.result) < Number(text && text.value)
                      ? '#FE7D61'
                      : ''
                }}
              >
                {text.result}
              </span>
              <span style={{ margin: '0 8px' }}>/</span>
              <span>{text && text.value}</span>
            </Fragment>
          );
        }
      },
      {
        ...customColumnProps,
        title: '平均RT（实际/目标）',
        dataIndex: 'avgRt',
        render: (text, row) => {
          return (
            <Fragment>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    color:
                      Number(text && text.result) > Number(text && text.value)
                        ? '#FE7D61'
                        : ''
                  }}
                >
                  {text.result}ms
                </span>
                <span style={{ margin: '0 8px' }}>/</span>
                <span>{text && text.value}ms</span>
                <Popover
                  placement="bottomLeft"
                  content={
                    <div className={styles.distributionWrap}>
                      <p className={styles.title}>分布</p>
                      {row.distribute &&
                        row.distribute.map((item, key) => {
                          return (
                            <p key={key} className={styles.distributionList}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  width: '50%'
                                }}
                              >
                                {item.lable}
                              </span>
                              <span>{item.value}</span>
                            </p>
                          );
                        })}
                    </div>}
                >
                  <Icon
                    style={{ position: 'absolute', right: 6, top: 2 }}
                    type="pie-chart"
                    theme="filled"
                  />
                </Popover>
              </div>
            </Fragment>
          );
        }
      },
      {
        ...customColumnProps,
        title: '请求成功率（实际/目标）',
        dataIndex: 'successRate',
        render: (text, row) => {
          return (
            <Fragment>
              <span
                style={{
                  color:
                    Number(text && text.result) < Number(text && text.value)
                      ? '#FE7D61'
                      : ''
                }}
              >
                {text.result}%
              </span>
              <span style={{ margin: '0 8px' }}>/</span>
              <span>{text && text.value}%</span>
            </Fragment>
          );
        }
      },
      {
        ...customColumnProps,
        title: 'SA（实际/目标）',
        dataIndex: 'sa',
        render: (text, row) => {
          return (
            <Fragment>
              <span
                style={{
                  color:
                    Number(text && text.result) < Number(text && text.value)
                      ? '#FE7D61'
                      : ''
                }}
              >
                {text.result}%
              </span>
              <span style={{ margin: '0 8px' }}>/</span>
              <span>{text.value}%</span>
            </Fragment>
          );
        }
      },
      {
        ...customColumnProps,
        title: '峰值情况',
        align: 'center',
        children: [
          {
            title: '最大TPS',
            dataIndex: 'maxTps'
          },
          {
            title: '最大RT',
            dataIndex: 'maxRt'
          },
          {
            title: '最小RT',
            dataIndex: 'minRt'
          }
        ]
      }
    ];
  };
  return (
    <Fragment>
      {state.data && (
        <CommonTable
          rowKey="xpathMd5"
          loading={state.loading}
          bordered
          size="small"
          style={{ marginTop: 8 }}
          defaultExpandAllRows={true}
          columns={getReportLinkOverviewColumns()}
          dataSource={state.data ? state.data : []}
          indentSize={8}
        />
      )}
    </Fragment>
  );
};
export default ReportLinkOverviewDetail;
