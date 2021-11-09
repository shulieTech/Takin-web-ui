import React, { Fragment, useEffect } from 'react';
import {
  CommonForm,
  CommonModal,
  CommonSelect,
  ImportFile,
  useStateReducer
} from 'racc';
import { Col, Collapse, Divider, Icon, Input, message, Row, Spin } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormDataType } from 'racc/dist/common-form/type';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';
import CustomTable from 'src/components/custom-table';
import BusinessFlowService from '../service';
import { router } from 'umi';
import styles from './../index.less';
import EditJmeterModal from './EditJmeterModal';
import { fileTypeMap } from '../enum';

interface Props {
  btnText?: string | React.ReactNode;
  onSuccess?: () => void;
  id?: string;
  dictionaryMap?: any;
  sceneName: string;
  isCore: number;
  sceneLevel: string;
}

interface State {
  fileList: any;
  form: any;
  loading: boolean;
}
const BusicInfoModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    fileList: null,
    form: null as WrappedFormUtils,
    loading: false
  });
  const { dictionaryMap } = props;
  const { isCore, link_level } = dictionaryMap;

  const getFormData = (): FormDataType[] => {
    return [
      {
        key: 'sceneName',
        label: '名称',
        options: {
          initialValue: props.sceneName,
          rules: [
            {
              required: true,
              message: '请输入名称'
            }
          ]
        },
        node: <Input placeholder="请输入名称" />
      },
      {
        key: 'isCore',
        label: '类型',
        options: {
          initialValue: props.isCore,
          rules: [
            {
              required: true,
              message: '请选择类型'
            }
          ]
        },
        node: (
          <CommonSelect dataSource={isCore || []} placeholder="请选择类型" />
        )
      },
      {
        key: 'sceneLevel',
        label: '级别',
        options: {
          initialValue: props.sceneLevel,
          rules: [
            {
              required: true,
              message: '请选择级别'
            }
          ]
        },
        node: (
          <CommonSelect
            dataSource={link_level || []}
            placeholder="请选择级别"
          />
        )
      }
    ];
  };

  const handleCancle = () => {
    setState({
      fileList: null
    });
  };

  /**
   * @name 编辑业务流程基本信息
   *
   */
  const handleSubmit = async () => {
    return await new Promise(resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }
        const {
          data: { data, success }
        } = await BusinessFlowService.editBusinessFlowNew({
          ...values,
          id: props.id
        });
        if (success) {
          message.success('编辑成功!');
          resolve(true);
          return;
        }
        resolve(false);
      });
    });
  };

  return (
    <CommonModal
      modalProps={{
        width: 700,
        title: '业务流程基本信息',
        maskClosable: false,
        okText: '确认编辑'
      }}
      btnProps={{
        type: 'link'
      }}
      btnText={props.btnText}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
    >
      <div
        style={{ position: 'relative', maxHeight: 400, overflowY: 'scroll' }}
      >
        <CommonForm
          getForm={form => setState({ form })}
          formData={getFormData()}
          btnProps={{
            isResetBtn: false,
            isSubmitBtn: false
          }}
          rowNum={1}
        />
      </div>
    </CommonModal>
  );
};
export default BusicInfoModal;
