/**
 * @name
 * @author MingShined
 */
import { Cascader, Input, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'dva';
import { CommonForm, CommonModal, useStateReducer } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { useEffect } from 'react';
import { CommonModelState } from 'src/models/common';
import { SceneBean } from '../enum';
import MissionManageService from '../service';

interface Props extends CommonModelState {
  id?: string;
  btnText: string;
  onSuccess: () => void;
  row: any;
}
const NewKanbanModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    form: null as WrappedFormUtils,
    details: {},
  });
  const text = props.id ? '编辑看板' : '新增看板';

  const getFormData = (): FormDataType[] => {
    return [
      {
        key: SceneBean.看板名称,
        label: '看板名称',
        options: {
          initialValue: props.row && props.row[SceneBean.看板名称],
          rules: [{ required: true, message: '请输入看板名称，最多15个字符' }]
        },
        node: <Input placeholder="请输入看板名称，最多15个字符" maxLength={15} />
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
          ...values,
        };
        const ajaxEvent = props.btnText === '编辑'
          ? MissionManageService.editBoard({
            patrolBoardId: props.id,
            ...result
          })
          : MissionManageService.newBoard(result);
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
      modalProps={{ title: text, width: 480, destroyOnClose: true }}
      btnText={props.btnText}

      btnProps={{ type: props.btnText === '编辑' ? 'link' : 'primary' }}
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
export default connect(({ common }) => ({ ...common }))(NewKanbanModal);
