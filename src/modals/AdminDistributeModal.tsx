import React, { Fragment, useEffect } from 'react';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import { Cascader, Input, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';

import CustomTable from 'src/components/custom-table';
import getListColumn from './components/ListColumn';
import { FormDataType } from 'racc/dist/common-form/type';
import DistributionService from './service';

interface Props {
  btnText?: string | React.ReactNode;
  onSccuess?: () => void;
  menuCode: string;
  dataId: number;
}

interface State {
  form: any;
  accountList: any[];
  loading: boolean;
  selectedRowKeys: any;
  treeData: any;
}
const AdminDistributeModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    form: null as WrappedFormUtils,
    accountList: [],
    loading: false,
    selectedRowKeys: [],
    treeData: []
  });
  const { menuCode } = props;

  const handleClick = () => {
    // queryAccountList({});
    queryDepartmentList({});
  };

  const handleSelectKeys = keys => {
    setState({
      selectedRowKeys: keys
    });
  };

  /**
   * @name 获取部门列表
   */
  const queryDepartmentList = async value => {
    const {
      data: { data, success }
    } = await DistributionService.queryDepartmentList({
      ...value
    });
    if (success) {
      setState({
        treeData: data
      });
    }
  };

  /**
   * @name 获取账号列表
   */
  const queryAccountList = async value => {
    setState({
      loading: true
    });
    const {
      data: { data, success }
    } = await DistributionService.queryAccountList({
      ...value,
      pageSize: -1
    });
    if (success) {
      setState({
        accountList: data,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };
  /**
   * @name 分配权限
   */
  const handleSubmit = async () => {
    return await new Promise(resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }
        const {
          data: { success, data }
        } = await DistributionService.allocation({
          dataId: props.dataId,
          menuCode: props.menuCode,
          userId: state.selectedRowKeys[0]
        });
        if (success) {
          message.success('分配负责人成功');
          props.onSccuess();
          resolve(true);
        }
        resolve(false);
      });
    });
  };

  const handleCancle = async () => {
    setState({
      selectedRowKeys: [],
      accountList: []
    });
  };

  /**
   * @name 搜索
   */
  const handleSearch = () => {
    state.form.validateFields(async (err, values) => {
      queryAccountList({
        ...values,
        departmentId:
          values.departmentId &&
          values.departmentId[values.departmentId.length - 1]
      });
    });
  };

  /**
   * @name 重置
   */
  const handleReset = () => {
    state.form.validateFields(async (err, values) => {
      //   queryAccountList({
      //     ...values
      //   });
      setState({
        accountList: [],
        selectedRowKeys: []
      });
    });
  };

  return (
    <CommonModal
      modalProps={{
        width: 720,
        bodyStyle: {
          height: 500,
          overflow: 'auto'
        },
        title: (
          <p style={{ fontSize: 16 }}>
            权限分配
            <span style={{ color: '#a2a6b1', fontSize: 12, marginLeft: 16 }}>
              (请通过搜索账号选择指定的负责人)
            </span>
          </p>
        ),
        okText: '确认分配',
        okButtonProps: {
          disabled:
            state.selectedRowKeys && state.selectedRowKeys.length === 0
              ? true
              : false
        }
      }}
      btnProps={{ type: 'link' }}
      btnText={props.btnText}
      onClick={() => handleClick()}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
    >
      <CommonForm
        getForm={form => setState({ form })}
        formData={getFormData(state)}
        rowNum={4}
        onSubmit={handleSearch}
        onReset={handleReset}
      />
      <CustomTable
        rowKey="id"
        columns={getListColumn(state, setState)}
        dataSource={state.accountList}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: state.selectedRowKeys,
          onChange: handleSelectKeys
        }}
        loading={state.loading}
      />
    </CommonModal>
  );
};
export default AdminDistributeModal;

const getFormData = (state): FormDataType[] => {
  return [
    {
      key: 'departmentId',
      label: '',
      node: (
        <Cascader
          options={state.treeData}
          placeholder="请选择部门"
          fieldNames={{ label: 'title', value: 'id', children: 'children' }}
          changeOnSelect
        />
      )
    },
    {
      key: 'accountName',
      label: '',
      node: <Input placeholder="请输入账号名称" />
    }
  ];
};
