/**
 * @name
 * @author MingShined
 */
import { Input, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'dva';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React from 'react';
import FormCardMultiple from 'src/components/form-card-multiple';
import { CommonModelState } from 'src/models/common';
import DataVerificationConfig from '../components/DataVerificationConfig';
import TestRunConfig from '../components/TestRunConfig';
import TestRunDataConfigConfig from '../components/TestRunDataConfig';
import styles from './../index.less';

interface Props extends CommonModelState {
  id?: string;
  btnText: string;
  onSuccess: () => void;
  applicationId: string;
}
const TestRunModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    form: null as WrappedFormUtils,
    details: {}
  });
  const text = props.id ? '编辑' : '新增';

  const formDataSource = [
    TestRunConfig(state, setState, props),
    TestRunDataConfigConfig(state, setState, props)
  ];
  const handleSubmit = () => {
    return new Promise(async resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.info('请检查表单必填项');
          resolve(false);
          return;
        }
      });
    });
  };
  return (
    <CommonModal
      beforeOk={handleSubmit}
      modalProps={{ title: text, width: 720, destroyOnClose: true }}
      btnText={props.btnText}
      btnProps={{ type: props.id ? 'link' : 'primary' }}
      //   onClick={getDetails}
    >
      {/* <CommonForm
        rowNum={1}
        formItemProps={{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }}
        btnProps={{ isResetBtn: false, isSubmitBtn: false }}
        getForm={form => setState({ form })}
        formData={getFormData()}
      /> */}
      <FormCardMultiple
        commonFormProps={{
          rowNum: 1,
          formProps: {
            className: styles.formCard
          }
        }}
        dataSource={formDataSource}
        getForm={form => setState({ form })}
      />
    </CommonModal>
  );
};
export default connect(({ common }) => ({ ...common }))(TestRunModal);
