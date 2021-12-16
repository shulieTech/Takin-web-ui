/**
 * @name 步骤1-基本信息
 */

import React from 'react';

import { FormCardMultipleDataSourceBean } from 'src/components/form-card-multiple/type';
import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import { CommonSelect } from 'racc';

interface Props {}

const StepABaseInfo = (
  state,
  setState,
  props
): FormCardMultipleDataSourceBean => {
  const { businessFlowStep, bussinessFlowDetail } = state;

  /** @name 基本信息 */
  const GetBaseInfoFormData = (): FormDataType[] => {
    const { location } = props;
    const { query } = location;
    const { action } = query;
    const { dictionaryMap } = props;
    const { isCore, link_level } = dictionaryMap;
    return [
      {
        key: 'sceneName',
        label: '业务流程名称',
        options: {
          initialValue:
            action !== 'add'
              ? bussinessFlowDetail && bussinessFlowDetail.businessProcessName
              : undefined,
          rules: [{ required: true, message: '请输入业务流程名称' }]
        },
        node: <Input placeholder="请输入" />
      },
      {
        key: 'isCore',
        label: '业务流程类型',
        options: {
          initialValue:
            action !== 'add'
              ? bussinessFlowDetail && bussinessFlowDetail.isCode
              : undefined,
          rules: [{ required: true, message: '请选择业务流程类型' }]
        },
        node: (
          <CommonSelect
            placeholder="请选择业务流程类型"
            dataSource={isCore ? isCore : []}
          />
        )
      },
      {
        key: 'sceneLevel',
        label: '业务流程级别',
        options: {
          initialValue:
            action !== 'add'
              ? bussinessFlowDetail && bussinessFlowDetail.level
              : undefined,
          rules: [{ required: true, message: '请选择业务流程级别' }]
        },
        node: (
          <CommonSelect
            placeholder="请选择业务流程级别"
            dataSource={link_level ? link_level : []}
          />
        )
      }
    ];
  };

  return {
    title: '基本信息',
    hide: businessFlowStep !== 1,
    rowNum: 1,
    span: 14,
    formData: GetBaseInfoFormData()
  };
};

export default StepABaseInfo;
