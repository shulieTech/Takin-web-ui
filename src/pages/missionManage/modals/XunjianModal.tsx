/**
 * @name
 * @author MingShined
 */
import { InputNumber, Input, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'dva';
import { CommonForm, CommonModal, useStateReducer } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { useEffect } from 'react';
import { CommonModelState } from 'src/models/common';
import { SceneBean } from '../enum';
import MissionManageService from '../service';
const InputGroup = Input.Group;
interface Props extends CommonModelState {
  id?: string;
}
const XunjianModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    form: null as WrappedFormUtils,
    details: {},
  });

  const getDetails = async () => {
    const {
      data: { data, success }
    } = await MissionManageService.assertGet({ chainId: props.id });
    if (success) {
      setState({ details: data });
    }
  };

  const getFormData = (): FormDataType[] => {
    return [
      {
        key: SceneBean.延迟时间,
        label: '延迟时间',
        options: {
          initialValue: state.details[SceneBean.延迟时间],
          rules: [{ required: true, message: '请输入延迟时间，最多15个字符' }]
        },
        node: (
            <InputNumber
              style={{ width: '90%' }}
              placeholder="请填写"
              min={0}
            />
        ),
        extra: (
          <span style={{ marginLeft: 10 }}>ms</span>
        )
      },
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
          id: window.location.href.split('=')[1].split('&')[0],
          chainId: props.id,
          isMq: 1,
          assertInfos: [],
          mqDelay: values.mqDelay
        };
        const {
          data: { success }
        } = await MissionManageService.createOrUpdate({ ...result });
        if (success) {
          resolve(true);
          message.success('保存成功');
          return;
        }
        resolve(false);
      });
    });
  };

  let modalProps = {};
  if (window.location.href.split('type=')[1] === 'detail') {
    modalProps = {
      title: '检查点编辑', width: 480, destroyOnClose: true,
      footer: null
    };
  } else {
    modalProps = { title: '检查点编辑', width: 480, destroyOnClose: true };
  }

  return (
    <CommonModal
      beforeOk={handleSubmit}
      modalProps={modalProps}
      btnText="编辑"
      btnProps={{ type: 'link' }}
      onClick={getDetails}
    >
      <CommonForm
        rowNum={1}
        formItemProps={{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }}
        btnProps={{ isResetBtn: false, isSubmitBtn: false }}
        getForm={form => setState({ form })}
        formData={getFormData()}
      />
    </CommonModal>
  );
};
export default (XunjianModal);
