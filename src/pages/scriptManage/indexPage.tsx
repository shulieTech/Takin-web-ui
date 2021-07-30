import { Col, Modal, Row } from 'antd';
import { useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import SearchTable from 'src/components/search-table';
import BusinessFlowService from '../businessFlow/service';
import getScriptManageFormData from './components/ScriptManageSearch';
import getScriptManageColumns from './components/ScriptManageTable';
import ScriptManageTableAction from './components/ScriptManageTableAction';
import ScriptManageService from './service';
import styles from './index.less';

interface ScriptManageProps {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
  location?: any;
}

export interface ScriptManageState {
  switchStatus: string;
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
  searchParamss?: any;
  businessActivityList: any[];
  businessFlowList: any[];
  tagList: any[];
  debugStatus: number;
  isShowDebugModal: boolean;
  scriptDebugId: number;
  errorInfo: any;
}

const ScriptManage: React.FC<ScriptManageProps> = props => {
  const [state, setState] = useStateReducer<ScriptManageState>({
    isReload: false,
    switchStatus: null,
    searchParams: {
      current: 0,
      pageSize: 10
    },
    searchParamss: props.location.query,
    businessActivityList: null,
    businessFlowList: null,
    tagList: null,
    isShowDebugModal: false,
    scriptDebugId: undefined, // 脚本调试id
    debugStatus: 0, // 调试状态，0：未开始, 1：通过第二阶段， 2，3：通过第三阶段，4：通过第四阶段,
    errorInfo: null
  });

  useEffect(() => {
    queryBussinessActive();
    querybusinessFlowList();
    queryTagList();
  }, []);

  /**
   * @name 获取所有业务活动
   */
  const queryBussinessActive = async () => {
    const {
      data: { success, data }
    } = await BusinessFlowService.queryBussinessActive({});
    if (success) {
      setState({
        businessActivityList:
          data &&
          data.map(item => {
            return { label: item.businessActiveName, value: item.id };
          })
      });
    }
  };

  /**
   * @name 获取所有业务流程
   */
  const querybusinessFlowList = async () => {
    const {
      data: { success, data }
    } = await ScriptManageService.queryBusinessFlow({});
    if (success) {
      setState({
        businessFlowList:
          data &&
          data.map(item => {
            return { label: item.businessFlowName, value: item.id };
          })
      });
    }
  };

  /**
   * @name 获取所有标签列表
   */
  const queryTagList = async () => {
    const {
      data: { success, data }
    } = await ScriptManageService.queryScriptTagList({});
    if (success) {
      setState({
        tagList:
          data &&
          data.map(item => {
            return { label: item.tagName, value: item.id };
          })
      });
    }
  };

  const progressData = [
    {
      key: 1,
      imgSrc: 'debug_process_1',
      name: '应用配置校验'
    },
    {
      key: 2,
      imgSrc: 'debug_process_2',
      name: 'JMeter启动校验'
    },
    {
      key: 3,
      imgSrc: 'debug_process_3',
      name: '收集数据'
    },
    {
      key: 4,
      imgSrc: 'debug_process_4',
      name: '验证数据'
    }
  ];

  return (
    <Fragment>
      <SearchTable
        key="id"
        commonTableProps={{
          columns: getScriptManageColumns(state, setState)
          // rowClassName: () => 'show-row'
        }}
        commonFormProps={{
          formData: getScriptManageFormData(state, setState),
          rowNum: 6
        }}
        ajaxProps={{ url: '/scriptManage/list', method: 'POST' }}
        searchParams={state.searchParamss}
        toggleRoload={state.isReload}
        tableAction={
          <ScriptManageTableAction state={state} setState={setState} />}
      />
      <Modal
        width={710}
        title={`${
          (!state.scriptDebugId && state.debugStatus !== 0) ||
          state.debugStatus === 5
            ? '调试异常'
            : '调试'
        }`}
        footer={null}
        visible={state.isShowDebugModal}
        closable={
          (!state.scriptDebugId && state.debugStatus !== 0) ||
          state.debugStatus === 5
            ? true
            : false
        }
        maskClosable={false}
        onCancel={() => {
          setState({
            isShowDebugModal: false,
            scriptDebugId: undefined,
            debugStatus: 0,
            errorInfo: null
          });
        }}
      >
        {(!state.scriptDebugId && state.debugStatus !== 0) ||
        state.debugStatus === 5 ? (
          <div style={{ height: 400, overflow: 'scroll' }}>
            {state.errorInfo &&
              state.errorInfo.map((item, k) => {
                return (
                  <p key={k} style={{ fontSize: 16 }}>
                    {k + 1}、{item}
                  </p>
                );
              })}
          </div>
        ) : (
          <Row type="flex" style={{ padding: '50px 10px' }}>
            {progressData.map((item, k) => {
              return (
                <Fragment key={k}>
                  <Col>
                    <div
                      className={styles.progressCircle}
                      style={{
                        borderColor:
                          (state.debugStatus <= 2 && k <= state.debugStatus) ||
                          (state.debugStatus === 3 &&
                            k + 1 <= state.debugStatus) ||
                          state.debugStatus === 4
                            ? '#28C6D7'
                            : '#D9D9D9'
                      }}
                    >
                      <img
                        style={{ width: 36 }}
                        src={require(`./../../assets/${item.imgSrc}${
                          (state.debugStatus <= 2 && k <= state.debugStatus) ||
                          (state.debugStatus === 3 &&
                            k + 1 <= state.debugStatus) ||
                          state.debugStatus === 4
                            ? '_active'
                            : ''
                        }.png`)}
                      />
                    </div>
                    <p className={styles.progressName}>{item.name}</p>
                  </Col>
                  {k !== progressData.length - 1 && (
                    <Col style={{ margin: '0px 5px' }}>
                      <div
                        className={styles.dashedLine}
                        style={{
                          borderColor:
                            k <= state.debugStatus ? '#28C6D7' : '#D9D9D9'
                        }}
                      />
                    </Col>
                  )}
                </Fragment>
              );
            })}
          </Row>
        )}
      </Modal>
    </Fragment>
  );
};
export default ScriptManage;
