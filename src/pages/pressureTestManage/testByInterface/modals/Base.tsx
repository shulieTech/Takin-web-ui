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

  const saveParams = async () => {
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
      onClose={() => {
        cancelCallback();
      }}
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
        <Button
          onClick={cancelCallback}
          style={{
            marginRight: 8,
          }}
        >
          取消
        </Button>
        <Button type="primary" ghost onClick={saveParams} loading={saving}>
          保存
        </Button>
      </div>
    </Drawer>
  );
};

export default Params;
