/**
 * @name
 * @author MingShined
 */
import { Icon, Input, message, TreeSelect } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { CommonForm, CommonModal } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { Fragment, useState } from 'react';
import { AuthorityConfigBean } from '../enum';
import styles from '../index.less';
import AuthorityConfigService from '../service';
import { rebuildTreeData } from './AddDepartmentModal';

interface Props {
  id?: string | number;
  onSuccess: () => void;
  treeData: any[];
}
const AddAccountModal: React.FC<Props> = props => {
  const [details, setDetails] = useState({});
  const [form, setForm] = useState<WrappedFormUtils>();
  const getAccountInfo = async () => {
    if (!props.id) {
      return;
    }
    const {
      data: { data, success }
    } = await AuthorityConfigService.getAccountInfo({ id: props.id });
    if (success) {
      setDetails(data);
    }
  };
  const getFormData = (): FormDataType[] => {
    return [
      {
        key: AuthorityConfigBean.所属部门,
        label: '所属部门',
        options: {
          initialValue: details[AuthorityConfigBean.所属部门],
          rules: [{ required: true, message: '请选择所属部门' }]
        },
        node: (
          <TreeSelect
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            multiple
            placeholder="请选择所属部门，可多选"
            maxTagCount={3}
            treeData={rebuildTreeData(props.treeData)}
          />
        )
      },
      {
        key: AuthorityConfigBean.账号名称,
        label: '账号名称',
        options: {
          initialValue: details[AuthorityConfigBean.账号名称],
          rules: [
            { required: true, message: '请输入账号名称，最多20个字符', max: 20 }
          ]
        },
        node: (
          <Input style={{ fontSize: 12 }} maxLength={20} placeholder="请输入账号名称，最多20个字符" />
        )
      },
      {
        key: AuthorityConfigBean.账号密码,
        label: '账号密码',
        options: {
          initialValue: details[AuthorityConfigBean.账号密码],
          rules: [
            {
              min: 8,
              max: 20,
              message: '密码为8-20个字符',
              required: !!!props.id
            }
          ]
        },
        node: (
          <Input
            minLength={8}
            style={{ fontSize: 12 }}
            maxLength={20}
            placeholder="请输入账号密码，8-20个字符"
          />
        )
      }
    ];
  };
  const handleSubmit = () => {
    return new Promise(resolve => {
      form.validateFields(async (err, values) => {
        if (err) {
          message.info('请检查表单必填项');
          resolve(false);
          return;
        }
        const ajaxEvent = props.id
          ? AuthorityConfigService.updateAccount({ ...details, ...values })
          : AuthorityConfigService.createAccount(values);
        const {
          data: { success }
        } = await ajaxEvent;
        if (success) {
          message.success(`${btnText}成功`);
          props.onSuccess();
          resolve(true);
          return;
        }
        resolve(false);
      });
    });
  };
  const btnText: string = props.id ? '编辑' : '新增';
  const title: React.ReactNode = (
    <Fragment>
      <Icon
        className={styles.ModalIcon}
        theme="filled"
        style={{
          color: '#26cdc3',
          transform: 'translateY(5px)',
          marginRight: 8
        }}
        type={props.id ? 'edit' : 'plus-circle'}
      />
      <span style={{ fontWeight: 600, fontSize: 16, color: '#434343' }}>
        {btnText}账号
      </span>
    </Fragment>
  );
  return (
    <Fragment>
      <CommonModal
        btnText={`${btnText}${props.id ? '' : '账号'}`}
        onClick={getAccountInfo}
        modalProps={{ title, destroyOnClose: true, width: 650 }}
        btnProps={{
          type: props.id ? 'link' : 'default'
        }}
        beforeOk={handleSubmit}
      >
        <CommonForm
          formItemProps={{ labelCol: { span: 5 }, wrapperCol: { span: 16 } }}
          btnProps={{ isResetBtn: false, isSubmitBtn: false }}
          rowNum={1}
          getForm={f => setForm(f)}
          formData={getFormData()}
        />
      </CommonModal>
    </Fragment>
  );
};
export default AddAccountModal;
