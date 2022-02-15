/**
 * @name
 * @author chuxu
 */
import { Button, Modal } from 'antd';
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import CustomIcon from 'src/common/custom-icon/CustomIcon';
import AddEditActivityModal from '../modals/AddEditActivityModal';
import styles from './../index.less';

interface Props {
  state?: any;
  setState?: (value) => void;
}

const TableAction: React.FC<Props> = props => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));

  return (
    <Fragment>
      <AuthorityBtn
        isShow={btnAuthority && btnAuthority.businessActivity_2_create}
      >
        {/* <span style={{ marginRight: 16 }}>
          <AddEditActivityModal
            isVirtual={true}
            onSuccess={() =>
              props.setState({ isReload: !props.state.isReload })
            }
          />
        </span> */}

        <AddEditActivityModal
          onSuccess={() => props.setState({ isReload: !props.state.isReload })}
        />
      </AuthorityBtn>
    </Fragment>
  );
};
export default TableAction;
