import { Button, Col, Input, message, Modal, Pagination, Row } from 'antd';
import { CommonForm, CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import CustomTable from 'src/components/custom-table';
import { MapBtnAuthority } from 'src/utils/utils';
import AddAccountModal from '../modals/AddAccountModal';
import AddRoleModal from '../modals/AddRoleModal';
import ImportAccountModal from '../modals/ImportAccountModal';
import AuthorityConfigService from '../service';
import styles from './../index.less';
import getAccountListColumn from './AccountListColumn';
import DeleteAccountBtn from './DeleteAccountBtn';

interface Props {
  state: any;
  setState: (value: any) => void;
}
const AccountList: React.FC<Props> = props => {
  const { state, setState } = props;
  const { selectedRowKeys } = state;
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));

  const handleSelectKeys = keys => {
    setState({
      selectedRowKeys: keys
    });
  };

  const { confirm } = Modal;
  const showModal = () => {
    confirm({
      content: '重置角色会清空之前关联的角色，是否确认要重置？',
      title: `是否重置账号角色`,
      okType: 'danger',
      okText: '确认重置',
      onOk() {
        handleDelete(state.selectedRowKeys);
      }
    });
  };

  /**
   * @name 重置账号角色
   */
  const handleDelete = async accountIds => {
    const {
      data: { data, success }
    } = await AuthorityConfigService.handleDelete({
      accountIds
    });
    if (success) {
      message.success(`重置成功`);
      setState({
        isReload: !state.isReload,
        selectedRowKeys: []
      });
    }
  };

  const handleChangePage = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: current - 1
      }
    });
  };

  const handlePageSizeChange = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: 0
      }
    });
  };

  /**
   * @name 搜索
   */
  const handleSearch = () => {
    state.form.validateFields(async (err, values) => {
      setState({
        accountSearchValues: {
          ...values
        },
        searchParams: {
          current: 0,
          pageSize: state.searchParams.pageSize
        }
      });
    });
  };

  /**
   * @name 重置
   */
  const handleReset = () => {
    state.form.validateFields(async (err, values) => {
      setState({
        accountSearchValues: {
          ...values
        },
        searchParams: {
          current: 0,
          pageSize: state.searchParams.pageSize
        },
        selectedRowKeys: []
      });
    });
  };

  return (
    <div className={styles.rightWrap}>
      {/* <div>
        <span className={styles.rightTitle}>账号管理</span>
        <span className={styles.rightSubTitle}>操作描述</span>
      </div> */}
      <div
        style={{
          height: '100%',
          overflow: 'scroll',
          position: 'relative'
        }}
      >
        <div style={{ padding: '0 16px' }}>
          <Row className="mg-b2x" type="flex" justify="space-between">
            <Col>
              <span style={{ color: '#595959', fontSize: 20, fontWeight: 600 }}>
                {state.selectedDeptName || '全部部门'}
              </span>
            </Col>
            <Col>
              <ImportAccountModal
                onSuccess={() => setState({ isReload: !state.isReload })}
              />
              <span className="mg-l1x">
                <AuthorityBtn
                  isShow={MapBtnAuthority(
                    'configCenter_authorityConfig_2_create'
                  )}
                >
                  <AddAccountModal
                    treeData={state.treeData}
                    onSuccess={() => setState({ isReload: !state.isReload })}
                  />
                </AuthorityBtn>
              </span>
            </Col>
          </Row>
          <div style={{ width: 'calc(100% - 24px)' }}>
            <CommonForm
              getForm={form => setState({ form })}
              formData={getFormData(state)}
              rowNum={4}
              onSubmit={handleSearch}
              onReset={handleReset}
            />
          </div>
        </div>
        <div style={{ height: 'calc(100% - 166px)', overflow: 'scroll' }}>
          <CustomTable
            style={{ marginTop: 16 }}
            rowKey="id"
            columns={getAccountListColumn(state, setState)}
            dataSource={state.accountList}
            rowSelection={{
              selectedRowKeys,
              onChange: handleSelectKeys
            }}
            loading={state.loading}
          />
        </div>

        <div className={styles.footer}>
          <AuthorityBtn
            isShow={
              btnAuthority && btnAuthority.configCenter_authorityConfig_3_update
            }
          >
            <AddRoleModal
              accountIds={state.selectedRowKeys}
              roles={[]}
              btnText="分配角色"
              disabled={state.selectedRowKeys.length > 0 ? false : true}
              onSccuess={() => {
                setState({
                  isReload: !state.isReload,
                  selectedRowKeys: []
                });
              }}
            />
          </AuthorityBtn>
          <AuthorityBtn
            isShow={
              btnAuthority && btnAuthority.configCenter_authorityConfig_3_update
            }
          >
            {/* <CustomPopconfirm
              okText="确认重置"
              title={'是否确认重置'}
              okColor="var(--FunctionalError-500)"
              onConfirm={() => handleDelete(state.selectedRowKeys)}
            > */}
            <Button
              onClick={() => {
                showModal();
              }}
              type="link"
              style={{
                color:
                  state.selectedRowKeys.length === 0
                    ? 'var(--Netural-07)'
                    : null,
                marginLeft: 8,
                marginRight: 8
              }}
              disabled={state.selectedRowKeys.length === 0 ? true : false}
            >
              批量重置
            </Button>
            {/* </CustomPopconfirm> */}
          </AuthorityBtn>
          <AuthorityBtn
            isShow={MapBtnAuthority('configCenter_authorityConfig_4_delete')}
          >
            <DeleteAccountBtn
              onSuccess={() =>
                setState({ isReload: !state.isReload, selectedRowKeys: [] })
              }
              ids={state.selectedRowKeys}
              btnProps={{
                disabled: !state.selectedRowKeys.length,
                style: {
                  color: !state.selectedRowKeys.length && 'var(--Netural-07)'
                }
              }}
            />
          </AuthorityBtn>
          <Pagination
            style={{ display: 'inline-block', float: 'right' }}
            total={state.total}
            current={state.searchParams.current + 1}
            pageSize={state.searchParams.pageSize}
            showTotal={(t, range) =>
              `共 ${state.total} 条数据 第${state.searchParams.current +
                1}页 / 共 ${Math.ceil(
                state.total / (state.searchParams.pageSize || 10)
              )}页`
            }
            showSizeChanger={true}
            onChange={(current, pageSize) =>
              handleChangePage(current, pageSize)
            }
            onShowSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </div>
  );
};
export default AccountList;

const getFormData = (state): FormDataType[] => {
  return [
    {
      key: 'accountName',
      label: '',
      node: <Input placeholder="请输入账号名称" />
    },
    {
      key: 'roleId',
      label: '',
      node: (
        <CommonSelect
          placeholder="请选择角色"
          dataSource={state.roleList}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        />
      )
    }
  ];
};
