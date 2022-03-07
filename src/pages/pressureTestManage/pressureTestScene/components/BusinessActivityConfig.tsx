/**
 * @name 步骤1-基本信息
 */

import { Cascader, Radio } from 'antd';
import _ from 'lodash';
import { FormDataType } from 'racc/dist/common-form/type';
import React from 'react';
import { FormCardMultipleDataSourceBean } from 'src/components/form-card-multiple/type';
import { TestMode } from '../enum';
import PressureTestSceneService from '../service';
import BusinessActivityConfigTable from './BusinessActivityConfigTable';

interface Props { }
declare var serverUrls: string;
const BusinessActivityConfig = (
  state,
  setState,
  props
): FormCardMultipleDataSourceBean => {
  const getBaseInfoFormData = (): FormDataType[] => {
    const { location } = props;
    const { query } = location;
    const { action } = query;

    const { detailData } = state;

    const handleChangeConfigType = value => {
      setState({
        configType: value
      });
      if (value === 2) {
        setState({
          businessFlowId: undefined
        });
      }
      if (value === 1) {
        setState({
          initList: [
            {
              businessActivityId: '',
              businessActivityName: '',
              scriptId: '',
              targetTPS: '',
              targetRT: '',
              targetSuccessRate: '',
              targetSA: ''
            }
          ]
        });
      }
    };

    const handleChangeBusinessFlow = value => {
      setState({
        businessFlowId: value
      });
      queryBussinessActivityListWithBusinessFlow({
        businessFlowId: value[0]
      });
    };

    /**
     * @name 获取所有业务流程和脚本
     */
    const queryBussinessFlowAndScript = async () => {
      const {
        data: { success, data }
      } = await PressureTestSceneService.queryBussinessFlowAndScript({});
      if (success) {
        setState({
          bussinessFlowAndScriptList:
            data &&
            data.map((item, k) => {
              return {
                id: item.id,
                name: item.name,
                // <span>
                //   {item.name}
                //   {!item.scriptList && (
                //     <a
                //       target="_blank"
                //       href={`${serverUrls}/#/scriptManage/scriptConfig?action=add&configType=2&relatedId=${item.id}`}
                //       style={{ float: 'right', marginLeft: 16 }}
                //     >
                //       <Button type="primary" size="small">
                //         配置脚本
                //       </Button>
                //     </a>
                //   )}
                // </span>
                disabled: item.scriptList ? false : true,
                scriptList: item.scriptList
              };
            })
        });
      }
    };

    /**
     * @name 根据业务流程获取所有业务活动列表
     */
    const queryBussinessActivityListWithBusinessFlow = async value => {
      const {
        data: { success, data }
      } = await PressureTestSceneService.queryBussinessActivityListWithBusinessFlow(
        { ...value }
      );
      if (success) {
        setState({
          initList: data,
          selectedBussinessActivityIds:
            data &&
            data.map((item, k) => {
              return item.businessActivityId;
            }),
          status: true,
        });
      }
    };

    const handleChangeConcurrenceNum = _.debounce(async list => {
      setState({
        businessList: list,
        selectedBussinessActivityIds: [list[0].businessActivityId],
        status: true
      });
      if (state.testMode !== TestMode.TPS模式) {
        return;
      }
      const isEmpty = list.find(item => !item.targetTPS);
      if (isEmpty) {
        return;
      }
      let tpsNum = 0;
      list.forEach(item => {
        tpsNum += item.targetTPS;
      });
      if (state.tpsNum === tpsNum) {
        return;
      }
      const {
        data: { success, data }
      } = await PressureTestSceneService.getMaxMachineNumber({
        tpsNum
      });
      if (success) {
        setState({
          tpsNum,
          ipNum: data.min,
          minIpNum: data.min,
          maxIpNum: data.max
        });
      }
    }, 800);

    function filter(inputValue, path) {
      return path.some(
        option =>
          option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      );
    }

    const displayRender = (labels, selectedOptions) =>
      labels.map((label, i) => {
        const option = selectedOptions[i];
        if (i === labels.length - 1) {
          return <span key={option.value}>{label}</span>;
        }
        return <span key={option.value}>{label} / </span>;
      });
    const basicFormData = [
      {
        key: 'configType',
        label: '配置类型',
        options: {
          initialValue:
            action !== 'add' ? detailData.configType : state.configType,
          rules: [{ required: true, message: '请输入业务活动配置' }]
        },
        formItemProps: { labelCol: { span: 2 }, wrapperCol: { span: 10 } },
        node: (
          <Radio.Group onChange={e => handleChangeConfigType(e.target.value)}>
            <Radio value={1}>业务活动</Radio>
            <Radio value={2}>业务流程</Radio>
          </Radio.Group>
        )
      }
    ];

    const businessActivityConfigList = [
      {
        key: 'businessActivityConfig',
        label: '',
        options: {
          initialValue: state.initList,
          rules: [{ required: true, message: '请输入业务活动配置' }]
        },
        formItemProps: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        node: (
          <BusinessActivityConfigTable
            onChange={handleChangeConcurrenceNum}
            state={state}
            setState={setState}
          />
        )
      }
    ];

    const businessFlowFormData = [
      {
        key: 'businessFlow',
        label: '业务流程',
        options: {
          initialValue:
            action !== 'add'
              ? [state.businessFlowId, detailData.scriptId]
              : state.businessFlowId,
          rules: [{ required: true, message: '请选择业务流程' }]
        },
        formItemProps: { labelCol: { span: 2 }, wrapperCol: { span: 10 } },
        node: (
          <Cascader
            allowClear={false}
            options={
              state.bussinessFlowAndScriptList
                ? state.bussinessFlowAndScriptList
                : []
            }
            fieldNames={{
              label: 'name',
              value: 'id',
              children: 'scriptList'
            }}
            onChange={(value, options) => {
              handleChangeBusinessFlow(value);
            }}
            // onFocus={() => queryBussinessFlowAndScript()}
            // displayRender={displayRender}
            showSearch={{ filter }}
          />
        )
      }
    ];

    let formData = [];

    if (state.configType === 1) {
      formData = basicFormData.concat(businessActivityConfigList);
    }
    if (state.configType === 2) {
      formData = basicFormData.concat(businessFlowFormData);
    }
    if (state.businessFlowId && state.configType === 2) {
      formData = basicFormData
        .concat(businessFlowFormData)
        .concat(businessActivityConfigList);
    }
    if (state.configType === null) {
      formData = basicFormData;
    }

    return formData;
  };

  return {
    title: '业务活动配置',
    rowNum: 1,
    span: 24,
    formData: getBaseInfoFormData()
  };
};

export default BusinessActivityConfig;
