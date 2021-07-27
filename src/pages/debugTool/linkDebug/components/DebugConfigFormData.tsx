import React, { Fragment } from 'react';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import CodeMirrorWrapper from 'src/common/code-mirror-rapper/CodeMirrorWrapper';
import { Input, InputNumber, Switch } from 'antd';
import InputNumberPro from 'src/common/inputNumber-pro';
import { LinkDebugState } from '../indexPage';
import LinkDebugService from '../service';

const getDebugConfigFormData = (
  state: LinkDebugState,
  setState,
  dictionaryMap
): FormDataType[] => {
  const { linkDebugConfigDetail, pageStatus } = state;
  const handleChangeSwitch = () => {
    setState({
      isRedirect: !state.isRedirect,
      isChanged: true
    });
  };

  /**
   * @name 获取数据验证列表
   */
  const queryMissingDataList = async value => {
    const {
      data: { success, data }
    } = await LinkDebugService.queryMissingDataList({ businessLinkId: value });
    if (success) {
      setState({
        missingDataList: data
      });
    }
  };

  const basicFormData = [
    {
      key: 'name',
      label: '配置名称',
      options: {
        initialValue:
          state.pageStatus === 'clone'
            ? linkDebugConfigDetail && `${linkDebugConfigDetail.name}_副本`
            : state.selectedId
            ? linkDebugConfigDetail && linkDebugConfigDetail.name
            : undefined,
        rules: [
          {
            required: true,
            message: '请输入配置名称'
          }
        ]
      },
      node: (
        <Input
          autocomplete="off"
          onChange={() => {
            setState({
              isChanged: true
            });
          }}
          placeholder="请输入配置名称"
          disabled={
            pageStatus === 'query' || pageStatus === 'edit' ? true : false
          }
        />
      )
    },
    {
      key: 'businessLinkId',
      label: '业务活动',
      options: {
        initialValue:
          state.selectedId || state.pageStatus === 'clone'
            ? linkDebugConfigDetail &&
              linkDebugConfigDetail.businessLinkId &&
              String(linkDebugConfigDetail.businessLinkId)
            : undefined,
        rules: [
          {
            required: true,
            message: '请选择业务活动'
          }
        ]
      },
      node: (
        <CommonSelect
          onChange={(value, options) => {
            setState({
              isChanged: true
            });
            if (!state.form.getFieldValue('name')) {
              state.form.setFieldsValue({
                name: options.props.children
              });
            }
            if (value) {
              setState({
                businessLinkId: value
              });
              return;
            }
            setState({
              missingDataList: null
            });
          }}
          placeholder="请选择业务活动"
          dataSource={state.bussinessActiveList || []}
          disabled={
            pageStatus === 'query' || pageStatus === 'edit' ? true : false
          }
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        />
      )
    },
    {
      key: 'httpMethod',
      label: '请求类型',
      options: {
        initialValue:
          state.selectedId || state.pageStatus === 'clone'
            ? linkDebugConfigDetail && linkDebugConfigDetail.httpMethod
            : undefined,
        rules: [
          {
            required: true,
            message: '请选择请求类型'
          }
        ]
      },
      node: (
        <CommonSelect
          onChange={() => {
            setState({
              isChanged: true
            });
          }}
          placeholder="请选择请求类型"
          dataSource={
            dictionaryMap && dictionaryMap.DEBUG_REQUEST_TYPE
              ? dictionaryMap.DEBUG_REQUEST_TYPE
              : []
          }
          disabled={pageStatus === 'query' ? true : false}
        />
      )
    },
    {
      key: 'timeout',
      label: '超时时间（ms）',
      options: {
        initialValue:
          state.selectedId || state.pageStatus === 'clone'
            ? linkDebugConfigDetail && linkDebugConfigDetail.timeout
            : 5000,
        rules: [
          {
            required: true,
            message: '请输入超时时间'
          }
        ]
      },
      node: (
        <InputNumberPro
          onChange={() => {
            setState({
              isChanged: true
            });
          }}
          placeholder="请输入超时时间"
          min={300}
          precision={0}
          disabled={pageStatus === 'query' ? true : false}
        />
      )
    },
    {
      key: 'requestUrl',
      label: 'URL',
      options: {
        initialValue:
          state.selectedId || state.pageStatus === 'clone'
            ? linkDebugConfigDetail && linkDebugConfigDetail.requestUrl
            : undefined,

        rules: [
          {
            required: true,
            message: '请输入URL'
          }
        ]
      },
      node: (
        <Input
          autocomplete="off"
          onChange={() => {
            setState({
              isChanged: true
            });
          }}
          placeholder="请输入url"
          disabled={pageStatus === 'query' ? true : false}
        />
      )
    },

    {
      key: 'isRedirect',
      label: '允许302跳转',
      options: {
        initialValue: state.isRedirect,
        rules: [
          {
            required: true,
            message: '请选择是否允许302跳转'
          }
        ]
      },
      node: (
        <Switch
          checked={state.isRedirect}
          onChange={handleChangeSwitch}
          disabled={pageStatus === 'query' ? true : false}
        />
      )
    }
  ];
  return basicFormData;
};
export default getDebugConfigFormData;
