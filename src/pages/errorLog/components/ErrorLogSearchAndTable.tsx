/**
 * @author chuxu
 */
import { Button, Col, DatePicker, Icon, Pagination, Row } from 'antd';
import React, { Fragment, useContext, useEffect } from 'react';
import CustomTable from 'src/components/custom-table';
import { ErrorLogContext } from '../indexPage';
import ErrorLogService from '../service';
import getErrorLogColumns from './ErrorLogColumns';
import RemoteSelect from 'src/common/remote-select';
import moment from 'moment';
import commonStyles from './../../../custom.less';
import Search from 'antd/lib/input/Search';

interface Props {}
const { RangePicker } = DatePicker;

const ErrorLogSearchAndTable: React.FC<Props> = props => {
  const { state, setState } = useContext(ErrorLogContext);
  useEffect(() => {
    queryErrorLogList({
      ...state.searchParams,
      keyword: state.logValue,
      agentId: state.agentIdValue,
      projectName: state.searchInputValue,
      startDate: state.startTime.format('YYYY-MM-DD HH:mm:ss'),
      endDate: state.endTime.format('YYYY-MM-DD HH:mm:ss')
    });
  }, [
    state.isReload,
    state.searchParams.current,
    state.searchParams.pageSize,
    state.searchInputValue,
    state.startTime,
    state.endTime
  ]);

  /**
   * @name 获取异常日志列表
   */
  const queryErrorLogList = async value => {
    setState({
      loading: true
    });
    const {
      total,
      data: { success, data }
    } = await ErrorLogService.queryErrorLogList({
      ...value
    });
    if (success) {
      setState({
        total,
        dataSource: data,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };

  const handleChangePage = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: current - 1
      }
    });
  };

  const handlePageSizeChange = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: 0
      }
    });
  };

  const handleChangeTime = (dates, dateStrings) => {
    setState({
      startTime: dates[0],
      endTime: dates[1],
      searchParams: {
        pageSize: state.searchParams.pageSize,
        current: 0
      }
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
    <div
      className={commonStyles.borders}
      style={{
        marginTop: 16,
        height: 'calc(100% - 100px)',
        overflow: 'scroll'
      }}
    >
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        style={{ marginBottom: 20 }}
      >
        <Col span={16}>
          <Row>
            <Col span={6}>
              <RemoteSelect
                isArray={true}
                ajaxProps={{
                  method: 'GET',
                  url: '/fast/agent/access/config/allApplication'
                }}
                paramsKey="keyword"
                placeholder="搜索应用"
                value={state.searchInputValue}
                onSelect={() => {
                  setState({
                    isReload: !state.isReload,
                    searchParams: {
                      pageSize: state.searchParams.pageSize,
                      current: 0
                    }
                  });
                }}
                onChange={value => {
                  return setState({
                    searchInputValue: value && value.trim()
                  });
                }}
              />
            </Col>
            <Col span={6} style={{ marginLeft: 16 }}>
              <Search
                placeholder="搜索Agent Id"
                enterButton
                onSearch={() => {
                  setState({
                    isReload: !state.isReload,
                    searchParams: {
                      pageSize: state.searchParams.pageSize,
                      current: 0
                    }
                  });
                }}
                onChange={e =>
                  setState({
                    agentIdValue: e.target.value && e.target.value.trim()
                  })
                }
                value={state.agentIdValue}
              />
            </Col>
            <Col span={6} style={{ marginLeft: 16 }}>
              <Search
                placeholder="搜索日志关键字"
                enterButton
                onSearch={() => {
                  setState({
                    isReload: !state.isReload,
                    searchParams: {
                      pageSize: state.searchParams.pageSize,
                      current: 0
                    }
                  });
                }}
                onChange={e =>
                  setState({
                    logValue: e.target.value && e.target.value.trim()
                  })
                }
                value={state.logValue}
              />
            </Col>
          </Row>
        </Col>

        <Col>
          <Button
            type="link"
            style={{ marginRight: 16 }}
            onClick={() => {
              setState({
                searchInputValue: undefined,
                agentIdValue: undefined,
                logValue: undefined,
                isReload: !state.isReload,
                startTime: moment().subtract(7, 'days'),
                endTime: moment().subtract(0, 'days'),
                disabledStartTime: moment().subtract(7, 'days'),
                searchParams: {
                  current: 0,
                  pageSize: 10
                }
              });
            }}
          >
            重置
          </Button>
          <RangePicker
            style={{ width: 200, marginRight: 8 }}
            allowClear={false}
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
                searchInputValue: undefined,
                isReload: !state.isReload,
                searchParams: {
                  current: 0,
                  pageSize: 10
                }
              });
            }}
            type="redo"
          />
        </Col>
      </Row>
      <div
        style={{
          position: 'relative',
          height: 'calc(100% - 55px)',
          overflow: 'scroll'
        }}
      >
        <div
          style={{
            position: 'relative',
            height: 'calc(100% - 30px)',
            overflow: 'scroll'
          }}
        >
          <CustomTable
            rowKey={(row, index) => index.toString()}
            loading={state.loading}
            columns={getErrorLogColumns(state, setState)}
            dataSource={state.dataSource || []}
            style={{ paddingBottom: 30 }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            padding: '8px 16px',
            bottom: 0,
            right: 0,
            width: '100%',
            background: '#fff'
          }}
        >
          <Pagination
            style={{
              float: 'right'
            }}
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
            onChange={(current, pageSize) =>
              handleChangePage(current, pageSize)
            }
            onShowSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </div>
  );
};
export default ErrorLogSearchAndTable;
