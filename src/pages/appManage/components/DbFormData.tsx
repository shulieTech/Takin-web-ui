import React, { Fragment } from 'react';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import { Radio, Input, Icon, Tooltip, message } from 'antd';
import copy from 'copy-to-clipboard';
import { Controlled as CodeMirror } from 'react-codemirror2';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');

const getDbFormData = (state, id, setState, detailData): FormDataType[] => {
  const { dbTableDetail } = state;
  /**
   * @name 切换方案类型
   */
  const handleChange = async e => {
    setState({
      dsType: e.target.value,
      dbConfig: undefined
    });
  };

  /**
   * @name 切换类型
   */
  const handleChangeDbType = async value => {
    state.form.setFieldsValue({
      dsType: null
    });
    setState({
      dbType: value,
      dsType: null,
      dbConfig: undefined
    });
  };

  /**
   * @name 修改配置代码
   */
  const handleChangeCode = value => {
    // console.log('value', value);
    setState({
      config: value
    });
  };

  const handleCopy = async value => {
    if (copy(value)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  };
  const basicFormData = [
    {
      key: 'applicationName',
      label: '应用',
      options: {
        initialValue: detailData && detailData.applicationName,
        rules: [
          {
            required: true,
            whitespace: true,
            message: '请选择应用'
          }
        ]
      },
      node: <Input disabled={true} />
    },
    {
      key: 'dbType',
      label: '类型',
      options: {
        initialValue: dbTableDetail && dbTableDetail.dbType,
        rules: [
          {
            required: true,
            message: '请选择类型'
          }
        ]
      },
      node: (
        <CommonSelect
          placeholder="请选择类型"
          disabled={id ? true : false}
          dataSource={[]}
          onChange={handleChangeDbType}
          onRender={item => (
            <CommonSelect.Option key={item.value} value={item.value}>
              {item.label}
            </CommonSelect.Option>
          )}
        />
      )
    }
  ];

  const planTypeFormData = [
    {
      key: 'dsType',
      label: '方案类型',
      options: {
        initialValue: dbTableDetail && dbTableDetail.dsType,
        rules: [
          {
            required: true,
            message: '请选择方案类型'
          }
        ]
      },
      node: (
        <Radio.Group onChange={handleChange} disabled={id ? true : false}>
          <Radio value={0}>影子库</Radio>
          <Radio value={1}>影子表</Radio>
        </Radio.Group>
      )
    }
  ];

  const planTypeCacheFormData = [
    {
      key: 'dsType',
      label: '方案类型',
      options: {
        initialValue: dbTableDetail && dbTableDetail.dsType,
        rules: [
          {
            required: true,
            message: '请选择方案类型'
          }
        ]
      },
      node: (
        <Radio.Group onChange={handleChange} disabled={id ? true : false}>
          <Radio value={2}>影子server</Radio>
        </Radio.Group>
      )
    }
  ];

  const dbFormData = [
    {
      key: 'dbConfig',
      label: (
        <span>
          配置代码
          <Tooltip
            trigger="click"
            title={() => {
              return (
                <div>
                  <div style={{ textAlign: 'right' }}>
                    <a
                      onClick={() =>
                        handleCopy(
                          state.dsType === 2
                            ? state.cacheTempValue
                            : state.dbTempValue
                        )
                      }
                    >
                      复制
                    </a>
                  </div>
                  <div
                    style={{
                      maxHeight: 400,
                      minHeight: 200,
                      overflow: 'auto'
                    }}
                  >
                    {state.dsType === 2
                      ? state.cacheTempValue
                      : state.dbTempValue}
                  </div>
                </div>
              );
            }}
          >
            <Icon style={{ marginLeft: 4 }} type="question-circle" />
          </Tooltip>
        </span>
      ),
      options: {
        initialValue: dbTableDetail && dbTableDetail.config,
        rules: [
          {
            required: true,
            message: '请输入配置代码',
            whitespace: true
          }
        ]
      },
      node: (
        <Input.TextArea placeholder="请输入配置代码" style={{ height: 350 }} />
      )
    }
  ];

  const tableFormData = [
    {
      key: 'url',
      label: '数据库URL',
      options: {
        initialValue: dbTableDetail && dbTableDetail.url,
        rules: [
          {
            required: true,
            message: '请输入数据库URL',
            whitespace: true
          }
        ]
      },
      node: <Input placeholder="请输入" />
    },
    {
      key: 'tableConfig',
      label: '表名称',
      options: {
        initialValue: dbTableDetail && dbTableDetail.config,
        rules: [
          {
            required: true,
            message: '请输入表名称',
            whitespace: true
          }
        ]
      },
      node: (
        <Input.TextArea
          placeholder="请输入表名称，以逗号隔开"
          style={{ height: 300 }}
        />
      )
    }
  ];

  if (state.dbType === 0) {
    if (state.dsType === 0) {
      return basicFormData.concat(planTypeFormData).concat(dbFormData);
    }
    if (state.dsType === 1) {
      return basicFormData.concat(planTypeFormData).concat(tableFormData);
    }
    return basicFormData.concat(planTypeFormData);
  }

  if (state.dbType === 1) {
    if (state.dsType === 2) {
      return basicFormData.concat(planTypeCacheFormData).concat(dbFormData);
    }

    return basicFormData.concat(planTypeCacheFormData);
  }

  return basicFormData;
};
export default getDbFormData;
