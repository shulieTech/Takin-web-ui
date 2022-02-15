import React, { Fragment } from 'react';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import { Radio, Input, InputNumber } from 'antd';

const getAppFormData = (state, action, setState): FormDataType[] => {
  const { dbTableDetail, appDetail } = state;

  const handleChangeAppName = e => {
    setState({
      appName: e.target.value
    });
  };

  const basicFormData = [
    {
      key: 'applicationName',
      label: '应用名',
      options: {
        initialValue:
          action !== 'add' ? appDetail && appDetail.applicationName : undefined,
        rules: [
          {
            required: true,
            message: '请输入应用名',
            whitespace: true
          }
        ]
      },
      node: (
        <Input
          placeholder="请输入"
          onChange={value => handleChangeAppName(value)}
        />
      )
    },
    {
      key: 'applicationDesc',
      label: '应用说明',
      options: {
        initialValue:
          action !== 'add' ? appDetail && appDetail.applicationDesc : undefined,
        rules: [
          {
            required: false,
            message: '请输入应用说明',
            whitespace: true
          }
        ]
      },
      node: <Input placeholder="请输入" />
    },
    {
      key: 'nodeNum',
      label: '节点数量',
      options: {
        initialValue:
          action !== 'add' ? appDetail && appDetail.nodeNum : undefined,
        rules: [
          {
            required: true,
            message: '请输入节点数量'
          }
        ]
      },
      node: <InputNumber placeholder="请输入" min={1} />
    },
    {
      key: 'ddlScriptPath',
      label: '影子库结构脚本路径',
      options: {
        initialValue: `${state.appName ? state.appName : ''}/ddl.sh`,
        rules: [
          {
            required: true,
            whitespace: true,
            message: '请输入影子库结构脚本路径'
          }
        ]
      },
      node: <Input placeholder="请输入" disabled={true} />
    },
    {
      key: 'cleanScriptPath',
      label: '数据库清理脚本路径',
      options: {
        initialValue: `${state.appName ? state.appName : ''}/clean.sh`,
        rules: [
          {
            required: true,
            whitespace: true,
            message: '请输入数据库清理脚本路径'
          }
        ]
      },
      node: <Input placeholder="请输入" disabled={true} />
    },
    {
      key: 'readyScriptPath',
      label: '基础数据准备脚本路径',
      options: {
        initialValue: `${state.appName ? state.appName : ''}/ready.sh`,
        rules: [
          {
            required: true,
            whitespace: true,
            message: '请输入基础数据准备脚本路径'
          }
        ]
      },
      node: <Input placeholder="请输入" disabled={true} />
    },
    {
      key: 'basicScriptPath',
      label: '铺底数据脚本路径',
      options: {
        initialValue: `${state.appName ? state.appName : ''}/basic.sh`,
        rules: [
          {
            required: true,
            whitespace: true,
            message: '请输入基础数据准备脚本路径'
          }
        ]
      },
      node: <Input placeholder="请输入" disabled={true} />
    },
    {
      key: 'cacheScriptPath',
      label: '缓存预热脚本路径',
      options: {
        initialValue: `${state.appName ? state.appName : ''}/cache.sh`,
        rules: [
          {
            required: true,
            whitespace: true,
            message: '请输入基础数据准备脚本路径'
          }
        ]
      },
      node: <Input placeholder="请输入" disabled={true} />
    }
  ];
  return basicFormData;
};
export default getAppFormData;
