import React, { useState, useEffect } from 'react';
import { CommonForm, CommonSelect, DatePick } from 'racc';
import { Input, Cascader, InputNumber } from 'antd';
import { FormDataType } from 'racc/dist/common-form/type';
import { WrappedFormUtils } from 'antd/lib/form/Form';
// import service from '../service';
import moment from 'moment';

interface Props {
  reportId: string | number;
  defaultQuery?: any;
  onSubmit: (params: any) => void;
  disabledKeys?: string[];
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
  const { defaultQuery, onSubmit, disabledKeys = [], ...rest } = props;
  // const [applicationList, setApplicationList] = useState([]);
  // const [middlewareList, setMiddlewareList] = useState([]);
  const [form, setForm] = useState<WrappedFormUtils>();

  // const getApplicationList = async () => {
  //   const {
  //     data: { success, data },
  //   } = await service.queryWaterLevelList({
  //     reportId: props.reportId,
  //   });
  //   if (success) {
  //     setApplicationList(
  //       data.map((x) => ({
  //         label: x.applicationName,
  //         value: x.applicationName,
  //       }))
  //     );
  //   }
  // };

  // const getMiddlewareList = async () => {
  //   const {
  //     data: { success, data },
  //   } = await service.middlewareList();
  //   if (success) {
  //     setMiddlewareList(data);
  //   }
  // };

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
              disabled: disabledKeys.includes('timeRange'),
              placeholder: ['开始时间', '结束时间'],
              showTime: true,
              style: { width: '100%' },
            }}
          />
        ),
        colProps: {
          xl: {
            span: 16,
          }
        },
      },
      {
        key: 'traceId',
        label: '',
        node: (
          <Input
            placeholder="TraceId"
            disabled={disabledKeys.includes('traceId')}
          />
        ),
      },
      // {
      //   key: 'appName',
      //   label: '',
      //   // colProps: {
      //   //   xl: {
      //   //     span: 8,
      //   //     offset: 8,
      //   //   }
      //   // },
      //   node: (
      //     <CommonSelect
      //       placeholder="入口应用"
      //       showSearch
      //       optionFilterProp="children"
      //       dataSource={applicationList}
      //       disabled={disabledKeys.includes('appName')}
      //     />
      //   ),
      // },
      // {
      //   key: 'middlewareName',
      //   label: '',
      //   node: (
      //     <Cascader
      //       disabled={disabledKeys.includes('middlewareName')}
      //       placeholder="调用类型"
      //       options={middlewareList}
      //       showSearch={{
      //         filter: (inputValue, path) => {
      //           return path.some(
      //             (option) =>
      //               option.label
      //                 .toLowerCase()
      //                 .indexOf(inputValue.toLowerCase()) > -1
      //           );
      //         },
      //       }}
      //     />
      //   ),
      // },
      // {
      //   key: 'serviceName',
      //   label: '',
      //   node: (
      //     <Input
      //       placeholder="按接口名模糊查询"
      //       disabled={disabledKeys.includes('serviceName')}
      //     />
      //   ),
      // },
      {
        key: 'resultType',
        label: '',
        node: (
          <CommonSelect
            disabled={disabledKeys.includes('resultType')}
            placeholder="调用结果"
            dataSource={[
              { label: '响应成功', value: 1 },
              { label: '响应失败', value: 0 },
              { label: '断言失败', value: 2 },
            ]}
          />
        ),
      },
      {
        key: 'request',
        label: '',
        node: (
          <Input
            placeholder="调用参数模糊查询"
            disabled={disabledKeys.includes('request')}
          />
        ),
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
          minCost,
          maxCost,
          startTime: startTime ? moment(startTime).valueOf() : undefined,
          endTime: endTime ? moment(endTime).valueOf() : undefined,
          timeRange: undefined,
          costRange: undefined,
        });
      }
    });
  };

  // useEffect(() => {
  //   getApplicationList();
  //   getMiddlewareList();
  // }, []);

  return (
    <CommonForm
      getForm={(f) => setForm(f)}
      formData={getFormData()}
      rowNum={3}
      {...rest}
      btnProps={{
        place: 'start',
      }}
      onSubmit={handleSubmit}
      onReset={() => {
        form?.resetFields();
        handleSubmit();
      }}
    />
  );
};

export default RequestFlowQueryForm;
