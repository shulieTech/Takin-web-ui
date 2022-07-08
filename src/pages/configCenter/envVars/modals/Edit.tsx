import React, { useState } from 'react';
import { message, Input, Modal, Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import service from '../service';

const FormItem = Form.Item;

interface Props {
  editItem: any;
  okCallback: () => void;
  cancelCallback: () => void;
  form: WrappedFormUtils;
}

const EditVarModal: React.FC<Props> = (props) => {
  const {
    form: { getFieldDecorator, validateFields },
    editItem,
    okCallback,
    cancelCallback,
    ...rest
  } = props;

  const [saving, setSaving] = useState(false);

  const saveItem = async () => {
    validateFields(async (err, values) => {
      if (err) {
        return;
      }
      setSaving(true);
      const {
        data: { success },
      } = await service[editItem?.id ? 'envVarUpdate' : 'envVarAdd']({
        ...editItem,
        ...values,
      }).finally(() => {
        setSaving(false);
      });
      if (success) {
        message.success('操作成功');
        okCallback();
      }
    });
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return (
    <Modal
      title={`${editItem?.id ? '编辑' : '新增'}变量`}
      visible={!!editItem}
      destroyOnClose
      onOk={saveItem}
      onCancel={cancelCallback}
      okButtonProps={{
        loading: saving,
      }}
      {...rest}
    >
      <Form>
        <FormItem label="名称" {...formItemLayout}>
          {getFieldDecorator('key', {
            initialValue: editItem?.key,
            rules: [
              { required: true, whitespace: true, message: '请输入名称' },
              {
                validator: (rule, val, callback) => {
                  callback(/^EV_.*$/.test(val) ? undefined : '请以EV_开头');
                },
              },
            ],
          })(<Input placeholder="请输入，以EV_开头" maxLength={30} />)}
        </FormItem>
        <FormItem label="值" {...formItemLayout}>
          {getFieldDecorator('value', {
            initialValue: editItem?.value,
            rules: [{ required: true, whitespace: true, message: '请输入值' }],
          })(<Input placeholder="请输入" maxLength={200} />)}
        </FormItem>
        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark', {
            initialValue: editItem?.remark,
            // rules: [{ required: true, whitespace: true, message: '请输入值' }],
          })(<Input.TextArea placeholder="请输入" maxLength={200} />)}
        </FormItem>
      </Form>
    </Modal>
  );
};

export default Form.create()(EditVarModal);
