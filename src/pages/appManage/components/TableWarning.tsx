/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import AddAppDrawer from './AddAppDrawer';
import { Alert } from 'antd';

interface Props {
  state?: any;
  setState?: (value) => void;
}
const TableWarning: React.FC<Props> = props => {
  const { state, setState } = props;
  const { switchStatus } = state;
  let messageTxt;

  if (switchStatus === 'OPENING' || switchStatus === 'CLOSING') {
    messageTxt = '压测总开关操作中，暂时不能对应用配置进行修改';
  } else {
    messageTxt = '压测总开关关闭，所有应用配置不生效，如有需要请联系管理员配置';
  }

  return (
    <Fragment>
      <Alert
        type="warning"
        message={<p style={{ color: '#646676' }}>{messageTxt}</p>}
        showIcon
        style={{ marginTop: 16, marginBottom: 8 }}
      />
    </Fragment>
  );
};
export default TableWarning;
