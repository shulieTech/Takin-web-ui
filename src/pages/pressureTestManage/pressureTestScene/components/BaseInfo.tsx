/**
 * @name 步骤1-基本信息
 */

import { Input } from 'antd';
import RadioGroup from 'antd/lib/radio/group';
import moment from 'moment';
import { DatePick } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React from 'react';
import { FormCardMultipleDataSourceBean } from 'src/components/form-card-multiple/type';
import { PressureTestSceneEnum } from '../enum';

interface Props {}

const BaseInfo = (state, setState, props): FormCardMultipleDataSourceBean => {
  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i = i + 1) {
      result.push(i);
    }
    return result;
  };
  /** @name 基本信息 */
  const getBaseInfoFormData = (): FormDataType[] => {
    const { location } = props;
    const { query } = location;
    const { action } = query;

    const { detailData } = state;
    const disabled = !state.isInterval;
    return [
      {
        key: 'pressureTestSceneName',
        label: '压测场景名称',
        options: {
          initialValue:
            action !== 'add' ? detailData.pressureTestSceneName : undefined,
          rules: [{ required: true, message: '请输入压测场景名称' }]
        },
        formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 16 } },
        node: <Input placeholder="请输入" />
      }
      // {
      //   key: PressureTestSceneEnum.是否定时,
      //   label: '是否定时启动',
      //   options: {
      //     initialValue:
      //       action !== 'add' ? detailData[PressureTestSceneEnum.是否定时] || false : false,
      //     rules: [{ required: true, message: '请选择是否定时启动' }]
      //   },
      //   formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 16 } },
      //   node: (
      //     <RadioGroup
      //       onChange={e => setState({ isInterval: e.target.value })}
      //       options={[
      //         { label: '非定时', value: false },
      //         {
      //           label: '定时',
      //           value: true
      //         }
      //       ]}
      //     />
      //   )
      // },
      // {
      //   key: PressureTestSceneEnum.定时时间,
      //   label: '启动时间',
      //   options: {
      //     initialValue:
      //       action !== 'add' ? detailData[PressureTestSceneEnum.定时时间] : undefined,
      //     rules: [{ required: !disabled, message: '请选择定时启动时间' }]
      //   },
      //   formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 16 } },
      //   node: (
      //     <DatePick
      //       datePickerProps={{
      //         disabled,
      //         showTime: { format: 'HH:mm' },
      //         format: 'YYYY-MM-DD HH:mm',
      //         disabledDate: current => current < moment().subtract('day', 1),
      //         disabledTime: current => ({
      //           disabledHours: () => range(0, moment().hour()),
      //           disabledMinutes: () => range(0, moment().minute() + 1)
      //         })
      //       }}
      //     />
      //   )
      // }
    ];
  };

  return {
    title: '基本信息',
    rowNum: 1,
    span: 14,
    formData: getBaseInfoFormData()
  };
};

export default BaseInfo;
