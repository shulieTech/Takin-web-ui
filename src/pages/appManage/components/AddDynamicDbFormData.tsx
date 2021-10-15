/**
 * @author chuxu
 */
import React, { Fragment, useEffect } from 'react';
import { FormDataType } from 'racc/dist/common-form/type';
import { Input, Radio } from 'antd';
import { DbDetailBean } from '../enum';
import AppManageService from '../service';
import { getRenderFormNode } from 'src/common/config-form/utils';
import { AddDynamicDbDrawerState } from './AddDynamicDbDrawer';
import { CommonSelect } from 'racc';

const getAddDynamicDbFormData = (
  state: AddDynamicDbDrawerState,
  action,
  setState,
  detailData,
  agentSourceType
): FormDataType[] => {
  useEffect(() => {
    if (state.dsType) {
      queryTemplate();
    }
  }, [state.dsType]);
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
   * @name 获取隔离方案动态模板
   */
  const queryTemplate = async () => {
    const {
      data: { success, data }
    } = await AppManageService.queryTemplate({
      agentSourceType: state.form.getFieldsValue().middlewareType,
      dsType: state.dsType,
      cacheType: state.cacheType,
      isNewData: true
    });
    if (success) {
      setState({
        templateData: data || []
      });
    }
  };

  /**
   * @name 切换方案类型
   */
  const handleChangeMiddleWareType = async (value, options) => {
    queryMiddleWareName(options.props.children);

    state.form.setFieldsValue({
      middleWareType: undefined
    });
    setState({
      dbType: options.props.children,
      middleWareName: undefined,
      middleWareNameData: [],
      templateData: []
    });
  };
  /**
   * @name 切换中间件名称
   */
  const handleChangeMiddleWareName = async value => {
    queryType(state.dbType, value);
    if (state.dbType === '缓存') {
      queryCacheType();
    }
    setState({
      middleWareName: value
    });
  };
  /**
   * @name 切换缓存模式
   */
  const handleChangeCacheType = async value => {
    setState({
      cacheType: value,
      templateData: []
    });
    state.form.setFieldsValue({
      dsType: undefined
    });
  };

  /**
   * @name 获取缓存类型
   */
  const queryCacheType = async () => {
    const {
      data: { success, data }
    } = await AppManageService.queryCacheType({});
    if (success) {
      setState({
        cacheTypeData: data || []
      });
    }
  };

  /**
   * @name 获取隔离方案（动态数据）
   */
  const queryType = async (middlewareType, plugName) => {
    const {
      data: { success, data }
    } = await AppManageService.queryDynamicProgramme({
      middlewareType,
      plugName
    });
    if (success) {
      setState({
        typeRadioData: data
      });
    }
  };
  /**
   * @name 获取中间件名称
   */
  const queryMiddleWareName = async middlewareType => {
    const {
      data: { success, data }
    } = await AppManageService.queryMiddleWareName({
      middlewareType
    });
    if (success) {
      setState({
        middleWareNameData: data || []
      });
    }
  };

  /** @name 获取表单initialValue */
  const getFormItemInitialValue = keys => {
    let result = null;
    result =
      state.dbTableDetail.shadowInfo &&
      JSON.parse(state.dbTableDetail.shadowInfo) &&
      JSON.parse(state.dbTableDetail.shadowInfo)[keys];
    return result;
  };

  const basicDbFormData = [
    {
      key: 'applicationName',
      label: '应用',
      options: {
        initialValue: detailData && detailData.applicationName,
        rules: [
          {
            required: true,
            message: '请选择应用'
          }
        ]
      },
      node: <Input disabled={true} />
    },
    {
      key: 'middlewareType',
      label: '类型',
      options: {
        initialValue: undefined,
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
          dataSource={state.middleWareType || []}
          allowClear={false}
          onChange={(value, options) =>
            handleChangeMiddleWareType(value, options)
          }
          onRender={item => (
            <CommonSelect.Option key={item.value} value={item.value}>
              {item.label}
            </CommonSelect.Option>
          )}
        />
      )
    },
    {
      key: 'middleWareType',
      label: '中间件名称',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请选择类型'
          }
        ]
      },
      node: (
        <CommonSelect
          placeholder="请选择中间件名称"
          dataSource={state.middleWareNameData || []}
          onChange={handleChangeMiddleWareName}
          onRender={item => (
            <CommonSelect.Option key={item.value} value={item.value}>
              {item.label}
            </CommonSelect.Option>
          )}
        />
      )
    }
  ];

  const linkFormData = [
    {
      key: DbDetailBean.业务数据源,
      label: '业务数据源',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请输入业务数据源'
          }
        ]
      },
      node: <Input placeholder="请输入业务数据源" />
    }
  ];

  const cacheTypeFormData = [
    {
      key: DbDetailBean.业务集群,
      label: '业务集群',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请输入业务集群'
          }
        ]
      },
      node: <Input placeholder="请输入业务集群" />
    },
    {
      key: DbDetailBean.缓存模式,
      label: '缓存模式',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请选择缓存模式'
          }
        ]
      },
      node: (
        <CommonSelect
          placeholder="请选择缓存模式"
          dataSource={state.cacheTypeData || []}
          onChange={handleChangeCacheType}
          onRender={item => (
            <CommonSelect.Option key={item.value} value={item.value}>
              {item.label}
            </CommonSelect.Option>
          )}
        />
      )
    }
  ];

  const dynamicFormData = [
    {
      key: DbDetailBean.隔离方案,
      label: '隔离方案',
      options: {
        initialValue: detailData && String(detailData[DbDetailBean.隔离方案]),
        rules: [
          {
            required: true,
            message: '请选择隔离方案'
          }
        ]
      },
      node: (
        <Radio.Group onChange={handleChange}>
          {state.typeRadioData.map((item, k) => {
            return (
              <Radio key={k} value={item.value}>
                {item.label}
              </Radio>
            );
          })}
        </Radio.Group>
      )
    }
  ];

  const templeteFormData = state.templateData.map(
    (item, index): FormDataType => ({
      key: item.key,
      label: item.label,
      options: {
        initialValue:
          item.nodeType === 4
            ? state.dbTableDetail && state.dbTableDetail.tables
            : getFormItemInitialValue(item.nodeInfo ? [item.key] : item.key),
        rules: [
          {
            required: true,
            message: '请检查表单必填项'
          }
        ]
      },
      formItemProps:
        item.nodeType === 4
          ? { labelCol: { span: 0 }, wrapperCol: { span: 24 } }
          : { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
      node: getRenderFormNode(item)
    })
  );

  if (state.dbType && state.middleWareName) {
    if (state.dbType === '缓存') {
      if (state.cacheType) {
        return [
          ...basicDbFormData,
          ...cacheTypeFormData,
          ...dynamicFormData,
          ...templeteFormData
        ];
      }
      return [...basicDbFormData, ...cacheTypeFormData];
    }
    if (state.dbType === '连接池') {
      return [
        ...basicDbFormData,
        ...linkFormData,
        ...dynamicFormData,
        ...templeteFormData
      ];
    }
  }
  return [...basicDbFormData];
};
export default getAddDynamicDbFormData;
