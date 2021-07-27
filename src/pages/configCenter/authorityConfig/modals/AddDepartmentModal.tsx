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

interface Props {
  id?: string | number;
  onSuccess: () => void;
  treeData: any[];
}
const AddDepartmentModal: React.FC<Props> = props => {
  const [details, setDetails] = useState({});
  const [form, setForm] = useState<WrappedFormUtils>();
  const getDepartmentInfo = async () => {
    if (!props.id) {
      return;
    }
    const {
      data: { data, success }
    } = await AuthorityConfigService.getDepartmentInfo({ id: props.id });
    if (success) {
      setDetails({
        ...data,
        [AuthorityConfigBean.上级部门]: data[AuthorityConfigBean.上级部门] || -1
      });
    }
  };
  const getFormData = (): FormDataType[] => {
    const initDptInfo = { title: '无上级部门', key: -1, value: -1 };
    const _treeData = [initDptInfo, ...rebuildTreeData(props.treeData)];
    return [
      {
        key: AuthorityConfigBean.上级部门,
        label: '上级部门',
        options: {
          initialValue: details[AuthorityConfigBean.上级部门],
          rules: [{ required: true, message: '请选择上级部门' }]
        },
        node: (
          <TreeSelect
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            // filterOption
            treeNodeFilterProp="title"
            showSearch
            placeholder="请选择上级部门"
            treeData={_treeData}
          />
        )
      },
      {
        key: AuthorityConfigBean.部门名称,
        label: '部门名称',
        options: {
          initialValue: details[AuthorityConfigBean.部门名称],
          rules: [{ required: true, message: '请输入部门名称，最多20个字符' }]
        },
        node: (
          <Input style={{ fontSize: 12 }} maxLength={20} placeholder="请输入部门名称，最多20个字符" />
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
          ? AuthorityConfigService.updateDepartment({ ...details, ...values })
          : AuthorityConfigService.createDepartment(values);
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
          color: 'var(--BrandPrimary-500)',
          transform: 'translateY(5px)',
          marginRight: 8
        }}
        type={props.id ? 'edit' : 'plus-circle'}
      />
      <span style={{ fontWeight: 600, fontSize: 16, color: '#434343' }}>
        {btnText}部门
      </span>
    </Fragment>
  );
  return (
    <Fragment>
      <CommonModal
        onClick={getDepartmentInfo}
        btnText={`${btnText}${props.id ? '部门' : ''}`}
        modalProps={{ title, destroyOnClose: true }}
        btnProps={{
          type: props.id ? 'link' : 'default',
          size: 'small',
          style: props.id && {
            fontSize: 13,
            color: '#555555',
            fontWeight: 500,
            textAlign: 'left'
          }
        }}
        beforeOk={handleSubmit}
      >
        <CommonForm
          formItemProps={{ labelCol: { span: 5 }, wrapperCol: { span: 16 } }}
          btnProps={{ isResetBtn: false, isSubmitBtn: false }}
          getForm={f => setForm(f)}
          rowNum={1}
          formData={getFormData()}
        />
      </CommonModal>
    </Fragment>
  );
};
export default AddDepartmentModal;

export const rebuildTreeData = (data: any[]): any[] => {
  if (!data) {
    return [];
  }
  return data.map(item => {
    if (item.children && item.children.length) {
      return {
        ...item,
        value: item.id,
        key: item.id,
        children: rebuildTreeData(item.children)
      };
    }
    return { ...item, value: item.id, key: item.id };
  });
};
