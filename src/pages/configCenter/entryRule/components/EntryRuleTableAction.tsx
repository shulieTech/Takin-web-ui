/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import AddAndEditEntryRuleDrawer from './AddAndEditEntryRuleDrawer';
import { Icon, Tooltip } from 'antd';
import styles from './../index.less';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';

interface Props {
  state?: any;
  setState?: (value) => void;
}
const EntryRuleTableAction: React.FC<Props> = props => {
  const { state } = props;
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  return (
    <Fragment>
      <Tooltip
        title="设置入口规则后，可对rest API进行合并，以便更准确识别应用入口"
        placement="bottom"
      >
        <Icon type="question-circle" />
      </Tooltip>
      <span className={styles.tip}>功能说明</span>
      <AuthorityBtn
        isShow={btnAuthority && btnAuthority.configCenter_entryRule_2_create}
      >
        <AddAndEditEntryRuleDrawer
          action="add"
          titles="新增入口规则"
          onSccuess={() => {
            props.setState({
              isReload: !state.isReload,
              searchParams: {
                current: 0
              }
            });
          }}
        />
      </AuthorityBtn>
    </Fragment>
  );
};
export default EntryRuleTableAction;
