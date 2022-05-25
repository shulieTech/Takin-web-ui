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
import { Button, message, Spin, Icon, Modal } from 'antd';
import NumberPicker from '../../pressureTestSceneV2/components/NumberPicker';
import service from '../service';
import BaseTab from './BaseTab';
import PressConfigTab from './PressConfigTab';
import RadioCard from './RadioCard';
import LayoutBox from './LayoutBox';
import Sider from './Sider';

interface Props {
  currentSence: any;
}

const EditSence: React.FC<Props> = (props) => {
  const { currentSence } = props;
  const actions = useMemo(() => createAsyncFormActions(), []);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState(currentSence);
  const [saving, setSaving] = useState(false);

  const getDetail = async (id) => {
    setDetailLoading(true);
    const {
      data: { success, data },
    } = await service.getSence({ id }).finally(() => {
      setDetailLoading(false);
    });
    if (success) {
      setDetail(data);
    }
  };

  const startTest = async () => {
    const { values } = await actions.submit();
    if (values) {
      Modal.confirm({
        title: '提示',
        content: '您的场景有内容修改，是否保存并启动压测？',
        onOk: async () => {
          const {
            data: { success, data },
          } = await service.saveAndStartSence({
            ...detail,
            ...values,
          });
          if (success) {
            message.success('操作成功');
            // TODO 刷新并启动压测检测弹窗
          }
        },
      });
    }
  };

  const saveSence = async () => {
    const { values } = await actions.submit();
    if (values) {
      setSaving(true);
      const {
        data: { success, data },
      } = await service[detail?.id ? 'addSence' : 'updateSence']({
        ...detail,
        ...values,
      }).finally(() => {
        setSaving(false);
      });
      if (success) {
        message.success('操作成功');
        getDetail({ id: data.id });
      }
    }
  };

  useEffect(() => {
    if (currentSence.id) {
      getDetail(currentSence.id);
    }
  }, [currentSence.id]);

  return (
    <Spin spinning={detailLoading} wrapperClassName="spin-full">
      <SchemaForm
        actions={actions}
        initialValues={detail}
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
          RadioCard,
          TextArea: Input.TextArea,
          RadioGroup: Radio.Group,
        }}
      >
        <LayoutBox
          x-component-props={{
            style: {
              padding: 16,
              paddingBottom: 0,
              borderBottom: '1px solid #EEF0F2',
            },
          }}
        >
          <FormMegaLayout inline flex>
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
              <div style={{ float: 'right' }}>
                <Button
                  style={{ marginRight: 16 }}
                  onClick={saveSence}
                  loading-={saving}
                >
                  保存场景
                </Button>
                <Button type="primary" onClick={startTest} disabled={saving}>
                  <Icon type="play-circle" theme="filled" />
                  启动压测
                </Button>
              </div>
            </FormSlot>
          </FormMegaLayout>
        </LayoutBox>
        <LayoutBox
          x-component-props={{
            style: {
              display: 'flex',
            },
          }}
        >
          <FormTab
            name="tabs-1"
            defaultActiveKey={'tab-1'}
            type="card"
            style={{ flex: 1, padding: 16 }}
          >
            <BaseTab actions={actions} />
            <PressConfigTab actions={actions} />
          </FormTab>
          {detail.id && (
            <FormSlot>
              <Sider detail={detail} />
            </FormSlot>
          )}
        </LayoutBox>
      </SchemaForm>
    </Spin>
  );
};

export default EditSence;
