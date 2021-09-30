import React, { Fragment, useEffect } from 'react';
import { CommonModal, CommonSelect, CommonTable, useStateReducer } from 'racc';
import { ColumnProps } from 'antd/lib/table';
import { Badge, Button, Col, Descriptions, Icon, Row } from 'antd';
import { customColumnProps } from 'src/components/custom-table/utils';
import CustomTable from 'src/components/custom-table';
import { connect } from 'dva';
import AgentManageService from '../service';
import { agentPluginStatusColorMap, agentPluginStatusMap } from '../enum';
import Search from 'antd/lib/input/Search';
import CustomDescriptions from 'src/common/custom-descriptions/CustomDescriptions';
interface Props {
  btnText?: string | React.ReactNode;
  agentId: string;
  ip: string;
  progressId: string;
  projectName: string;
  dictionaryMap?: any;
}

const getInitState = () => ({
  isReload: false,
  originData: [],
  data: null,
  status: undefined,
  searchInputValue: undefined
});
export type SelectVersionState = ReturnType<typeof getInitState>;
const MiddlewareModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());
  const { dictionaryMap, agentId } = props;
  const { agent_plugin_status } = dictionaryMap;

  const handleClick = () => {
    queryMiddlewareList({ agentId });
  };

  useEffect(() => {
    filterData(state.originData);
  }, [state.status, state.isReload]);

  /**
   * @name 获取插件列表
   */
  const queryMiddlewareList = async value => {
    const {
      data: { success, data }
    } = await AgentManageService.queryMiddlewareList({
      ...value
    });
    if (success) {
      setState({
        data,
        originData: data
      });
    }
  };

  const filterData = dataSource => {
    if (!state.status && !state.searchInputValue) {
      setState({
        data: state.originData
      });
      return;
    }
    if (state.status && state.searchInputValue) {
      setState({
        data: dataSource.filter((item, k) => {
          return (
            item.moduleId.indexOf(state.searchInputValue) > -1 &&
            item.status === state.status
          );
        })
      });
      return;
    }
    setState({
      data: dataSource.filter((item, k) => {
        return (
          item.moduleId.indexOf(state.searchInputValue) > -1 ||
          item.status === state.status
        );
      })
    });
  };

  const handleChangeStatus = value => {
    setState({
      status: value
    });
  };

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '名称',
        dataIndex: 'moduleId'
      },
      {
        ...customColumnProps,
        title: '状态',
        dataIndex: 'status',
        render: (text, row) => {
          return (
            <Badge
              text={agentPluginStatusMap[text]}
              color={agentPluginStatusColorMap[text]}
            />
          );
        }
      }
    ];
  };

  return (
    <CommonModal
      modalProps={{
        width: 960,
        title: '插件信息',
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
              placeholder="搜索插件名称"
              enterButton
              onSearch={() =>
                setState({
                  isReload: !state.isReload
                })
              }
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
                  status: undefined,
                  searchInputValue: undefined,
                  isReload: !state.isReload
                });
              }}
            >
              重置
            </Button>
            <CommonSelect
              placeholder="状态:全部"
              style={{ width: 160, marginRight: 16 }}
              dataSource={agent_plugin_status || []}
              onChange={handleChangeStatus}
              value={state.status}
            />
            <Icon
              onClick={() => {
                setState({
                  isReload: !state.isReload
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
      </div>
    </CommonModal>
  );
};
export default connect(({ common }) => ({ ...common }))(MiddlewareModal);
