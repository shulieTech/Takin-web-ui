import { Divider, Icon, Spin } from 'antd';
import { useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import Loading from 'src/common/loading';
import FixedTopLayout from 'src/components/fixed-top-layout/FixedTopLayout';
import { Link } from 'umi';
import LinkDebugDetailWrap from './components/LinkDebugDetailWrap';
import LinkDebugService from './service';

interface Props extends DetailState {
  location?: any;
}
const getInitState = () => ({
  debugStatus: null as '调试中' | '失败' | '成功',
  debugResultDetail: null,
  tabKey: '0',
  isReload: false,
  pageLoading: false,
  missingDataList: null
});
export type DetailState = ReturnType<typeof getInitState>;
const LinkDebug: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<DetailState>(getInitState());
  const { location } = props;
  const { query } = location;
  const { id } = query;
  const { debugResultDetail } = state;

  useEffect(() => {
    queryDebugResultDetail({ id });
    queryResultMissingDataList({
      resultId: id
    });
  }, [state.isReload]);

  /**
   * @name 获取调试详情数据验证列表
   */
  const queryResultMissingDataList = async value => {
    const {
      data: { success, data }
    } = await LinkDebugService.queryResultMissingDataList({ ...value });
    if (success) {
      setState({
        missingDataList: data
      });
    }
  };

  /**
   * @name 获取链路调试结果详情
   */
  const queryDebugResultDetail = async value => {
    setState({
      pageLoading: true
    });
    const {
      data: { success, data }
    } = await LinkDebugService.queryDebugResultDetail({ ...value });
    if (success) {
      setState({
        debugResultDetail: data,
        debugStatus: data.status,
        tabKey: data.status === '成功' ? '1' : '0',
        pageLoading: false
      });
      if (data.status === '调试中') {
        setTimeout(() => {
          setState({
            isReload: !state.isReload
          });
        }, 5000);
      }
      return;
    }
    setState({
      pageLoading: false
    });
  };

  return debugResultDetail ? (
    <FixedTopLayout
      title={
        <div>
          {
            <Link to="/debugTool/linkDebug">
              <Icon type="left" />
              返回
            </Link>
          }
          <Divider type="vertical" />
          <span>{debugResultDetail.name}</span>
        </div>
      }
      extra={<div>{debugResultDetail.creatorName}</div>}
    >
      <div
        id="baseWrap"
        style={{ height: '100%', overflow: 'scroll', position: 'relative' }}
      >
        <LinkDebugDetailWrap state={state} id={id} setState={setState} />
        {state.pageLoading && (
          <div
            style={{
              position: 'absolute',
              top: 200,
              left: '50%'
            }}
          >
            {<Spin tip="加载中..." />}
          </div>
        )}
      </div>
    </FixedTopLayout>
  ) : (
    <Loading />
  );
};
export default LinkDebug;
