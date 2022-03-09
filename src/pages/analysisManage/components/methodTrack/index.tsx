/**
 * @name
 * @author MingShined
 */
import { Button, Input, message, Select } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import {
  CommonTable,
  defaultColumnProps,
  renderToolTipItem,
  useStateReducer
} from 'racc';
import React, { Fragment, useContext, useEffect } from 'react';
import CustomSelect from '../../common/CustomSelect';
import { ThreadContext } from '../../context';
import { AnalysisEnum, AnalysisType } from '../../enum';
import AnalysisService from '../../service';
import { AnalysisProps } from '../../types';
interface Props extends AnalysisProps {}

enum StatusMap {
  待采集,
  采集中,
  采集结束,
  采集超时
}

const MethodTrack: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    dataSource: [],
    id: null,
    traceObject: null,
    loading: false,
    sampleId: null
  });
  const {
    state: { processName }
  } = useContext(ThreadContext);
  const isReport = props.query.type === AnalysisType.分析报告;
  useEffect(() => {
    setState({ dataSource: [], sampleId: null });
  }, [processName]);
  useEffect(() => {
    let timer = null;
    if (isReport) {
      return;
    }
    clearInterval(timer);
    if (state.sampleId) {
      timer = setInterval(() => {
        queryTreeList();
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [state.sampleId]);
  /** @name 获取方法树 */
  const queryTreeList = async (params = {}) => {
    setState({ loading: true });
    const {
      data: { data, success }
    } = await AnalysisService.queryMethodTreeList({
      id: state.id,
      sampleId: state.sampleId,
      ...params
    });
    if (success && data) {
      setState({ dataSource: [data.traceManageDeployResponse] });
      if (data.traceStatus) {
        setState({ loading: false, sampleId: null });
      }
    } else {
      setState({ sampleId: null, loading: false });
    }
  };
  /** @name 分析报告搜索方法 */
  const handleSearch = () => {
    if (!state.id) {
      message.info('请选择方法');
      return;
    }
    queryTreeList();
  };
  /** @name 开始追踪 */
  const startCreateTrace = async (params = {}) => {
    if (!state.traceObject) {
      message.info('请填写类名#方法名');
      return;
    }
    if (state.traceObject.indexOf('#') === -1) {
      message.info('类名与方法名请以#区分');
      return;
    }
    setState({ loading: true });
    const {
      data: { data, success }
    } = await AnalysisService.startTraceMethod({
      processName,
      reportId: props.query.reportId,
      traceObject: state.traceObject,
      ...params
    });
    if (data && success) {
      setState({ sampleId: data.sampleId });
    } else {
      setState({ loading: false });
    }
  };
  const renderFormNode = (): React.ReactNode => {
    if (isReport) {
      return (
        <Fragment>
          <CustomSelect
            onChange={id => setState({ id })}
            placeholder="请选择方法"
            style={{ width: 250 }}
            url={`/traceManage/queryTraceManageList`}
            labelKey="traceObject"
            valueKey="id"
            onRender={item => (
              <Select.Option value={item.value} key={item.value}>
                {renderToolTipItem(item.label, 35)}
              </Select.Option>
            )}
            params={{ processName, reportId: props.query.reportId }}
          />
          <Button
            onClick={() => handleSearch()}
            type="primary"
            className="mg-l2x"
          >
            搜索
          </Button>
        </Fragment>
      );
    }
    return (
      <Fragment>
        {/* TODO 自动带入默认值 */}
        <Input
          onChange={e => setState({ traceObject: e.target.value })}
          style={{ width: 300 }}
          placeholder="类名#方法名"
        />
        <Button
          onClick={() => startCreateTrace()}
          type="primary"
          className="mg-l2x"
        >
          开始追踪
        </Button>
      </Fragment>
    );
  };
  return (
    <Fragment>
      {renderFormNode()}
      <CommonTable
        columns={getColumns(state, setState, isReport, startCreateTrace)}
        className="mg-t2x"
        loading={state.loading}
        dataSource={state.dataSource}
        rowKey="id"
      />
    </Fragment>
  );
};
export default MethodTrack;

const getColumns = (
  state,
  setState,
  isReport: boolean,
  startTrace
): ColumnProps<any>[] => {
  return [
    {
      ...defaultColumnProps,
      title: '方法名',
      dataIndex: AnalysisEnum.方法名,
      align: 'left',
      render: (text, item, index) => {
        if (isReport) {
          if (!item.children && state.dataSource[0].children) {
            return <span style={{ marginLeft: -24 }}>{text}</span>;
          }
          return text;
        }
        if (item.children && item.children.length) {
          return text;
          return <span style={{ marginLeft: 24 }}>{text}</span>;
        }
        if (item.status !== StatusMap.待采集) {
          return (
            <span style={{ marginLeft: state.dataSource[0].children && -24 }}>
              {text}
            </span>
          );
          return text;
        }
        return (
          <span style={{ marginLeft: state.dataSource[0].children && '-24px' }}>
            <span
              className="ft-ct pointer"
              style={{
                border: '1px solid #e8e8e8',
                padding: '0 3px'
              }}
              onClick={() => startTrace({ traceManageDeployId: item.id })}
            >
              +
            </span>
            <span className="mg-l2x">{text}</span>
          </span>
        );
      }
    },
    {
      ...defaultColumnProps,
      align: 'left',
      title: '行号',
      dataIndex: AnalysisEnum.行号
    },
    {
      ...defaultColumnProps,
      align: 'left',
      title: '平均耗时',
      dataIndex: AnalysisEnum.平均耗时
    },
    // {
    //   ...defaultColumnProps,
    //   align: 'left',
    //   title: '中位数',
    //   dataIndex: AnalysisEnum.中位数
    // },
    // {
    //   ...defaultColumnProps,
    //   align: 'left',
    //   title: 'P90',
    //   dataIndex: AnalysisEnum.P90
    // },
    // {
    //   ...defaultColumnProps,
    //   align: 'left',
    //   title: 'P95',
    //   dataIndex: AnalysisEnum.P95
    // },
    // {
    //   ...defaultColumnProps,
    //   align: 'left',
    //   title: 'P99',
    //   dataIndex: AnalysisEnum.P99
    // },
    // {
    //   ...defaultColumnProps,
    //   align: 'left',
    //   title: '最小值',
    //   dataIndex: AnalysisEnum.最小值
    // },
    // {
    //   ...defaultColumnProps,
    //   align: 'left',
    //   title: '最大值',
    //   dataIndex: AnalysisEnum.最大值
    // }
  ];
};
