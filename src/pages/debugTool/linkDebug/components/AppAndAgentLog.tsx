import {
  Button,
  Cascader,
  Col,
  Input,
  message,
  Pagination,
  Radio,
  Row,
  Spin
} from 'antd';
import { CommonForm, CommonSelect, useStateReducer } from 'racc';
import { filterCascaderOptions } from 'src/utils/utils';
import React, { Fragment, useEffect } from 'react';
import CodeMirrorLog from './CodeMirrorLog';
import LinkDebugService from '../service';
import CodeMirrorWrapper from 'src/common/code-mirror-rapper/CodeMirrorWrapper';
import styles from './../index.less';

interface Props {
  traceId: string;
}
const getInitState = () => ({
  logType: 'app' as 'app' | 'agent',
  agentLogFileList: null,
  selectFileName: null,
  agentId: undefined,
  appName: undefined,
  filePath: null,
  appAndAgentId: null,
  appLog: null,
  agentLog: null,
  total: 0,
  pageSize: 100,
  current: 0,
  loading: false,
  codeLoading: false
});
export type AppAndAgentLogState = ReturnType<typeof getInitState>;
const AppAndAgentLog: React.FC<Props> = props => {
  const { traceId } = props;
  const [state, setState] = useStateReducer<AppAndAgentLogState>(
    getInitState()
  );
  const { agentId, appName, filePath } = state;
  let count = 0;

  useEffect(() => {
    queryAppAndAgent({ traceId });
  }, []);
  /**
   * @name 切换agent日志
   */
  const handleChange = value => {
    setState({
      logType: value
    });
    handleReset();
  };

  const handleSelectFileName = value => {
    setState({
      selectFileName: value,
      current: 0,
      total: 0
    });

    handleAgentLog({
      agentId,
      appName,
      traceId,
      fileName: value,
      current: 0,
      pageSize: state.pageSize
    });
  };

  const handleChangeFilePath = value => {
    setState({
      filePath: value
    });
  };

  const handleChangeCascader = value => {
    setState({
      appName: value && value[0],
      agentId: value && value[1]
    });
  };

  /**
   * @name 获取应用实例
   */
  const queryAppAndAgent = async value => {
    const {
      data: { success, data }
    } = await LinkDebugService.queryAppAndAgent({ ...value });
    if (success) {
      setState({
        appAndAgentId: data
      });
    }
  };

  /**
   * @name 获取agent日志文件
   */
  const queryAgentLogFile = async value => {
    setState({
      loading: true
    });
    const {
      data: { success, data }
    } = await LinkDebugService.queryAgentLogFileName({ ...value });
    if (success) {
      if (data && data.status === 'PULLING') {
        count = count + 1;
        setState({
          loading: true
        });
        if (count < 3) {
          setTimeout(() => queryAgentLogFile(value), 2000);
          return;
        }
        setState({
          loading: false
        });
        message.config({
          top: 100
          // icon: icon: <img src={require('./../../../../assets/message_error.png')} />,
        });
        message.error('获取日志失败，请重新获取!');

        return;
      }
      setState({
        loading: false,
        agentLogFileList: data && data.fileNames
      });
      return;
    }
    setState({
      loading: false
    });
  };

  /**
   * @name 获取agent日志
   */
  const handleAgentLog = async value => {
    setState({
      codeLoading: true,
      agentLog: null
    });
    const {
      total,
      data: { success, data }
    } = await LinkDebugService.queryAgentLog({
      ...value
    });
    if (success) {
      setState({
        total,
        agentLog: data && data[0] && data[0].content,
        codeLoading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };

  const handleGetAppLog = () => {
    queryAppLog({
      agentId,
      appName,
      filePath,
      traceId,
      current: state.current,
      pageSize: state.pageSize
    });
  };

  const handleChangePage = (current, pageSize) => {
    setState({
      current: current - 1
    });
    if (state.logType === 'app') {
      queryAppLog({
        agentId,
        appName,
        filePath,
        traceId,
        pageSize,
        current: current - 1
      });
      return;
    }
    handleAgentLog({
      agentId,
      appName,
      traceId,
      pageSize,
      fileName: state.selectFileName,
      current: current - 1
    });
  };

  /**
   * @name 获取应用日志
   */
  const queryAppLog = async value => {
    setState({
      loading: true,
      codeLoading: true,
      appLog: null
    });
    const {
      total,
      data: { success, data }
    } = await LinkDebugService.queryAppLog({
      ...value
    });
    if (success) {
      if (data && data[0] && data[0].logPullStatus === 'PULLING') {
        count = count + 1;
        setState({
          loading: true,
          codeLoading: true
        });
        if (count < 3) {
          setTimeout(() => queryAppLog(value), 2000);
          return;
        }
        setState({
          loading: false,
          codeLoading: false
        });
        message.error('获取日志失败，请重新获取!');
        return;
      }
      setState({
        total,
        loading: false,
        codeLoading: false,
        appLog: data && data[0] && data[0].content
      });
      return;
    }
    setState({
      loading: false,
      codeLoading: false
    });
  };

  const handleReset = () => {
    setState({
      appLog: null,
      appName: null,
      agentId: null,
      filePath: null,
      agentLogFileList: null,
      current: 0,
      total: 0,
      agentLog: null,
      selectFileName: null
    });
  };

  return (
    <Fragment>
      <div>
        <Radio.Group
          value={state.logType}
          buttonStyle="outline"
          onChange={e => handleChange(e.target.value)}
        >
          <Radio.Button value="app">应用日志</Radio.Button>
          <Radio.Button style={{ marginLeft: 16 }} value="agent">
            Agent日志
          </Radio.Button>
        </Radio.Group>
      </div>
      {state.logType === 'app' ? (
        <Row align="middle" type="flex" gutter={16} style={{ marginTop: 16 }}>
          <Col>
            <Cascader
              options={state.appAndAgentId || []}
              // changeOnSelect
              placeholder="应用/实例"
              showSearch={{ filter: filterCascaderOptions }}
              onChange={handleChangeCascader}
              value={
                state.appName && state.agentId
                  ? [state.appName, state.agentId]
                  : undefined
              }
            />
          </Col>
          <Col span={8}>
            <Input
              value={state.filePath}
              placeholder="请输入日志路径"
              disabled={state.agentId && state.appName ? false : true}
              onChange={e => handleChangeFilePath(e.target.value)}
            />
          </Col>
          <Col>
            <Button
              loading={state.loading}
              type="primary"
              disabled={state.filePath ? false : true}
              onClick={handleGetAppLog}
            >
              {state.loading ? '获取日志中...' : '获取日志'}
            </Button>
          </Col>
          <Col>
            <Button
              type="link"
              style={{ color: '#8C8C8C' }}
              onClick={handleReset}
            >
              重置
            </Button>
          </Col>
        </Row>
      ) : (
        <Fragment>
          <Row align="middle" type="flex" gutter={16} style={{ marginTop: 16 }}>
            <Col>
              <Cascader
                options={state.appAndAgentId || []}
                // changeOnSelect
                placeholder="应用/实例"
                showSearch={{ filter: filterCascaderOptions }}
                onChange={handleChangeCascader}
                value={
                  state.appName && state.agentId
                    ? [state.appName, state.agentId]
                    : undefined
                }
              />
            </Col>
            <Col>
              <Button
                loading={state.loading}
                type="primary"
                disabled={state.appName && state.agentId ? false : true}
                onClick={() =>
                  queryAgentLogFile({
                    agentId,
                    appName,
                    traceId
                  })
                }
              >
                {state.loading ? '日志拉取中...' : '获取日志文件'}
              </Button>
            </Col>
          </Row>
          {state.agentLogFileList && state.agentLogFileList.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Radio.Group
                value={state.selectFileName}
                buttonStyle="outline"
                onChange={e => handleSelectFileName(e.target.value)}
              >
                {state.agentLogFileList.map((item, key) => {
                  return (
                    <Radio.Button key={key} value={item}>
                      {item}
                    </Radio.Button>
                  );
                })}
              </Radio.Group>
            </div>
          )}
        </Fragment>
      )}
      <Row style={{ marginTop: 16 }}>
        <Pagination
          total={state.total}
          current={state.current + 1}
          pageSize={state.pageSize}
          onChange={(current, pageSize) => handleChangePage(current, pageSize)}
          disabled={agentId && appName ? false : true}
        />
      </Row>

      <div
        className={styles.logWrap}
        style={{ marginTop: 16, position: 'relative' }}
      >
        {state.codeLoading ? (
          <Spin tip="Loading...">
            <CodeMirrorWrapper
              onChange={() => true}
              value={state.logType === 'app' ? state.appLog : state.agentLog}
              placeholder={`点击「获取日志」后此区域加载日志`}
              restProps={{ readOnly: 'nocursor' }}
            />
          </Spin>
        ) : (
          <CodeMirrorWrapper
            onChange={() => true}
            value={state.logType === 'app' ? state.appLog : state.agentLog}
            placeholder={`点击「获取日志」后此区域加载日志`}
            restProps={{ readOnly: 'nocursor' }}
          />
        )}
      </div>
    </Fragment>
  );
};
export default AppAndAgentLog;
