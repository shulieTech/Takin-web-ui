import React, { Fragment, useEffect } from 'react';
import { CommonModal, CommonSelect, CommonTable, useStateReducer } from 'racc';
import { ColumnProps } from 'antd/lib/table';
import { Button, Col, DatePicker, Icon, Modal, Pagination, Row } from 'antd';
import { customColumnProps } from 'src/components/custom-table/utils';
import CustomTable from 'src/components/custom-table';
import { connect } from 'dva';
import Search from 'antd/lib/input/Search';
import AgentSwitchService from '../service';

interface Props {
  btnText?: string | React.ReactNode;
  dictionaryMap?: any;
  state: any;
  setState: (value) => void;
}

const InoperativeNodeModal: React.FC<Props> = props => {
  const { state, setState } = props;

  const handleClick = () => {
    queryInoperativeNode({
      bizType: 0,
      appName: state.searchInputValue
    });
  };

  /**
   * @name 获取未生效应用节点
   */
  const queryInoperativeNode = async value => {
    const {
      data: { success, data }
    } = await AgentSwitchService.queryInoperativeNode({
      ...value
    });
    if (success) {
      setState({
        inoperativeNodeData: data
      });
    }
  };

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: 'Agent ID',
        dataIndex: 'agentId'
      },
      {
        ...customColumnProps,
        title: '应用',
        dataIndex: 'applicationName'
      }
    ];
  };

  return (
    <CommonModal
      modalProps={{
        width: 960,
        title: '未生效应用节点',
        footer: null
      }}
      btnProps={{ type: 'link' }}
      btnText={props.btnText}
      onClick={() => handleClick()}
    >
      <div style={{ minHeight: 500, marginTop: 10 }}>
        <Row
          type="flex"
          align="middle"
          justify="space-between"
          style={{ marginBottom: 20 }}
        >
          <Col span={6}>
            <Search
              placeholder="搜索应用名称"
              enterButton
              onSearch={() => {
                queryInoperativeNode({
                  bizType: 0,
                  appName: state.searchInputValue
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
                queryInoperativeNode({
                  bizType: 0,
                  appName: undefined
                });
                setState({
                  searchInputValue: undefined
                });
              }}
            >
              重置
            </Button>
            <Icon
              onClick={() => {
                queryInoperativeNode({
                  bizType: 0,
                  appName: state.searchInputValue
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
          dataSource={state.inoperativeNodeData || []}
          scroll={{ y: 500 }}
        />
      </div>
    </CommonModal>
  );
};
export default connect(({ common }) => ({ ...common }))(InoperativeNodeModal);
