import React, { Fragment } from 'react';
import { CommonModal } from 'racc';
import styles from './../index.less';
import { Input } from 'antd';
interface Props {
  btnText?: string | React.ReactNode;
}
const EditKeyModal: React.FC<Props> = props => {
  return (
    <div style={{ marginTop: 24 }}>
      <CommonModal
        modalProps={{
          width: 400,
          title: '修改密钥',
          okText: '提交'
        }}
        btnProps={{ type: 'primary' }}
        btnText={props.btnText}
        // onClick={() => handleClick()}
      >
        <p className={styles.tip}>危险操作，密钥涉及压测平台数据准确性</p>
        <Input value={1} />
      </CommonModal>
    </div>
  );
};
export default EditKeyModal;
