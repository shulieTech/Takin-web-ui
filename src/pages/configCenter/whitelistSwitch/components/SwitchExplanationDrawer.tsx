import { CommonDrawer } from 'racc';
import React from 'react';
import styles from './../index.less';

interface Props {
  action?: string;
  id?: string | Number;
  titles?: string | React.ReactNode;
  disabled?: boolean;
  onSccuess?: () => void;
}
interface State {}
const SwitchExplanationDrawer: React.FC<Props> = props => {
  return (
    <CommonDrawer
      btnText="「白名单校验开关说明」"
      drawerProps={{
        width: 560,
        title: '白名单校验开关说明',
        maskClosable: false
      }}
      footer={null}
      btnProps={{
        type: 'link',
        style: {
          border: 'none',
          padding: 0,
          height: 12
        }
      }}
    >
      <div>
        <h4 className={styles.h4}>概述：</h4>
        <p className={styles.txts}>
          白名单是压测流量是否可以调用应用服务的授权机制，仅当应用服务在白名单中可被压测流量调用，该机制可有效防止压测流量调用未接入的应用服务，若关闭白名单开关可能导致压测流量泄露，建议保持开启。
        </p>
        <h4 className={styles.h4}>关闭操作的影响：</h4>
        <p className={styles.txts}>
          关闭白名单校验后有可能导致压测流量泄露至未接入的应用，请谨慎操作！
        </p>
        <h4 className={styles.h4}>开启操作的影响：</h4>
        <p className={styles.txts}>
          开启白名单校验后仅白名单内的接口可被压测流量调用
        </p>
        <h4 className={styles.h4}>如有疑问，请向数列人员咨询</h4>
      </div>
    </CommonDrawer>
  );
};
export default SwitchExplanationDrawer;
