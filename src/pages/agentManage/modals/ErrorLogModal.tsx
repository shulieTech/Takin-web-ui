import React, { Fragment, useEffect } from 'react';
import { CommonModal, CommonSelect, CommonTable, useStateReducer } from 'racc';
import { ColumnProps } from 'antd/lib/table';
import { Button, Col, DatePicker, Icon, Modal, Pagination, Row } from 'antd';
import { customColumnProps } from 'src/components/custom-table/utils';
import CustomTable from 'src/components/custom-table';
import { connect } from 'dva';
import AgentManageService from '../service';
import Search from 'antd/lib/input/Search';
import CustomDescriptions from 'src/common/custom-descriptions/CustomDescriptions';
import moment from 'moment';
import ErrorInfoModal from './ErrorInfoModal';

interface Props {
  btnText?: string | React.ReactNode;
  agentId: string;
  ip: string;
  progressId: string;
  projectName: string;
  dictionaryMap?: any;
}
const { RangePicker } = DatePicker;

const getInitState = () => ({
  searchParams: {
    current: 0,
    pageSize: 10
  },
  total: 0,
  data: null,
  searchInputValue: undefined,
  startTime: moment().subtract(7, 'days'),
  endTime: moment().subtract(0, 'days'),
  disabledStartTime: moment().subtract(7, 'days')
});
export type SelectVersionState = ReturnType<typeof getInitState>;
const ErrorLogModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());
  const { agentId } = props;

  const handleClick = () => {
    queryErrorLogList({
      agentId,
      projectName: props.projectName,
      startDate: state.startTime.format('YYYY-MM-DD HH:mm:ss'),
      endDate: state.endTime.format('YYYY-MM-DD HH:mm:ss'),
      keyword: state.searchInputValue,
      current: state.searchParams.current,
      pageSize: state.searchParams.pageSize
    });
  };

  /**
   * @name 获取异常日志列表
   */
  const queryErrorLogList = async value => {
    const {
      total,
      data: { success, data }
    } = await AgentManageService.queryErrorLogList({
      ...value
    });
    if (success) {
      setState({
        total,
        data
      });
    }
  };

  const handleChange = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: current - 1
      }
    });
    queryErrorLogList({
      agentId,
      pageSize,
      projectName: props.projectName,
      startDate: state.startTime.format('YYYY-MM-DD HH:mm:ss'),
      endDate: state.endTime.format('YYYY-MM-DD HH:mm:ss'),
      keyword: state.searchInputValue,
      current: current - 1
    });
  };

  const handlePageSizeChange = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: 0
      }
    });
    queryErrorLogList({
      agentId,
      pageSize,
      projectName: props.projectName,
      startDate: state.startTime.format('YYYY-MM-DD HH:mm:ss'),
      endDate: state.endTime.format('YYYY-MM-DD HH:mm:ss'),
      keyword: state.searchInputValue,
      current: 0
    });
  };

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '异常日志',
        dataIndex: 'agentInfo',
        width: 500,
        render: text => {
          return (
            <Fragment>
              <div
                style={{
                  display: 'inline-block',
                  width: 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {text}
              </div>
              <ErrorInfoModal errorInfo={text} btnText="查看异常" />
            </Fragment>
          );
        }
      },
      {
        ...customColumnProps,
        title: '发生时间',
        dataIndex: 'agentTimestamp'
      }
    ];
  };

  const handleChangeTime = (dates, dateStrings) => {
    setState({
      startTime: dates[0],
      endTime: dates[1]
    });
    queryErrorLogList({
      agentId,
      projectName: props.projectName,
      startDate: dates[0].format('YYYY-MM-DD HH:mm:ss'),
      endDate: dates[1].format('YYYY-MM-DD HH:mm:ss'),
      keyword: state.searchInputValue,
      current: 0,
      pageSize: state.searchParams.pageSize
    });
  };

  const onCalendarChange = dates => {
    setState({
      disabledStartTime: dates[0]
    });
  };
  /**
   * @name 禁用日期（开始时间7天以内可选）
   */
  const disabledDate = current => {
    return current && current > moment(state.disabledStartTime).add(7, 'day');
  };

  return (
    <CommonModal
      modalProps={{
        width: 960,
        title: '异常日志',
        footer: null
      }}
      btnProps={{ type: 'link' }}
      btnText={props.btnText}
      onClick={() => handleClick()}
    >
      <CustomDescriptions
        title={`AgentID:${props.agentId}`}
        dataSource={[
          {
            label: 'IP',
            value: props.ip
          },
          { label: '进程号', value: props.progressId },
          { label: '应用', value: props.projectName }
        ]}
      />
      <div style={{ minHeight: 400, marginTop: 10 }}>
        <Row
          type="flex"
          align="middle"
          justify="space-between"
          style={{ marginBottom: 20 }}
        >
          <Col span={6}>
            <Search
              placeholder="搜索日志关键字"
              enterButton
              onSearch={() => {
                queryErrorLogList({
                  agentId,
                  projectName: props.projectName,
                  startDate: state.startTime.format('YYYY-MM-DD HH:mm:ss'),
                  endDate: state.endTime.format('YYYY-MM-DD HH:mm:ss'),
                  keyword: state.searchInputValue,
                  current: 0,
                  pageSize: state.searchParams.pageSize
                });
                setState({
                  searchParams: {
                    ...state.searchParams,
                    current: 0
                  }
                });
              }}
              onChange={e =>
                setState({
                  searchInputValue: e.target.value
                })
              }
              value={state.searchInputValue}
            />
          </Col>
          <Col>
            <Button
              type="link"
              style={{ marginRight: 16 }}
              onClick={() => {
                setState({
                  searchInputValue: undefined,
                  searchParams: {
                    pageSize: 10,
                    current: 0
                  },
                  startTime: moment().subtract(7, 'days'),
                  endTime: moment().subtract(0, 'days'),
                  disabledStartTime: moment().subtract(7, 'days')
                });
                queryErrorLogList({
                  agentId,
                  projectName: props.projectName,
                  startDate: moment()
                    .subtract(7, 'days')
                    .format('YYYY-MM-DD HH:mm:ss'),
                  endDate: moment()
                    .subtract(0, 'days')
                    .format('YYYY-MM-DD HH:mm:ss'),
                  keyword: undefined,
                  current: 0,
                  pageSize: 10
                });
              }}
            >
              重置
            </Button>
            <RangePicker
              allowClear={false}
              style={{ width: 220, marginRight: 8 }}
              disabledDate={disabledDate}
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [
                  moment('00:00:00', 'HH:mm:ss'),
                  moment('11:59:59', 'HH:mm:ss')
                ]
              }}
              format="YYYY-MM-DD HH:mm:ss"
              value={[state.startTime, state.endTime]}
              onChange={handleChangeTime}
              onCalendarChange={onCalendarChange}
            />
            <Icon
              onClick={() => {
                setState({
                  searchParams: {
                    pageSize: 10,
                    current: 0
                  }
                });
                queryErrorLogList({
                  agentId,
                  projectName: props.projectName,
                  startDate: state.startTime.format('YYYY-MM-DD HH:mm:ss'),
                  endDate: state.endTime.format('YYYY-MM-DD HH:mm:ss'),
                  keyword: state.searchInputValue,
                  current: 0,
                  pageSize: state.searchParams.pageSize
                });
              }}
              type="redo"
            />
          </Col>
        </Row>
        <CustomTable
          rowKey="id"
          columns={getColumns()}
          size="small"
          dataSource={state.data ? state.data : []}
          scroll={{ y: 400 }}
        />
        <Pagination
          style={{ marginTop: 20, textAlign: 'right' }}
          total={state.total}
          current={state.searchParams.current + 1}
          pageSize={state.searchParams.pageSize}
          showTotal={(t, range) =>
            `共 ${state.total} 条数据 第${state.searchParams.current +
              1}页 / 共 ${Math.ceil(
              state.total / (state.searchParams.pageSize || 10)
            )}页`
          }
          showSizeChanger={true}
          onChange={(current, pageSize) => handleChange(current, pageSize)}
          onShowSizeChange={handlePageSizeChange}
        />
      </div>
    </CommonModal>
  );
};
export default connect(({ common }) => ({ ...common }))(ErrorLogModal);
