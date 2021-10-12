/**
 * @author chuxu
 */
import React, { Fragment, useEffect } from 'react';
import { FormDataType } from 'racc/dist/common-form/type';
import { Radio, Icon, Tooltip, message } from 'antd';
import { DbDetailBean } from '../enum';
import AppManageService from '../service';
import { EditDynamicDbDrawerState } from './EditDynamicDbDrawer';
import { getRenderFormNode } from 'src/common/config-form/utils';
import copy from 'copy-to-clipboard';

const getDynamicDbFormData = (
  state: EditDynamicDbDrawerState,
  action,
  setState,
  detailData,
  middlewareType,
  agentSourceType,
  isNewData,
  cacheType
): FormDataType[] => {
  const { dbTableDetail } = state;
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
      isNewData,
      cacheType,
      agentSourceType,
      dsType: state.dsType
    });
    if (success) {
      setState({
        templateData: data || []
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

  const handleCopy = async value => {
    if (copy(value)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  };

  const basicDbFormData =
    middlewareType === '连接池'
      ? [
        {
          key: DbDetailBean.中间件类型,
          label: '中间件类型',
          options: {
            initialValue: detailData && detailData[DbDetailBean.中间件类型],
            rules: [
              {
                required: true
              }
            ]
          },
          node: (
              <span>{detailData && detailData[DbDetailBean.中间件类型]}</span>
            )
        },
        {
          key: DbDetailBean.中间件名称,
          label: '中间件名称',
          options: {
            initialValue: detailData && detailData[DbDetailBean.中间件名称],
            rules: [
              {
                required: true
              }
            ]
          },
          node: (
              <span>{detailData && detailData[DbDetailBean.中间件名称]}</span>
            )
        },
        {
          key: DbDetailBean.业务数据源,
          label: '业务数据源',
          options: {
            initialValue: detailData && detailData[DbDetailBean.业务数据源],

            rules: [
              {
                required: true
              }
            ]
          },
          node: (
              <span>{detailData && detailData[DbDetailBean.业务数据源]}</span>
            )
        }
      ]
      : [
        {
          key: DbDetailBean.中间件类型,
          label: '中间件类型',
          options: {
            initialValue: detailData && detailData[DbDetailBean.中间件类型],
            rules: [
              {
                required: true
              }
            ]
          },
          node: (
              <span>{detailData && detailData[DbDetailBean.中间件类型]}</span>
            )
        },
        {
          key: DbDetailBean.中间件名称,
          label: '中间件名称',
          options: {
            initialValue: detailData && detailData[DbDetailBean.中间件名称],
            rules: [
              {
                required: true
              }
            ]
          },
          node: (
              <span>{detailData && detailData[DbDetailBean.中间件名称]}</span>
            )
        },
        {
          key: DbDetailBean.业务集群,
          label: '业务集群',
          options: {
            initialValue: detailData && detailData[DbDetailBean.业务集群],
            rules: [
              {
                required: true
              }
            ]
          },
          node: (
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {detailData && detailData[DbDetailBean.业务集群]}
              </pre>
            )
        },
        {
          key: DbDetailBean.缓存模式,
          label: '缓存模式',
          options: {
            initialValue: detailData && detailData[DbDetailBean.缓存模式],
            rules: [
              {
                required: true
              }
            ]
          },
          node: <span>{detailData && detailData[DbDetailBean.缓存模式]}</span>
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

  const templeteFormData =
    state.templateData &&
    state.templateData.map(
      (item, index): FormDataType => ({
        key: item.key,
        label: item.tips ? (
          <Tooltip
            title={() => {
              return (
                <div>
                  <div style={{ textAlign: 'right' }}>
                    <a onClick={() => handleCopy(item.tips)}>复制</a>
                  </div>
                  <div style={{ width: 250, height: 400, overflow: 'scroll' }}>
                    {item.tips}
                  </div>
                </div>
              );
            }}
          >
            {item.label}
            <Icon style={{ marginLeft: 4 }} type="question-circle" />
          </Tooltip>
        ) : (
          <span>{item.label}</span>
        ),
        options: {
          initialValue:
            item.nodeType === 4
              ? state.dbTableDetail && state.dbTableDetail.tables
              : getFormItemInitialValue(item.nodeInfo ? [item.key] : item.key),
          rules: [
            {
              required: item.required ? true : false,
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

  return [...basicDbFormData, ...dynamicFormData, ...templeteFormData];
};
export default getDynamicDbFormData;
