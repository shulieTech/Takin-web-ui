/* eslint-disable react-hooks/exhaustive-deps */
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
  deptId: string;
}
const AppDistributeModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    form: null as WrappedFormUtils,
    accountList: [],
    loading: false,
    selectedRowKeys: [],
    treeData: [],
    deptId: undefined
  });
  const { menuCode } = props;

  const handleClick = () => {
    queryDepartmentList({});
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

  const handleCancle = async () => {
    setState({
      selectedRowKeys: [],
      accountList: []
    });
  };

  /**
   * @name 分配权限
   */
  const handleSubmit = async () => {
    return await new Promise(async resolve => {
      const {
          data: { success, data }
        } = await DistributionService.allocation({
          dataId: props.dataId,
          deptId: state?.deptId,
          menuCode: props.menuCode,
        });
      if (success) {
        message.success('分配成功');
        props.onSccuess();
        resolve(true);
      }
      resolve(false);
    });
  };

  const handleChange = (value) => {
    console.log(value);
    setState({
      deptId: value?.[0]
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
          </p>
        ),
        okText: '确认分配',
        okButtonProps: {
          disabled:
            state.deptId
              ? false
              : true
        }
      }}
      btnProps={{ type: 'link' }}
      btnText={props.btnText}
      onClick={() => handleClick()}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
    >

      <span>请选择项目：</span>
      <Cascader
          onChange={handleChange}
          options={state.treeData}
          placeholder="请选择项目"
          fieldNames={{ label: 'title', value: 'id', children: 'children' }}
          changeOnSelect
      />
    </CommonModal>
  );
};
export default AppDistributeModal;