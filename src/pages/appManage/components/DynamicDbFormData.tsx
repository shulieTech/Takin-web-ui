/**
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import { Radio, Input, Icon, Tooltip, message } from 'antd';
import { DbDetailBean } from '../enum';
import AppManageService from '../service';
import { EditDynamicDbDrawerState } from './EditDynamicDbDrawer';
import { getRenderFormNode } from 'src/common/config-form/utils';
import { TempleteType } from 'src/common/config-form/types';

const getDynamicDbFormData = (
  state: EditDynamicDbDrawerState,
  action,
  setState,
  detailData
): FormDataType[] => {
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
   * @name 获取隔离方案（动态数据）
   */
  const queryType = async () => {
    const {
      data: { success, data }
    } = await AppManageService.queryType({});
    if (success) {
      setState({
        typeRadioData: data
      });
    }
  };

  /** @name 获取表单initialValue */
  const getFormItemInitialValue = keys => {
    let result = {};
    keys.split(',').forEach(item => {
      result = { ...result, [item]: state.dbTableDetail[item] };
    });
    return result;
  };

  const templateData: TempleteType[] = [
    {
      key: 'a',
      label: '影子数据源',
      nodeType: 1
    },
    {
      key: 'b',
      label: '影子数据源用户名',
      nodeType: 1
    },
    {
      key: 'c',
      label: '影子数据源密码',
      nodeType: 2
    },
    {
      key: 'd',
      label: '驱动',
      nodeType: 4,
      nodeInfo: {
        keys: 'config1,config2',
        dataSource: [
          {
            label: '跟随业务配置',
            value: '1'
          },
          {
            label: '自定义',
            value: '2'
          }
        ]
      }
    },
    {
      key: 'e',
      label: 'minldle',
      nodeType: 3,
      nodeInfo: {
        keys: 'config3,config4',
        dataSource: [
          {
            label: '跟随业务配置',
            value: '1'
          },
          {
            label: '自定义',
            value: '2'
          }
        ]
      }
    },
    {
      key: 'f',
      label: '',
      nodeType: 5,
      nodeInfo: {
        keys: 'config3,config4',
        dataSource: [
          {
            label: '跟随业务配置',
            value: '1'
          },
          {
            label: '自定义',
            value: '2'
          }
        ]
      }
    }
  ];

  const basicDbFormData = [
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
      node: <span>{detailData && detailData[DbDetailBean.中间件类型]}</span>
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
      node: <span>{detailData && detailData[DbDetailBean.中间件名称]}</span>
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
      node: <span>{detailData && detailData[DbDetailBean.业务数据源]}</span>
    }
  ];

  const dynamicFormData = [
    {
      key: DbDetailBean.隔离方案,
      label: '隔离方案',
      options: {
        initialValue: '1',
        // initialValue: detailData && detailData[DbDetailBean.隔离方案],
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

  const templeteFormData = templateData.map(
    (item, index): FormDataType => ({
      key: item.key,
      label: item.label,

      options: {
        // initialValue: getFormItemInitialValue(item.nodeInfo.keys),

        rules: [
          {
            required: true,
            message: '请检查表单必填项'
          }
        ]
      },
      formItemProps:
        item.nodeType === 5
          ? { labelCol: { span: 0 }, wrapperCol: { span: 24 } }
          : { labelCol: { span: 6 }, wrapperCol: { span: 14 } },
      node: getRenderFormNode(item)
    })
  );

  return [...basicDbFormData, ...dynamicFormData, ...templeteFormData];
};
export default getDynamicDbFormData;
