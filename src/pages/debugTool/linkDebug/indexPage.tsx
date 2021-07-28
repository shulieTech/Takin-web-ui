import { Col, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'dva';
import { useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import FixedTopLayout from 'src/components/fixed-top-layout/FixedTopLayout';
import { AppModelState } from 'src/models/app';
import { CommonModelState } from 'src/models/common';
import BusinessFlowService from 'src/pages/businessFlow/service';
import { Basic } from 'src/types';
import LinkDebugConfigList from './components/LinkDebugConfigList';
import LinkDebugConfigWrap from './components/LinkDebugConfigWrap';
import styles from './index.less';
import DebugResultListModal from './Modals/DebugResultListModal';
import LinkDebugService from './service';
interface Props extends Basic.BaseProps, CommonModelState, AppModelState {
  dictionaryMap?: any;
}
const getInitState = () => ({
  linkDebugConfigList: [],
  linkDebugConfigDetail: {} as any,
  form: null as WrappedFormUtils,
  isRedirect: true,
  headers: null,
  radio: 0,
  codingFormat: 'UTF-8',
  type: 'application/json',
  bussinessActiveList: null,
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
  searchParams: undefined,
  total: 0,
  pageSize: 10,
  current: 0,
  /** 数据验证列表 */
  missingDataList: null,
  businessLinkId: null
});
export type LinkDebugState = ReturnType<typeof getInitState>;
const LinkDebug: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<LinkDebugState>(getInitState());
  const { dictionaryMap } = props;

  useEffect(() => {
    queryLinkDebugConfigList({
      businessLinkId: state.searchParams,
      pageSize: state.pageSize,
      current: state.current
    });
  }, [state.isReload, state.searchParams, state.current]);

  useEffect(() => {
    if (state.selectedId) {
      queryLinkDebugConfigDetail();
      return;
    }
    if (state.selectedId && state.pageStatus === 'clone') {
      queryLinkDebugConfigDetail();
    }
  }, [state.selectedId, state.pageStatus]);

  useEffect(() => {
    queryBussinessActive();
    return () =>
      props.dispatch({
        type: 'app/updateState',
        payload: {
          debugToolId: undefined
        }
      });
  }, []);

  useEffect(() => {
    if (state.businessLinkId) {
      queryMissingDataList({ businessLinkId: state.businessLinkId });
    }
  }, [state.businessLinkId]);

  /**
   * @name 获取数据验证列表
   */
  const queryMissingDataList = async value => {
    const {
      data: { success, data }
    } = await LinkDebugService.queryMissingDataList({
      ...value
    });
    if (success) {
      setState({
        missingDataList: data
      });
    }
  };

  /**
   * @name 获取所有业务活动
   */
  const queryBussinessActive = async () => {
    const {
      data: { success, data }
    } = await BusinessFlowService.queryBussinessActive({});
    if (success) {
      setState({
        bussinessActiveList:
          data &&
          data.map(item => {
            return {
              label: item.businessActiveName,
              value: item.id.toString()
            };
          }),
        searchParams: props.debugToolId
      });
    }
  };

  /**
   * @name 获取历史配置
   */
  const queryLinkDebugConfigList = async value => {
    setState({
      listLoading: true
    });
    const {
      total,
      data: { success, data }
    } = await LinkDebugService.queryLinkDebugConfigList({ ...value });
    if (success) {
      let linkDebugConfigList = data;

      linkDebugConfigList = state.linkDebugConfigList.concat(data);
      const selectedId =
        linkDebugConfigList &&
        linkDebugConfigList[0] &&
        linkDebugConfigList[0].id;
      setState({
        total,
        linkDebugConfigList,
        listLoading: false
      });
      if (props.debugToolId) {
        setState({
          selectedId,
          pageStatus: selectedId ? 'query' : 'add'
        });
      }
      return;
    }
    setState({
      listLoading: false
    });
  };

  /**
   * @name 获取配置详情
   */
  const queryLinkDebugConfigDetail = async () => {
    setState({
      configLoading: true
    });
    const {
      data: { success, data }
    } = await LinkDebugService.queryLinkDebugConfigDetail({
      id: state.selectedId
    });
    if (success) {
      setState({
        linkDebugConfigDetail: data,
        isRedirect: data.isRedirect,
        headers: data.headers,
        radio: data.contentTypeVo && data.contentTypeVo.radio,
        codingFormat: data.contentTypeVo && data.contentTypeVo.codingFormat,
        type: data.contentTypeVo && data.contentTypeVo.type,
        body: data.body,
        cookies: data.cookies,
        configLoading: false,
        businessLinkId: data.businessLinkId
      });
      if (state.pageStatus === 'clone') {
        setState({
          selectedId: null
        });
      }
      return;
    }
    setState({
      configLoading: false
    });
  };

  return (
    <FixedTopLayout
      title="链路调试"
      extra={<DebugResultListModal btnText="调试结果历史" />}
    >
      <div className={styles.linkDebugWrap}>
        <Row type="flex" style={{ height: '100%' }}>
          <Col
            style={{
              width: 280,
              height: '100%',
              boxShadow: '0px 0px 12px 0px rgba(177, 192, 192, 0.45)',
              zIndex: 100
            }}
          >
            <LinkDebugConfigList state={state} setState={setState} />
          </Col>
          <Col
            style={{
              width: 'calc(100% - 280px)',
              height: '100%',
              overflow: 'scroll'
            }}
          >
            <LinkDebugConfigWrap
              state={state}
              setState={setState}
              dictionaryMap={dictionaryMap}
            />
          </Col>
        </Row>
      </div>
    </FixedTopLayout>
  );
};
export default connect(({ common, app }) => ({ ...common, ...app }))(LinkDebug);
