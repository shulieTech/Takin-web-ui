import React, { useState, useEffect, useMemo } from 'react';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  createAsyncFormActions,
  FormEffectHooks,
} from '@formily/antd';
import { Input, ArrayTable, FormTab } from '@formily/antd-components';
import { Drawer, Button, Modal } from 'antd';
import service from '../service';

interface Props {
  detail: any;
  okCallback: () => void;
  cancelCallback: () => void;
}

const Params: React.FC<Props> = (props) => {
  const { detail, okCallback, cancelCallback } = props;
  const actions = useMemo(() => createAsyncFormActions(), []);
  const [formChanged, setFormChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const { onFieldValueChange$, onFieldInputChange$, onFormMount$ } =
    FormEffectHooks;

  const saveBase = async () => {
    // TODO 更换接口
    const { values } = await actions.submit();
    setSaving(true);
    const {
      data: { success, data },
    } = await service
      .getDataFromFile({
        ...values,
      })
      .finally(() => {
        setSaving(false);
      });
    if (success) {
      setFormChanged(false);
      okCallback();
    }
  };

  const handleCancel = () => {
    if (formChanged) {
      Modal.confirm({
        title: '提示',
        content: '您有未保存内容，是否保存修改后退出？',
        okText: '保存并退出',
        onCancel: cancelCallback,
        onOk: saveBase,
      });
    } else {
      cancelCallback();
    }
  };

  const formEffects = () => {
    onFieldInputChange$().subscribe((fieldState) => {
      setFormChanged(true);
    });
  };

  return (
    <Drawer
      visible
      title="场景基本信息"
      width={'60vw'}
      bodyStyle={{
        position: 'relative',
        padding: 0,
        paddingBottom: 60,
        height: `calc(100% - 60px)`,
        overflow: 'hidden',
      }}
      onClose={handleCancel}
    >
      <div
        style={{
          height: '100%',
          overflow: 'auto',
          padding: 24,
        }}
      >
        <SchemaForm
          actions={actions}
          components={{
            Input,
            TextArea: Input.TextArea,
          }}
          effects={formEffects}
        >
          <Field
            name="name"
            title="场景名称"
            required
            x-component="Input"
            x-component-props={{
              readOnly: true,
              placeholder: '请输入',
              style: {
                width: 320,
              },
            }}
            x-rules={[{ required: true, message: '请输入场景名称' }]}
          />
          <Field
            name="id"
            title="场景ID"
            required
            x-component="Input"
            x-component-props={{
              readOnly: true,
              placeholder: '请输入',
              style: {
                width: 320,
              },
            }}
            x-rules={[{ required: true, message: '请输入' }]}
          />
          {/* TODO 选人组件 */}
          <Field
            name="manager"
            title="归属人"
            required
            x-component="Input"
            x-component-props={{
              readOnly: true,
              placeholder: '请选择',
              style: {
                width: 320,
              },
            }}
            x-rules={[{ required: true, message: '请选择归属人' }]}
          />
          <Field
            name="desc"
            title="简介"
            x-component="TextArea"
            x-component-props={{
              placeholder: '给业务流程增加一些描述吧～',
              style: {
                width: 670,
              },
              maxLenght: 200,
              rows: 4,
            }}
          />
        </SchemaForm>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: 'right',
          padding: '12px 24px',
          borderTop: '1px solid #e8e8e8',
        }}
      >
        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button type="primary" ghost onClick={saveBase} loading={saving}>
          保存
        </Button>
      </div>
    </Drawer>
  );
};

export default Params;
