/**
 * @name 步骤1-基本信息
 */

import React from 'react';

import { FormCardMultipleDataSourceBean } from 'src/components/form-card-multiple/type';
import { FormDataType } from 'racc/dist/common-form/type';
import InputNumberPro from 'src/common/inputNumber-pro';

interface Props {}

const TestRunConfig = (
  state,
  setState,
  props
): FormCardMultipleDataSourceBean => {
  /** @name 试跑配置设置 */
  const getTestRunConfigFormData = (): FormDataType[] => {
    const { location } = props;
    // const { query } = location;

    return [
      {
        key: '1',
        label: '试跑条数',
        options: {
          initialValue: undefined,
          rules: [
            {
              required: true,
              message: '请输入正确的试跑条数'
            }
          ]
        },
        formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 16 } },
        node: (
          <InputNumberPro
            placeholder="请输入试跑条数（不超过10000条）"
            precision={0}
            min={1}
            max={10000}
          />
        )
      }
    ];
  };

  return {
    title: '试跑配置设置',
    rowNum: 1,
    span: 20,
    formData: getTestRunConfigFormData()
  };
};

export default TestRunConfig;
