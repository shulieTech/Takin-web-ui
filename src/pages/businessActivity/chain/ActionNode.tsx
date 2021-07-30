/**
 * @name
 * @author MingShined
 */
import { Button, Icon } from 'antd';
import React, { useContext } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import { getTakinAuthority, MapUserAuthority } from 'src/utils/utils';
import { router } from 'umi';
import { BusinessActivityDetailsContext } from '../detailsPage';
import styles from '../index.less';
import FlowVerificateModal from '../modals/FlowVerificateModal';

declare var window: any;

interface Props {}
const ActionNode: React.FC<Props> = props => {
  const { state, setState } = useContext(BusinessActivityDetailsContext);
  return (
    <div
      className={styles.actions}
      style={{ left: state.siderVisible ? 300 : 8 }}
    >
      <span
        className={styles.siderIcon}
        onClick={() => setState({ siderVisible: !state.siderVisible })}
      >
        <Icon
          style={{ color: '#fff' }}
          type={state.siderVisible ? 'left' : 'right'}
        />
      </span>
      <AuthorityBtn isShow={MapUserAuthority('scriptManage')}>
        <FlowVerificateModal id={state.details.activityId} />
      </AuthorityBtn>
      {getTakinAuthority() === 'true' && (
        <AuthorityBtn isShow={MapUserAuthority('debugTool_linkDebug')}>
          <Button
            type="primary"
            className="mg-l1x"
            onClick={() => {
              window.g_app._store.dispatch({
                type: 'app/updateState',
                payload: {
                  debugToolId: state.details.activityId.toString()
                }
              });
              router.push(`/pro/debugTool/linkDebug`);
            }}
          >
            去调试
          </Button>
        </AuthorityBtn>
      )}
    </div>
  );
};
export default ActionNode;
