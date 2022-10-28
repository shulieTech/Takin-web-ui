import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Icon, Modal, Tooltip } from 'antd';
import {
  Form,
  FormItem,
  createAsyncFormActions,
  FormEffectHooks,
} from '@formily/antd';
import { Input, Password, Radio, Select } from '@formily/antd-components';
import service from '../service';
import { PrepareContext } from '../_layout';
import useApplicationSelect from './useApplicationSelect';

interface Props {
  detail: any;
  okCallback: () => void;
  cancelCallback: () => void;
}

export default (props: Props) => {
  const { detail, okCallback, cancelCallback, ...rest } = props;
  const actions = useMemo(createAsyncFormActions, []);
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  const [dataSourceType, setDataSourceType] = useState();

  const selectAppOptions = useApplicationSelect({
    // TODO 设置初始值回显
    initialValue: detail?.applicationsNames
  });

  const handleSubmit = async () => {
    const { values } = await actions.submit();
    const newValue = {
      ...detail,
      ...values,
    };
    // TODO 提交数据
  };

  const formEffects = () => {
    const { onFieldValueChange$, onFieldInputChange$ } = FormEffectHooks;

    const getTooltipTitle = (text, tips) => (
      <span>
        {text}
        <Tooltip title={tips}>
          <Icon
            type="question-circle"
            style={{ marginLeft: 4, cursor: 'pointer' }}
          />
        </Tooltip>
      </span>
    );
    const isolateType = prepareState.currentLink?.isolateType;
    onFieldValueChange$('type').subscribe(({ value }) => {
      setDataSourceType(value);
      actions.setFieldState('*(!type)', (state) => (state.visible = false));
      // isolateType
      // 1: '影子库',
      // 2: '影子库/表',
      // 3: '影子表',
      let visibleFields = [];
      switch (true) {
        case value === 1 && [1, 2].includes(isolateType):
          visibleFields = [
            'applications',
            'businessUserName',
            'businessDatabase',
            'shadowUserName',
            'shadowDatabase',
            'shadowPassword',
          ];
          actions.setFieldState('businessDatabase', (state) => {
            state.props.title = getTooltipTitle(
              '业务数据源',
              '示例：jdbc:mysql://192.168.1.102:3306/easydemo_db'
            );
          });
          actions.setFieldState('shadowDatabase', (state) => {
            state.props.title = '影子数据源';
          });

          break;
        case value === 1 && isolateType === 3:
          visibleFields = [
            'applications',
            ,
            'businessUserName',
            'businessDatabase',
          ];
          actions.setFieldState('businessDatabase', (state) => {
            state.props.title = getTooltipTitle(
              '业务数据源',
              '示例：jdbc:mysql://192.168.1.102:3306/easydemo_db'
            );
          });
          actions.setFieldState('shadowDatabase', (state) => {
            state.props.title = '影子数据源';
          });
          break;
        case value === 2:
          visibleFields = [
            'applications',
            'businessDatabase',
            'shadowDatabase',
            'shadowUserName',
            'shadowPassword',
            'dbName',
          ];
          actions.setFieldState('businessDatabase', (state) => {
            state.props.title = getTooltipTitle(
              '业务数据源',
              '示例：mongodb://192.168.1.217:27017'
            );
          });
          actions.setFieldState('shadowDatabase', (state) => {
            state.props.title = getTooltipTitle(
              '影子数据源',
              '示例：mongodb://192.168.1.217:27017'
            );
          });
          break;
        case value === 3:
          visibleFields = [
            'applications',
            'businessNodes',
            'performanceTestNodes',
            'performanceClusterName',
            'ptUserName',
            'ptPassword',
            'indices',
          ];
          break;
        default:
          visibleFields = [];
      }

      visibleFields.forEach((x) => {
        actions.setFieldState(x, (state) => (state.visible = true));
      });
    });
  };

  return (
    <Modal
      title={`${detail.dsKey ? '编辑' : '新增'}数据源`}
      width={700}
      visible={!!detail}
      onOk={handleSubmit}
      okText="保存"
      onCancel={cancelCallback}
      maskClosable={false}
      bodyStyle={{
        maxHeight: '60vh',
        overflow: 'auto',
      }}
      destroyOnClose
      {...rest}
    >
      <Form
        actions={actions}
        initialValues={detail}
        labelCol={6}
        wrapperCol={18}
        effects={formEffects}
      >
        <FormItem
          name="type"
          title="类型"
          component={Radio.Group}
          dataSource={[
            { label: '连接池', value: 1 },
            { label: 'mongodb', value: 2 },
            { label: 'ES', value: 3 },
          ]}
          editable={!detail.dsKey}
          props={{
            placeholder: '请选择',
          }}
          rules={[{ required: true, message: '请选择类型' }]}
          initialValue={1}
        />
        <FormItem
          name="applications"
          title="应用范围"
          component={Select}
          rules={[
            {
              required: true,
              message: '请选择应用范围',
            },
          ]}
          {...selectAppOptions}
        />
        <FormItem
          name="businessUserName"
          title="业务数据源用户名"
          component={Input}
          rules={[
            {
              required: true,
              whitespace: true,
              message: '请输入业务数据源用户名',
            },
          ]}
          props={{ maxLength: 25, placeholder: '请输入' }}
        />
        <FormItem
          name="businessDatabase"
          title={
            <span>
              业务数据源
              <Tooltip title="示例：jdbc:mysql://192.168.1.102:3306/easydemo_db">
                <Icon
                  type="question-circle"
                  style={{ marginLeft: 4, cursor: 'pointer' }}
                />
              </Tooltip>
            </span>
          }
          component={Input}
          rules={[
            { required: true, whitespace: true, message: '请输入业务数据源' },
          ]}
          props={{ maxLength: 200, placeholder: '请输入' }}
        />

        <FormItem
          name="shadowDatabase"
          title="影子数据源"
          component={Input}
          rules={[
            {
              required: true,
              whitespace: true,
              message: '请输入影子数据源',
            },
          ]}
          props={{ maxLength: 200, placeholder: '请输入' }}
        />

        <FormItem
          name="shadowUserName"
          title="影子数据源用户名"
          component={Input}
          rules={[
            {
              required: dataSourceType !== 2,
              whitespace: true,
              message: '请输入影子数据源用户名',
            },
          ]}
          props={{ maxLength: 200, placeholder: '请输入' }}
        />

        <FormItem
          name="shadowPassword"
          title="影子数据源密码"
          component={Password}
          rules={[
            {
              required: dataSourceType !== 2,
              whitespace: true,
              message: '请输入影子数据源密码',
            },
          ]}
          props={{
            maxLength: 200,
            placeholder: '请输入',
            autoComplete: 'new-password',
          }}
        />
        <FormItem
          name="dbName"
          title="数据库名称"
          component={Input}
          rules={[
            {
              required: false,
              whitespace: true,
              message: '请输入数据库名称',
            },
          ]}
          props={{
            maxLength: 200,
            placeholder: '请输入',
          }}
        />

        <FormItem
          name="businessNodes"
          title="业务集群地址"
          component={Input}
          rules={[
            { required: true, whitespace: true, message: '请输入影子数据源' },
          ]}
          props={{
            maxLength: 200,
            placeholder: '请输入业务集群地址（多个用逗号隔开）',
          }}
        />
        <FormItem
          name="performanceTestNodes"
          title="影子集群地址"
          component={Input}
          rules={[
            { required: true, whitespace: true, message: '请输入影子数据源' },
          ]}
          props={{
            maxLength: 200,
            placeholder: '请输入影子集群地址（多个用逗号隔开）',
          }}
        />
        <FormItem
          name="performanceClusterName"
          title="影子集群名称"
          component={Input}
          props={{ maxLength: 200, placeholder: '请输入业务集群名称' }}
        />
        <FormItem
          name="ptUserName"
          title="影子用户名"
          component={Input}
          props={{ maxLength: 200, placeholder: '请输入' }}
        />
        <FormItem
          name="ptPassword"
          title="影子密码"
          component={Password}
          props={{
            maxLength: 200,
            placeholder: '请输入',
            autoComplete: 'new-password',
          }}
        />
        <FormItem
          name="indices"
          title="索引名称"
          component={Input}
          props={{
            maxLength: 200,
            placeholder: '请输入索引名称（多个用逗号隔开）',
          }}
          help={
            <Tooltip
              title={`{
            "indices":["indexa","indexb"]
            "businessNodes":"192.168.1.210:9200,192.168.1.193:9200",
            "performanceTestNodes":"192.168.1.210:9200,192.168.1.193:9200",
            "businessClusterName":"bizCluster",
            "performanceClusterName":"ptCluster",
            "ptUserName":"ptUserName",
            "ptPassword":"ptPassword"
        }`}
            >
              <a>参考示例</a>
            </Tooltip>
          }
        />
      </Form>
    </Modal>
  );
};
