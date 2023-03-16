import React from 'react';
import { Collapse, Row, Col, Button } from 'antd';
import {
  SchemaField,
  FormPath,
  Schema,
  IFieldMergeState,
  FormSpy,
} from '@formily/antd';
import TipTittle from './TipTittle';
import FlowPreview from './FlowPreview';

const { Panel } = Collapse;

const ConfigMap = (props: IFieldMergeState) => {
  const { value = {}, schema, className, editable, path, mutators } = props;
  const componentProps = schema.getExtendsComponentProps() || {};
  const { flatTreeData = [], packageData , maxData }  = componentProps;
  // console.log('maxData', maxData);

  const groupMap = {};
  // 取出线程组
  flatTreeData.forEach(x => {
    if (x.type === 'THREAD_GROUP') {
      groupMap[x.xpathMd5] = x;
    }
  });

  return (
    <Collapse {...componentProps} defaultActiveKey={Object.keys(groupMap)?.slice(0, 3)}>
      {Object.values(groupMap).map((x: any) => {
        return (
          <Panel header={x.testName} key={x.xpathMd5} forceRender>
            <Row gutter={16}>
              <Col span={12}>
                <SchemaField
                  path={FormPath.parse(path).concat(`${x.xpathMd5}.type`)}
                  schema={
                    new Schema({
                      type: 'number',
                      'x-component': 'RadioGroup',
                      title: (
                        <TipTittle tips="并发模式：指定最大并发量，按照对应的施压模式进行施压；TPS模式：以目标TPS为限，系统逐步增压，摸高到目标TPS，过程中也可动态调整TPS">
                          压力模式
                        </TipTittle>
                      ),
                      enum: [
                        { label: '并发模式', value: 0 },
                        { label: 'TPS模式', value: 1 },
                      ],
                      'x-rules': [
                        {
                          required: true,
                          message: '请选择压力模式',
                        },
                      ],
                      'x-linkages': [
                        {
                          type: 'value:schema',
                          target: FormPath.parse(path).concat(`${x.xpathMd5}.mode`),
                          condition: '{{ $self.value === 1 }}',
                          schema: {
                            enum: [{ label: '固定压力值', value: 1 }],
                          },
                          otherwise: {
                            enum: [
                              { label: '固定压力值', value: 1 },
                              { label: '线性递增', value: 2 },
                              { label: '阶梯递增', value: 3 },
                            ],
                          },
                        },
                        {
                          type: 'value:state',
                          target: FormPath.parse(path).concat(`${x.xpathMd5}.mode`),
                          condition: '{{ $self.value === 1 }}',
                          state: {
                            value: 1,
                          }
                        },
                        {
                          type: 'value:visible',
                          target: FormPath.parse(path).concat(`${x.xpathMd5}.threadNum`),
                          condition: '{{ $self.value === 0 }}',
                        },
                      ],
                      default: 0,
                    })
                  }
                />
                <SchemaField
                  path={FormPath.parse(path).concat(`${x.xpathMd5}.threadNum`)}
                  schema={
                    new Schema({
                      type: 'number',
                      'x-component': 'NumberPicker',
                      title: (
                        <TipTittle tips="压测场景最终会达到的最大并发量。">
                          最大并发
                        </TipTittle>
                      ),
                      'x-component-props': {
                        placeholder: `请输入1~${packageData?.maxVu}之间的正整数`,
                        style: {
                          width: '100%',
                        },
                      },
                      'x-rules': [
                        {
                          required: true,
                          message: `请输入最大并发，最大并发数量限制为${packageData?.maxVu}`,
                        },
                        {
                          format: 'integer',
                          minimum: 1,
                          maximum: packageData?.maxVu,
                          message: `请输入1~${packageData?.maxVu}之间的正整数`,
                        },
                      ],
                      default: 1,
                    })
                  }
                />

                <SchemaField
                  path={FormPath.parse(path).concat(`${x.xpathMd5}.mode`)}
                  schema={
                    new Schema({
                      type: 'number',
                      'x-component': 'RadioGroup',
                      title: (
                        <TipTittle
                          tips="1.固定压力值：压力机将会全程保持最大并发量进行施压； 
                        2.线性递增：压力机将会以固定速率增压，直至达到最大并发量； 
                        3.阶梯递增：压力机将会以固定周期增压，每次增压后保持一段时间，直至达到最大并发量；"
                        >
                          施压模式
                        </TipTittle>
                      ),
                      'x-rules': [
                        {
                          required: true,
                          message: '请选择施压模式',
                        },
                      ],
                      'x-linkages': [
                        {
                          type: 'value:visible',
                          target: '.rampUp',
                          condition:
                            '{{ $self.value === 2 || $self.value === 3 }}',
                        },
                        {
                          type: 'value:visible',
                          target: '.steps',
                          condition: '{{ $self.value === 3 }}',
                        },
                      ],
                      default: 1,
                    })
                  }
                />

                <SchemaField
                  path={FormPath.parse(path).concat(`${x.xpathMd5}.rampUp`)}
                  schema={
                    new Schema({
                      type: 'number',
                      'x-component': 'NumberPicker',
                      title: (
                        <TipTittle tips="增压直至最大并发量的时间">
                          递增时长
                        </TipTittle>
                      ),
                      'x-component-props': {
                        placeholder: '请输入',
                        style: {
                          width: '100%',
                        },
                        min: 0,
                        addonAfter: <Button>分</Button>,
                      },
                      'x-rules': [
                        {
                          required: true,
                          message: '请输入递增时长',
                        },
                      ],
                    })
                  }
                />

                <SchemaField
                  path={FormPath.parse(path).concat(`${x.xpathMd5}.steps`)}
                  schema={
                    new Schema({
                      type: 'number',
                      'x-component': 'NumberPicker',
                      title: (
                        <TipTittle tips="并发量从0周期增加到最大并发量的次数">
                          阶梯层数
                        </TipTittle>
                      ),
                      'x-component-props': {
                        placeholder: '请输入',
                        min: 1,
                        max: 100,
                      },
                      'x-rules': [
                        {
                          required: true,
                          message: '请输入阶梯层数',
                        },
                        {
                          format: 'integer',
                          message: '请输入正整数',
                        },
                      ],
                    })
                  }
                />
              </Col>
              <Col span={12}>
                <FormSpy>
                  {({ state, form }) => {
                    return (
                      <FlowPreview
                        formValue={form.getFormState().values}
                        xpathMd5={x.xpathMd5}
                      />
                    );
                  }}
                </FormSpy>
              </Col>
            </Row>
          </Panel>
        );
      })}
    </Collapse>
  );
};

ConfigMap.isFieldComponent = true;

export default ConfigMap;
