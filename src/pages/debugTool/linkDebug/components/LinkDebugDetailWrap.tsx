import { Row, Spin } from 'antd';
import React, { Fragment } from 'react';
import EmptyNode from 'src/common/empty-node';
import StepABaseInfo from 'src/pages/businessFlow/components/StepABaseInfo';
import { DetailState } from '../detailPage';
import styles from './../index.less';
import DetailTabsWrap from './DetailTabsWrap';
import LinkDebugDetailHeader from './LinkDebugDetailHeader';
import ReqResInfoWrap from './ReqResInfoWrap';

interface Props {
  state?: DetailState;
  setState?: (value) => void;
  id?: string;
}
const LinkDebugDetailWrap: React.FC<Props> = props => {
  const { state, id, setState } = props;
  const { debugResultDetail, debugStatus } = state;
  return (
    <div className={styles.linkDebugDetailBottom}>
      <div className={styles.linkDebugDetailWrap}>
        <div
          className={styles.linkDebugDetailBottomBg}
          style={{
            background:
              debugStatus === '失败'
                ? 'linear-gradient(360deg, #FFFFFF 20%, #FFE8E2 100%)'
                : debugStatus === '调试中'
                ? 'linear-gradient(360deg, #FEFEFE 20%, #F5F7F7 100%)'
                : ''
          }}
        >
          {(debugStatus === '成功' || debugStatus === '失败') && (
            <img
              style={{ width: 153, position: 'absolute', right: 20 }}
              src={require(`./../../../../assets/${
                debugStatus === '成功' ? 'success_img.png' : 'fail_img.png'
              }`)}
            />
          )}
          {debugStatus === '调试中' && (
            <span
              style={{
                fontSize: '35px',
                color: '#838B99',
                opacity: 0.1,
                position: 'absolute',
                right: 30,
                top: 20
              }}
            >
              调试中...
            </span>
          )}
        </div>
        <LinkDebugDetailHeader state={state} />
        {debugResultDetail.errorMessage && (
          <Row className={styles.configErrorTool}>
            调试失败：
            {debugResultDetail.errorMessage}
          </Row>
        )}

        <ReqResInfoWrap state={state} />
        {state.debugStatus === '调试中' ? (
          <div style={{ marginTop: 50 }}>
            <EmptyNode
              title="调试中，暂无结果"
              desc={<div>每 5 秒自动刷新结果</div>}
            />
          </div>
        ) : (
          <DetailTabsWrap state={state} id={id} setState={setState} />
        )}
      </div>
    </div>
  );
};
export default LinkDebugDetailWrap;
