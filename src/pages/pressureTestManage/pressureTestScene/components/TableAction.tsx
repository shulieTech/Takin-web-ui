/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { Button, Statistic, Tooltip } from 'antd';
import Link from 'umi/link';
import styles from './../index.less';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';

interface Props {
  state?: any;
  setState?: (value) => void;
}
const PressureTestSceneTableAction: React.FC<Props> = props => {
  const { state } = props;
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  return (
    <Fragment>
      <span className={styles.usableFlow}>
        可用压测流量：
        <Statistic suffix="vum" precision={2} value={state.usableFlow || 0} />
        <Tooltip
          title={
            <div>
              <p>计费说明：</p>
              <p>
                消耗流量=平均并发（VU）*实际压测时长（M），压测时长小于1分钟时，按1分钟计费。
              </p>
              <p>余额不足时无法发起压测，请联系数列人员进行充值。</p>
            </div>
          }
          placement="bottom"
          overlayStyle={{ width: 183 }}
          style={{ backgroundColor: 'rgba(15,16,17,0.5)' }}
        >
          <a style={{ marginLeft: 4 }}>计费说明</a>
        </Tooltip>
      </span>
      <AuthorityBtn
        isShow={
          btnAuthority &&
          btnAuthority.pressureTestManage_pressureTestScene_2_create
        }
      >
        <Link to="/pressureTestManage/pressureTestScene/pressureTestSceneConfig?action=add">
          <Button type="primary">新增压测场景</Button>
        </Link>
      </AuthorityBtn>
    </Fragment>
  );
};
export default PressureTestSceneTableAction;
