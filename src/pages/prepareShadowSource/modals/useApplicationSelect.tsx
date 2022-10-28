import React, { useState, useEffect } from 'react';
import useListService from 'src/utils/useListService';
import services from 'src/pages/businessActivity/service';
import { debounce } from 'lodash';

// initialValue为包含所选label，用于编辑时回显
export default (detail) => {
  const {
    list = [],
    getList,
    loading,
  } = useListService({
    service: services.searchApp,
    defaultQuery: {
      current: 0,
      pageSize: 20,
    },
  });

  const includeInitialValueList = list.map((x) => ({
    label: x.applicationName,
    value: x.id,
  }));

  if (detail.applicationId && detail.applicationName) {
    const initialValue = [
      { label: detail.applicationName, value: detail.applicationId },
    ];
    // 如果初始值不在list中，手动插入
    initialValue.forEach((x) => {
      if (!includeInitialValueList.some((y) => y.value === x.value)) {
        includeInitialValueList.unshift(x);
      }
    });
  }

  return {
    loading,
    editable: !(detail.id || detail.dsKey),
    allowClear: true,
    props: {
      dataSource: includeInitialValueList,
      placeholder: '输入关键字搜索应用',
      // mode: 'multiple',
      maxLength: 1,
      showSearch: true,
      filterOption: false,
      onSearch: debounce((val) => {
        getList({
          applicationName: val,
          current: 0,
        });
      }, 300),
      onBlur: () => {
        getList({
          applicationName: undefined,
          current: 0,
        });
      },
    },
    rules: [
      {
        required: true,
        message: '请选择应用范围',
      },
    ],
  };
};
