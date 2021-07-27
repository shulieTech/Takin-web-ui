/**
 * @name
 * @author MingShined
 */
import { Cascader, Input, InputNumber, message, Radio } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'dva';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { useEffect } from 'react';
import InputNumberPro from 'src/common/inputNumber-pro';
import { CommonModelState } from 'src/models/common';
import PressureTestSceneService from 'src/pages/pressureTestManage/pressureTestScene/service';
import { filter } from 'src/utils/utils';
import { SceneBean } from '../enum';
import MissionManageService from '../service';
interface Props extends CommonModelState {
  id?: string;
  btnText: string;
  onSuccess: () => void;
  applicationId: string;
}
const AddAndEditSceneModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    form: null as WrappedFormUtils,
    details: {},
    sceneType: '2',
    patrolDashbordDataSource: null,
    bussinessActivityAndScriptList: null,
    bussinessFlowAndScriptList: null,
    number: 0,
    radioValue: 1
  });
  const text = props.id ? '编辑场景' : '新增场景';

  const getDetails = async () => {
    queryBussinessActivityAndScript();
    queryBussinessFlowAndScript();
    queryPatrolSceneAndDashbordList();
    if (!props.id) {
      return;
    }
    const {
      data: { data, success }
    } = await MissionManageService.querySceneDetail({ id: props.id });
    if (success) {
      setState({ details: data });
    }
  };

  const handleChangeType = value => {
    setState({
      sceneType: value
    });
    state.form.setFieldsValue({
      scriptId: null
    });
  };

  /**
   * @name 获取所有业务活动和脚本
   */
  const queryBussinessActivityAndScript = async () => {
    const {
      data: { success, data }
    } = await PressureTestSceneService.queryBussinessActivityAndScript({});
    if (success) {
      setState({
        bussinessActivityAndScriptList:
          data &&
          data.map((item, k) => {
            return {
              id: item.id,
              name: item.name,
              disabled: item.scriptList ? false : true,
              scriptList: item.scriptList
            };
          })
      });
    }
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
              disabled: item.scriptList ? false : true,
              scriptList: item.scriptList
            };
          })
      });
    }
  };

  /**
   * @name 获取巡检场景和看板列表
   */
  const queryPatrolSceneAndDashbordList = async () => {
    const {
      data: { data, success }
    } = await MissionManageService.patrolDashbordDataSourceList({});
    if (success) {
      setState({
        patrolDashbordDataSource:
          data &&
          data.map((item, k) => {
            return { label: item.patrolBoardName, value: item.patrolBoardId };
          })
      });
    }
  };

  const handleChangeNumber = value => {
    setState({
      number: value
    });
  };
  const handleChangeRadio = value => {
    setState({
      radioValue: value
    });
  };

  const getFormData = (): FormDataType[] => {
    return [
      {
        key: SceneBean.场景名称,
        label: '场景名称',
        options: {
          initialValue: state.details[SceneBean.场景名称],
          rules: [{ required: true, message: '请输入正确场景名称', max: 20 }]
        },
        node: <Input placeholder="请输入场景名称（20字内）" />
      },
      {
        key: SceneBean.所属看板,
        options: {
          initialValue: state.details[SceneBean.所属看板],
          rules: [{ required: true, message: '请选择所属看板' }]
        },
        label: '所属看板',
        node: (
          <CommonSelect
            placeholder="请选择所属看板"
            dataSource={state.patrolDashbordDataSource || []}
          />
        )
      },
      {
        key: SceneBean.巡检周期,
        options: {
          initialValue: state.details[SceneBean.巡检周期] || 1,
          rules: [{ required: true, message: '请输入巡检周期' }]
        },
        label: '巡检周期',
        node: (
          <Radio.Group onChange={handleChangeRadio}>
            <Radio value={1}>默认巡检周期（5 秒）</Radio>
            <Radio value={2}>
              <InputNumber
                style={{ width: '90%' }}
                placeholder="请输入自定义巡检周期"
                min={5}
                max={300}
                onChange={handleChangeNumber}
                disabled={
                  state.form && state.form.getFieldsValue().patrolPeriod === 1
                    ? true
                    : false
                }
              />
              <span style={{ marginLeft: 4 }}>s</span>
            </Radio>
          </Radio.Group>
        )
      },
      {
        key: SceneBean.类型,
        options: {
          initialValue: state.details[SceneBean.类型] || '2',
          rules: [{ required: true, message: '请选择类型' }]
        },
        label: '类型',
        node: (
          <CommonSelect
            placeholder="请选择类型"
            dataSource={[
              {
                label: '业务活动',
                value: '1'
              },
              {
                label: '业务流程',
                value: '2'
              }
            ]}
            onChange={handleChangeType}
          />
        )
      },
      {
        key: SceneBean.脚本,
        options: {
          initialValue: state.details[SceneBean.脚本],
          rules: [{ required: true, message: '请选择脚本' }]
        },
        label: '脚本',
        node: (
          <Cascader
            allowClear={false}
            options={
              state.sceneType === '2'
                ? state.bussinessFlowAndScriptList || []
                : state.bussinessActivityAndScriptList || []
            }
            fieldNames={{
              label: 'name',
              value: 'id',
              children: 'scriptList'
            }}
            // onChange={(value, options) => {
            //   //   handleChangeBusinessFlow(value);
            // }}
            showSearch={{ filter }}
          />
        )
      }
    ];
  };
  const handleSubmit = () => {
    return new Promise(async resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.info('请检查表单必填项');
          resolve(false);
          return;
        }

        const result = {
          ...values,
          refId: values.scriptId[0],
          scriptId: values.scriptId[1],
          patrolPeriod: values.patrolPeriod === 2 ? state.number : 5
        };

        const ajaxEvent = props.id
          ? MissionManageService.editScene({
            ...state.details,
            ...result
          })
          : MissionManageService.addScene(result);
        const {
          data: { success }
        } = await ajaxEvent;
        if (success) {
          message.success(`${text}成功`);
          resolve(true);
          props.onSuccess();
          return;
        }
        resolve(false);
      });
    });
  };

  return (
    <CommonModal
      beforeOk={handleSubmit}
      modalProps={{ title: text, width: 720, destroyOnClose: true }}
      btnText={props.btnText}
      btnProps={{ type: props.id ? 'link' : 'primary' }}
      onClick={getDetails}
    >
      <CommonForm
        rowNum={1}
        formItemProps={{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }}
        btnProps={{ isResetBtn: false, isSubmitBtn: false }}
        getForm={form => setState({ form })}
        formData={getFormData()}
      />
    </CommonModal>
  );
};
export default connect(({ common }) => ({ ...common }))(AddAndEditSceneModal);
