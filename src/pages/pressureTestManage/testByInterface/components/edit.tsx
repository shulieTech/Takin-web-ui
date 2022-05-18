import React, { useState, useEffect, useMemo } from 'react';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  createAsyncFormActions,
  FormEffectHooks,
  FormPath,
} from '@formily/antd';
import {
  Input,
  Select,
  FormBlock,
  Radio,
  ArrayTable,
  FormTextBox,
  Switch,
  DatePicker,
  FormTab,
  FormMegaLayout,
  FormSlot,
} from '@formily/antd-components';
import { Button, message, Spin, Icon } from 'antd';
import NumberPicker from '../../pressureTestSceneV2/components/NumberPicker';
import service from '../service';
import BaseTab from './BaseTab';
import PressConfigTab from './PressConfigTab';

interface Props {
  currentSence: any;
}

const EditSence: React.FC<Props> = (props) => {
  const { currentSence } = props;
  const actions = useMemo(() => createAsyncFormActions(), []);
  const [detailLoading, setDetailLoading] = useState(false);

  const startTest = async () => {
    const { values } = await actions.submit();
    service.startSence(values);
  };

  return (
    <Spin spinning={detailLoading}>
      <SchemaForm
        style={{ padding: 16 }}
        actions={actions}
        initialValues={currentSence}
        validateFirst
        components={{
          Input,
          Select,
          NumberPicker,
          ArrayTable,
          FormBlock,
          FormTextBox,
          Radio,
          Switch,
          DatePicker,
          TextArea: Input.TextArea,
          RadioGroup: Radio.Group,
        }}
      >
        <FormMegaLayout inline>
          <Field
            name="name"
            type="string"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入压测场景名称',
              maxLength: 30,
              style: {
                width: 320,
              },
            }}
            x-rules={[
              {
                required: true,
                whitespace: true,
                message: '请输入压测场景名称',
              },
            ]}
            required
          />
          <FormSlot>
            <Button
              type="primary"
              onClick={startTest}
              style={{ float: 'right' }}
            >
              <Icon type="play-circle" theme="filled" />
              启动压测
            </Button>
          </FormSlot>
        </FormMegaLayout>
        <FormTab name="tabs-1" defaultActiveKey={'tab-1'} type="card">
          <BaseTab actions={actions} />
          <PressConfigTab actions={actions} />
        </FormTab>
      </SchemaForm>
    </Spin>
  );
};

export default EditSence;
