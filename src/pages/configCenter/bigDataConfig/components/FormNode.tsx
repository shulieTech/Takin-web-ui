import { Input } from 'antd';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React from 'react';
import { BigDataBean } from '../enum';
import { BigDataConfigState } from '../indexPage';

const getFormData = (
  state: BigDataConfigState,
  setState: (state: Partial<BigDataConfigState>) => void
): FormDataType[] => {
  return [
    {
      key: BigDataBean.key,
      label: '',
      node: <CommonSelect dataSource={[]} placeholder="key" />
    },
    {
      key: BigDataBean.说明,
      label: '',
      node: <Input placeholder="说明" />
    }
  ];
};

export default getFormData;
