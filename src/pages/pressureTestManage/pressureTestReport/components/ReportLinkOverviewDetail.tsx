/* eslint-disable react-hooks/exhaustive-deps */
import { Icon, Popover, Radio } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { CommonSelect, CommonTable, useStateReducer } from 'racc';
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

  const dataCheckingText = detailData?.calibration === 1 ? <span style={{ fontSize: 12, color: '#999' }}>校准中</span> : '';

  const [state, setState] = useStateReducer<State>({
    data: null,
    loading: false,
  });

  useEffect(() => {
    queryPressureTestDetailList({ reportId: id });
  }, []);

  console.log('data',state?.data);

  useEffect(() => {
    // 数据校准中时5s刷新一次
    if (detailData?.calibration === 1) {
      const ticker = setInterval(() => {
        queryPressureTestDetailList({ reportId: id });
      }, 5000);
      return () => clearInterval(ticker);
    }
  }, [detailData?.calibration]);

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
  

  /**
   * @name 替换线程组
   */
  const handleChange = (record) => {
    console.log('record',record);
   console.log("data",state?.data);
  }

  const getReportLinkOverviewColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '业务活动',
        dataIndex: 'testName',
        width: 300,
        render: (text, record) => {
          return <Fragment>
            {text}
            <CommonSelect onChange={()=>{
              handleChange(record)
            }} allowClear={false} defaultValue={''} style={{ marginLeft: 8 }} size="small" dataSource={[{ label: '1', value: '1' }, { label: '全部', value: '' }]} />
          </Fragment>;
        }
      },
      {
        ...customColumnProps,
        title: '请求数',
        dataIndex: 'totalRequest',
        render: (text, record) => {
          return dataCheckingText || text;
        }
      },
      {
        ...customColumnProps,
        title: '平均TPS（实际/目标）',
        dataIndex: 'tps',
        render: (text, row) => {
          if (!text) {
            return '-';
          }
          return (
            <Fragment>
              {
                dataCheckingText || <span
                  style={{
                    color:
                      Number(text && text.result) < Number(text && text.value)
                        ? '#FE7D61'
                        : ''
                  }}
                >
                  {text.result}
                </span>
              }
              <span style={{ margin: '0 8px' }}>/</span>
              <span>{text.value === -1 ? '-' : text.value}</span>
            </Fragment>
          );
        }
      },
      {
        ...customColumnProps,
        title: '平均RT（实际/目标）',
        dataIndex: 'avgRt',
        render: (text, row) => {
          if (!text) {
            return '-';
          }
          return (
            <Fragment>
              <div style={{ display: 'flex', alignItems: 'center', }}>
                <span style={{ flex: 1, }}>
                  {
                    dataCheckingText || <span
                      style={{
                        color:
                          Number(text && text.result) >
                            Number(text && text.value) && text.value !== -1
                            ? '#FE7D61'
                            : ''
                      }}
                    >
                      {text.result}ms
                    </span>
                  }
                  <span style={{ margin: '0 8px' }}>/</span>
                  <span>{text.value === -1 ? '-' : `${text.value}ms`}</span>
                </span>
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
                    style={{ marginLeft: 4 }}
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
          if (!text) {
            return '-';
          }
          return (
            <Fragment>
              {dataCheckingText || <span
                style={{
                  color:
                    Number(text && text.result) < Number(text && text.value)
                      ? '#FE7D61'
                      : ''
                }}
              >
                {text.result}%
              </span>}
              <span style={{ margin: '0 8px' }}>/</span>
              <span>{text.value === -1 ? '-' : `${text.value}%`}</span>
            </Fragment>
          );
        }
      },
      {
        ...customColumnProps,
        title: 'SA（实际/目标）',
        dataIndex: 'sa',
        render: (text, row) => {
          if (!text) {
            return '-';
          }
          return (
            <Fragment>
              {dataCheckingText || <span
                style={{
                  color:
                    Number(text && text.result) < Number(text && text.value)
                      ? '#FE7D61'
                      : ''
                }}
              >
                {text.result}%
              </span>}
              <span style={{ margin: '0 8px' }}>/</span>
              <span>{text.value === -1 ? '-' : `${text.value}%`}</span>
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
            dataIndex: 'maxTps',
            render: text => dataCheckingText || text,
          },
          {
            title: '最大RT',
            dataIndex: 'maxRt',
            render: text => dataCheckingText || text,
          },
          {
            title: '最小RT',
            dataIndex: 'minRt',
            render: text => dataCheckingText || text,
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
