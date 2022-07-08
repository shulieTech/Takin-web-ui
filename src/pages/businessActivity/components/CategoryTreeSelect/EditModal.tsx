import React, { useState } from 'react';
import { message, Input, Modal, Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import service from './service';

const FormItem = Form.Item;

interface Props {
  editItem: any;
  okCallback: () => void;
  cancelCallback: () => void;
  form: WrappedFormUtils;
}

const EditModal: React.FC<Props> = (props) => {
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
      } = await service[editItem?.id ? 'categoryUpdate' : 'categoryAdd']({
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
      title={`${editItem?.id ? '编辑' : '新增'}分类`}
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
        <FormItem label="分类名称" {...formItemLayout}>
          {getFieldDecorator('title', {
            initialValue: editItem?.title,
            rules: [
              { required: true, whitespace: true, message: '请输入分类名称' },
            ],
          })(<Input placeholder="请输入" maxLength={30} />)}
        </FormItem>
      </Form>
    </Modal>
  );
};

export default Form.create()(EditModal);
