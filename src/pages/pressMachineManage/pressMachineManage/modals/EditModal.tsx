/**
 * @name
 * @author MingShined
 */
import { Icon, Input, InputNumber, message, Tooltip } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { CommonForm, CommonModal } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { useState } from 'react';
import { PressMachineManageEnum } from '../enum';
import PressMachineManageService from '../service';
interface Props {
  data: any;
  setState: any;
  [params: string]: any;
}
const EditModal: React.FC<Props> = props => {
  const [form, setForm] = useState<WrappedFormUtils>(null);
  const getFormData = (): FormDataType[] => {
    return [
      {
        key: PressMachineManageEnum.标签,
        options: {
          initialValue: props.data[PressMachineManageEnum.标签],
          // rules: [{ required: true, message: '请填写标签' }]
        },
        label: '标签',
        node: <Input maxLength={20} style={{ width: '80%' }} />
      },
      {
        key: PressMachineManageEnum.网络带宽,
        options: {
          initialValue: props.data[PressMachineManageEnum.网络带宽] || undefined,
          rules: [{ required: true, message: '请填写网络带宽' }]
        },
        label: (
          <span>
            网络带宽
            <Tooltip title="请设置正确的网络带宽值，单位为Mbps，否则无法正确计算带宽使用率。">
              <Icon type="question-circle" />
            </Tooltip>
          </span>
        ),
        node: <InputNumber min={1} precision={0} style={{ width: '80%' }} />,
        extra: ' Mbps'
      }
    ];
  };
  const handleSubmit = () => {
    return new Promise(async resolve => {
      let result = { ...props.data };
      let isPass = true;
      form.validateFields((err, value) => {
        if (err) {
          message.info('请检查表单必填项');
          isPass = false;
          return;
        }
        result = { ...result, ...value };
      });
      if (!isPass) {
        resolve(false);
        return;
      }
      const {
        data: { success }
      } = await PressMachineManageService.editPressMachineInfo(result);
      if (success) {
        message.success('编辑成功');
        props.setState({ reload: !props.reload });
        resolve(true);
        return;
      }
      resolve(false);
    });
  };
  return (
    <CommonModal
      btnText="编辑"
      btnProps={{ type: 'link' }}
      modalProps={{ title: '编辑压力机' }}
      beforeOk={handleSubmit}
    >
      <CommonForm
        btnProps={{ isResetBtn: false, isSubmitBtn: false }}
        getForm={f => setForm(f)}
        rowNum={1}
        formData={getFormData()}
      />
    </CommonModal>
  );
};
export default EditModal;
