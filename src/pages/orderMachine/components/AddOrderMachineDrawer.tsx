/* eslint-disable react-hooks/exhaustive-deps */
import { message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import moment from 'moment';
import { CommonDrawer, CommonForm, useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import OrderMachineService from '../service';
import getOrderMachineFormData from './OrderMachineFormData';

interface Props {
  action?: string;
  id?: string | Number;
  titles?: string | React.ReactNode;
  onSccuess?: () => void;
}
interface State {
  form: any;
  tenantList: any[];
  resourcePoolList: any[];
  regionList: any[];
  userPackageList: any[];
}
const AddOrderMachineDrawer: React.FC<Props> = (props) => {
  const { action, id, titles } = props;
  const [state, setState] = useStateReducer<State>({
    form: null as WrappedFormUtils,
    tenantList: [],
    resourcePoolList: [],
    regionList: [],
    userPackageList: []
  });

  useEffect(() => {
    queryTenantList();
    queryResourcePool();
    queryUserPackage();
    // queryRegionList();
  }, []);

  /**
   * @name 获取租户列表
   */
  const queryTenantList = async () => {
    const {
          data: { data, success }
        } = await OrderMachineService.queryTenantList({});
    if (success) {
      setState({
        tenantList: data
      });
    }
  };

  /**
   * @name 获取资源池列表
   */
  const queryResourcePool = async () => {
    const {
            data: { data, success }
          } = await OrderMachineService.queryResourcePool({});
    if (success) {
      setState({
        resourcePoolList: data
      });
    }
  };

  /**
   * @name 获取可用区列表
   */
  const queryRegionList = async () => {
    const {
              data: { data, success }
            } = await OrderMachineService.queryRegion({});
    if (success) {
      setState({
        regionList: data
      });
    }
  };

  /**
   * @name 获取用户套餐列表
   */
  const queryUserPackage = async () => {
    const {
                data: { data, success }
              } = await OrderMachineService.queryUserPackage({});
    if (success) {
      setState({
        userPackageList: data
      });
    }
  };

  /**
   * @name 提交
   */
  const handleSubmit = async () => {
    return new Promise((resolve) => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }
  
        const result = {
          ...values,
          startTime: moment(values?.startTime).format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment(values?.endTime).format('YYYY-MM-DD HH:mm:ss'),
          regionName: state?.regionList?.filter(item => item?.region === values?.region)?.[0]?.name,
          poolName: state?.resourcePoolList?.filter(item => item?.poolId === values?.pool)?.[0]?.poolName
        };
        /**
         * @name 增加订购机器
         */
        if (action === 'add') {
          const {
            data: { success, data }
          } = await OrderMachineService.addOrderMachine(result);
          if (success) {
            message.success('增加订购机器成功');
            props.onSccuess();
            resolve(true);
          }
        }

        resolve(false);
      });
    });
  };

  return (
    <CommonDrawer
      btnText={titles}
      drawerProps={{
        width: 650,
        title: '新增订购机器',
        maskClosable: false
      }}
      drawerFooterProps={{
        okText: action === 'add' ? '确认新增' : '确认编辑',
        style: { zIndex: 10 }
      }}
      btnProps={
        action !== 'add' && {
          type: 'link'
        }
      }
      beforeOk={() => handleSubmit()}
    >
      <CommonForm
        getForm={(form) => setState({ form })}
        formData={getOrderMachineFormData(state, action, setState)}
        btnProps={{
          isResetBtn: false,
          isSubmitBtn: false
        }}
        rowNum={1}
        formItemProps={{ labelCol: { span: 6 }, wrapperCol: { span: 14 } }}
      />
    </CommonDrawer>
  );
};
export default AddOrderMachineDrawer;
