import React, { useState, useEffect } from 'react';
import { CommonForm, CommonSelect, DatePick } from 'racc';
import { Input, Cascader, InputNumber } from 'antd';
import { FormDataType } from 'racc/dist/common-form/type';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import service from '../service';
import moment from 'moment';

interface Props {
  defaultQuery?: any;
  onSubmit: (params: any) => void;
}

const CostRange = (props) => {
  const { value = [], onChange } = props;
  const inputStyle = {
    width: '50%',
    // backgroundColor: 'transparent',
    // borderColor: '#57575a',
    // color: '#d1d3dd',
  };
  return (
    <Input.Group compact>
      <InputNumber
        style={inputStyle}
        placeholder="最小耗时"
        value={value?.[0]}
        onChange={(val) => {
          const _value = value.concat();
          _value[0] = val;
          onChange(_value);
        }}
        min={0}
      />
      <InputNumber
        style={inputStyle}
        placeholder="最大耗时"
        value={value?.[1]}
        onChange={(val) => {
          const _value = value.concat();
          _value[1] = val;
          onChange(_value);
        }}
        min={0}
      />
    </Input.Group>
  );
};

const RequestFlowQueryForm: React.FC<Props> = (props) => {
  const { defaultQuery, onSubmit, ...rest } = props;
  const [applicationList, setApplicationList] = useState([]);
  const [middlewareList, setMiddlewareList] = useState([]);
  const [form, setForm] = useState<WrappedFormUtils>();

  const getApplicationList = async () => {
    const {
      data: { success, data },
    } = await service.listDictionary();
    if (success) {
      setApplicationList(
        data.map((x) => ({
          label: x.applicationName,
          value: x.applicationName,
        }))
      );
    }
  };

  const getMiddlewareList = async () => {
    const {
      data: { success, data },
    } = await service.middlewareList();
    if (success) {
      setMiddlewareList(data);
    }
  };

  const getFormData = (): FormDataType[] => {
    return [
      {
        key: 'timeRange',
        label: '',
        options: {
          initialValue: defaultQuery?.timeRange,
        },
        node: (
          <DatePick
            type="range"
            rangePickerProps={{
              placeholder: ['开始时间', '结束时间'],
              showTime: true,
              style: { width: '100%' },
            }}
          />
        ),
      },
      {
        key: 'traceId',
        label: '',
        node: <Input placeholder="TraceId" />,
      },
      {
        key: 'appName',
        label: '',
        node: (
          <CommonSelect
            placeholder="入口应用"
            showSearch
            optionFilterProp="children"
            dataSource={applicationList}
          />
        ),
      },
      {
        key: 'middlewareName',
        label: '',
        node: (
          <Cascader
            placeholder="调用类型"
            options={middlewareList}
            showSearch={{
              filter: (inputValue, path) => {
                return path.some(
                  (option) =>
                    option.label
                      .toLowerCase()
                      .indexOf(inputValue.toLowerCase()) > -1
                );
              },
            }}
          />
        ),
      },
      {
        key: 'interfaceName',
        label: '',
        node: <Input placeholder="按接口名模糊查询" />,
      },
      {
        key: 'resultType',
        label: '',
        node: (
          <CommonSelect
            placeholder="调用结果"
            dataSource={[
              { label: '响应成功', value: 1 },
              { label: '响应失败', value: 2 },
            ]}
          />
        ),
      },
      {
        key: 'request',
        label: '',
        node: <Input placeholder="调用参数模糊查询" />,
      },
      {
        key: 'costRange',
        label: '',
        node: <CostRange />,
      },
    ];
  };

  const handleSubmit = () => {
    form?.validateFields((error, values) => {
      if (!error) {
        const [startTime, endTime] = Array.isArray(values.timeRange)
          ? values.timeRange
          : [];
        const [minCost, maxCost] = Array.isArray(values.costRange)
          ? values.costRange
          : [];
        const middlewareName = Array.isArray(values.middlewareName)
          ? values.middlewareName.at(-1)
          : undefined;

        onSubmit({
          ...values,
          middlewareName,
          startTime: startTime ? moment(startTime).valueOf() : undefined,
          endTime: endTime ? moment(endTime).valueOf() : undefined,
          timeRange: undefined,
          costRange: undefined,
          minCost: minCost || undefined,
          maxCost: maxCost || undefined,
        });
      }
    });
  };

  useEffect(() => {
    getApplicationList();
    getMiddlewareList();
  }, []);

  return (
    <CommonForm
      getForm={(f) => setForm(f)}
      formData={getFormData()}
      {...rest}
      onSubmit={handleSubmit}
      onReset={() => {
        form?.resetFields();
        handleSubmit();
      }}
    />
  );
};

export default RequestFlowQueryForm;
