/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import AddDataSourceConfigModal from '../modals/AddDataSourceConfigModal';

interface Props {
  state?: any;
  setState?: (value) => void;
  dictionaryMap?: any;
}
const DataSourceConfigTableAction: React.FC<Props> = props => {
  const { state, dictionaryMap } = props;
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));

  return (
    <Fragment>
      <AuthorityBtn isShow={btnAuthority && btnAuthority.appManage_2_create}>
        <AddDataSourceConfigModal
          action="add"
          btnText="新增数据源"
          dictionaryMap={dictionaryMap}
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
export default DataSourceConfigTableAction;
