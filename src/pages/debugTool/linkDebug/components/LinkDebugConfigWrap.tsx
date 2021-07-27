import { Button, Col, message, Modal, Row, Tabs } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { CommonForm, CommonSelect, useStateReducer } from 'racc';
import React, { Fragment } from 'react';
import { router } from 'umi';
import { LinkDebugState } from '../indexPage';
import LinkDebugService from '../service';
import styles from './../index.less';
import ConfigBody from './ConfigBody';
import ConfigCookie from './ConfigCookie';
import ConfigHeader from './ConfigHeader';
import DataValidationWrap from './DataValidationWrap';
import getDebugConfigFormData from './DebugConfigFormData';
interface Props {
  state?: LinkDebugState;
  setState?: (value) => void;
  dictionaryMap?: any;
}

const getInitState = () => ({
  saveLoading: false
});
export type LoadingState = ReturnType<typeof getInitState>;
const LinkDebugConfigWrap: React.FC<Props> = props => {
  const { state, setState, dictionaryMap } = props;
  const { confirm } = Modal;

  const [loadingState, setLoadingState] = useStateReducer<LoadingState>(
    getInitState()
  );

  const initState = {
    linkDebugConfigList: [],
    linkDebugConfigDetail: {} as any,
    // form: null as WrappedFormUtils,
    isRedirect: true,
    headers: null,
    radio: 0,
    codingFormat: 'UTF-8',
    type: 'application/json',
    // bussinessActiveList: null,
    body: null,
    cookies: null,
    /** 选中的历史配置id */
    selectedId: null,
    isReload: false,
    listLoading: false,
    configLoading: false,
    pageStatus: 'add' as 'add' | 'edit' | 'query' | 'clone',
    /** 页面内容是否被修改过，修改过需要弹窗提示 */
    isChanged: false,
    /** 历史配置搜索条件 */
    searchParams: null,
    total: 0,
    pageSize: 10,
    current: 0,
    missingDataList: null
  };

  /**
   * @name 保存链路调试配置
   */
  const handleSave = async () => {
    return await new Promise(resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.config({
            top: 100
          });

          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }

        let result = {};
        result = {
          ...values,
          headers: state.headers,
          body: state.body,
          cookies: state.cookies,
          contentTypeVo: {
            codingFormat: state.codingFormat,
            radio: state.radio,
            type: state.type
          }
        };
        // console.log(result);

        if (state.pageStatus === 'edit') {
          const {
            // tslint:disable-next-line:no-shadowed-variable
            data: { success, data }
          } = await LinkDebugService.editDebugConfig({
            ...result,
            id: state.selectedId
          });
          if (success) {
            message.success('编辑成功');
            setState({
              ...initState,
              searchParams: state.searchParams,
              isReload: !state.isReload
            });

            state.form.resetFields();
            resolve(true);
          }
          return;
        }

        const {
          data: { success, data }
        } = await LinkDebugService.addDebugConfig({
          ...result
        });
        if (success) {
          message.success('操作成功');
          setState({
            ...initState,
            searchParams: state.searchParams,
            isReload: !state.isReload
          });
          state.form.resetFields();
          resolve(true);
        }
        resolve(false);
      });
    });
  };

  /**
   * @name 克隆
   */
  const handleClone = id => {
    setState({
      pageStatus: 'clone'
    });
  };

  const handleEdit = () => {
    setState({
      pageStatus: 'edit'
    });
  };

  const handleDelete = () => {
    showDeleteConfirm();
  };

  const showDeleteConfirm = () => {
    confirm({
      icon: null,
      title: '删除配置',
      content: '配置删除后不影响对应的调试结果，确定删除吗？',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteLinkDebugConfig();
      }
    });
  };

  const showDebugConfirm = () => {
    /** 已有配置，直接调试 */
    if (state.pageStatus === 'query') {
      confirm({
        icon: null,
        title: '是否确认开始调试？',
        content:
          '调试会发起调试流量，调试时间大约持续 1 分钟，期间会收集调试日志数据。',
        okText: '确认调试',
        cancelText: '取消',
        onOk() {
          debug();
        }
      });
    }

    if (state.pageStatus === 'add' || state.pageStatus === 'clone') {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          return false;
        }
        confirm({
          icon: null,
          title: '是否确认开始调试？',
          content:
            '调试会发起调试流量，调试时间大约持续 1 分钟，期间会收集调试日志数据。',
          okText: '确认调试',
          cancelText: '取消',
          onOk() {
            addAndDebug();
          }
        });
      });
    }

    /** 新增配置，保存并调试 */
    if (state.pageStatus === 'edit') {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          return false;
        }
        confirm({
          icon: null,
          title: '是否确认开始调试？',
          content:
            '调试会发起调试流量，调试时间大约持续 1 分钟，期间会收集调试日志数据。',
          okText: '确认调试',
          cancelText: '取消',
          onOk() {
            editAndDebug();
          }
        });
      });
    }
  };

  const debug = async () => {
    const {
      data: { success, data }
    } = await LinkDebugService.debug({
      id: state.selectedId
    });
    if (success) {
      if (data && data.id) {
        router.push(`/debugTool/linkDebug/detail?id=${data.id}`);
        return;
      }
      message.error('没有返回详情id');
    }
  };

  const addAndDebug = async () => {
    state.form.validateFields(async (err, values) => {
      let result = {};
      result = {
        ...values,
        headers: state.headers,
        body: state.body,
        cookies: state.cookies,
        contentTypeVo: {
          codingFormat: state.codingFormat,
          radio: state.radio,
          type: state.type
        }
      };
      const {
        data: { success, data }
      } = await LinkDebugService.addAndDebug({
        ...result
      });
      if (success) {
        if (data && data.id) {
          router.push(`/debugTool/linkDebug/detail?id=${data.id}`);
          return;
        }
        message.error('没有返回详情id');
      }
    });
  };

  const editAndDebug = async () => {
    state.form.validateFields(async (err, values) => {
      let result = {};
      result = {
        ...values,
        id: state.selectedId,
        headers: state.headers,
        cookies: state.cookies,
        body: state.body,
        contentTypeVo: {
          codingFormat: state.codingFormat,
          radio: state.radio,
          type: state.type
        }
      };
      const {
        data: { success, data }
      } = await LinkDebugService.editAndDebug({
        ...result
      });
      if (success) {
        if (data && data.id) {
          router.push(`/debugTool/linkDebug/detail?id=${data.id}`);
          return;
        }
        message.error('没有返回详情id');
      }
    });
  };
  /**
   * @name 删除配置
   */
  const deleteLinkDebugConfig = async () => {
    setState({
      configLoading: true
    });
    const {
      data: { success, data }
    } = await LinkDebugService.deleteDebugConfig({
      id: state.selectedId
    });
    if (success) {
      setState({
        ...initState,
        searchParams: state.searchParams,
        isReload: !state.isReload
      });
      return;
    }
    setState({
      configLoading: false
    });
  };

  const configContentData = [
    {
      key: '1',
      title: 'Header',
      tabNode: (
        <ConfigHeader
          state={state}
          setState={setState}
          dictionaryMap={dictionaryMap}
        />
      )
    },
    {
      key: '2',
      title: 'Body',
      tabNode: (
        <ConfigBody
          state={state}
          setState={setState}
          dictionaryMap={dictionaryMap}
        />
      )
    },
    {
      key: '3',
      title: 'Cookies',
      tabNode: (
        <ConfigCookie
          state={state}
          setState={setState}
          dictionaryMap={dictionaryMap}
        />
      )
    },
    {
      key: '4',
      title: '数据验证',
      tabNode: (
        <DataValidationWrap
          missingData={state.missingDataList || []}
          type="debug"
        />
      )
    }
  ];

  return (
    <div className={styles.linkDebugConfigPage}>
      <div style={{ height: 'calc(100% - 56px)', overflow: 'scroll' }}>
        <Row type="flex" className={styles.linkDebugConfigHeader}>
          <Col>
            <Row>
              <Col className={styles.title}>
                {state.pageStatus === 'add' || state.pageStatus === 'clone'
                  ? '新建调试配置'
                  : state.pageStatus === 'edit'
                  ? '编辑调试配置'
                  : '查看调试配置'}
              </Col>
              <Col style={{ color: '#8C8C8C', lineHeight: '21px' }}>
                编辑完成后，点击「开始调试」会自动保存当前配置项
              </Col>
            </Row>
          </Col>
        </Row>
        <div style={{ padding: 16 }}>
          <div className={styles.formWrap}>
            <CommonForm
              getForm={form => setState({ form })}
              formData={getDebugConfigFormData(state, setState, dictionaryMap)}
              btnProps={{
                isResetBtn: false,
                isSubmitBtn: false
              }}
              rowNum={[2, 2, 1, 1]}
              // formItemProps={{
              //   labelCol: { span: 6 },
              //   wrapperCol: { span: 14 }
              // }}
            />
          </div>
          <div className={styles.configTabsWrap}>
            <Tabs defaultActiveKey="1">
              {configContentData.map((item, index) => {
                return (
                  <Tabs.TabPane
                    forceRender={true}
                    tab={item.title}
                    key={item.key}
                  >
                    {item.tabNode}
                  </Tabs.TabPane>
                );
              })}
            </Tabs>
          </div>
        </div>
      </div>
      <Row
        type="flex"
        justify="end"
        gutter={16}
        align="middle"
        className={styles.bottomWrap}
      >
        {state.pageStatus === 'query' && (
          <Col>
            <Button type="danger" onClick={handleDelete}>
              删除
            </Button>
          </Col>
        )}
        {state.pageStatus === 'query' && (
          <Col>
            <Button onClick={handleEdit}>编辑</Button>
          </Col>
        )}
        {state.pageStatus === 'query' && (
          <Col>
            <Button onClick={() => handleClone(state.selectedId)}>克隆</Button>
          </Col>
        )}
        {state.pageStatus !== 'query' && (
          <Col>
            <Button onClick={handleSave}>保存配置</Button>
          </Col>
        )}
        <Col>
          <Button type="primary" onClick={showDebugConfirm}>
            开始调试
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default LinkDebugConfigWrap;
