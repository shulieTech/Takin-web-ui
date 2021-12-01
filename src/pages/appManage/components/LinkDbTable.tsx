import React, { Fragment } from 'react';
import CustomTable from 'src/components/custom-table';
import TableTitle from 'src/common/table-title/TableTitle';
import styles from './../index.less';
import AddAndEditDbDrawer from './AddAndEditDbDrawer';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import getLinkDbColumns from './LinkDbColumn';
import AddEditDbModal from '../modals/AddEditDbModal';
import AddDynamicDbDrawer from './AddDynamicDbDrawer';

interface Props {
  state?: any;
  setState?: (value) => void;
  id?: string;
  detailData?: any;
  detailState?: any;
  action?: any;
}

const LinkDbTable: React.FC<Props> = props => {
  const { state, setState, id, detailData, detailState, action } = props;
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));

  return (
    <div
      className={styles.tableWrap}
      style={{ height: document.body.clientHeight - 160 }}
    >
      <TableTitle
        title="关联影子库表"
        extraNode={
          <div className={styles.addAction}>
            {detailState.isNewAgent === true ? (
              <AuthorityBtn
                isShow={btnAuthority && btnAuthority.appManage_2_create}
              >
                <AddEditDbModal
                  applicationId={id}
                  btnText="新增影子库表"
                  detailData={detailData}
                  onSuccess={() => {
                    setState({
                      isReload: !state.isReload
                    });
                  }}
                />
              </AuthorityBtn>
            ) : detailState.isNewAgent === false ? (
              <Fragment>
                <AuthorityBtn
                  isShow={btnAuthority && btnAuthority.appManage_2_create}
                >
                  <span style={{ marginRight: 8 }}>
                    <AddDynamicDbDrawer
                      disabled={
                        detailState.switchStatus === 'OPENING' ||
                        detailState.switchStatus === 'CLOSING'
                          ? true
                          : false
                      }
                      titles="新增数据库/缓存连接池"
                      action="add"
                      id={id}
                      detailData={detailData}
                      onSuccess={() => {
                        setState({
                          isReload: !state.isReload
                        });
                      }}
                    />
                  </span>
                </AuthorityBtn>

                <AuthorityBtn
                  isShow={btnAuthority && btnAuthority.appManage_2_create}
                >
                  <AddAndEditDbDrawer
                    disabled={
                      detailState.switchStatus === 'OPENING' ||
                      detailState.switchStatus === 'CLOSING'
                        ? true
                        : false
                    }
                    titles="新增其他影子存储"
                    action="add"
                    id={id}
                    detailData={detailData}
                    onSccuess={() => {
                      setState({
                        isReload: !state.isReload
                      });
                    }}
                  />
                </AuthorityBtn>
              </Fragment>
            ) : null}
          </div>}
      />

      <CustomTable
        rowKey="id"
        style={{ marginTop: 30 }}
        loading={state.loading}
        columns={getLinkDbColumns(state, setState, detailState, id, detailData)}
        dataSource={state.dataSource}
      />
    </div>
  );
};
export default LinkDbTable;
