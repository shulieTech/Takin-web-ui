import {  message, Modal, Table } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { CommonForm, CommonSelect, useStateReducer } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { Fragment, useState } from 'react';
import service from '../service';
interface Props {
  btnText?: string;
  id?: any;
  onSuccess?: () => void;
  visible?: boolean;
  setVisible?: (value) => void;
  data?: any;
  suiteList?: any;
}

interface State {
  form: any; 
}

const TagDepolyModal: React.FC<Props> = props => {

  const [selectedKeys, setSelectedKeys] = useState([]);  
  const [state, setState] = useStateReducer<State>({
    form: null as WrappedFormUtils,
  });

  const handleConfirm =  () => {
    state.form.validateFields(async (err, values) => {
      if (!err) { 
        const {
          data: { data, success, error }
        } = await service.deployByTag({ ...values });
        if (success) {
          message.success('部署成功');
          props.setVisible(false);
          props.onSuccess();
          return;
        }
      }
    });
  };

  /**
   * @name 按照标签部署
   */
  const handleChange = async (tag) => {
    const {
      data: { data, success, error }
    } = await service.deployByTag({ tag });
    if (success) {
      message.success('部署成功');
      props.setVisible(false);
      props.onSuccess();
      return;
    }
  };

  const columns = [
    { 
      title: '标签',
      dataIndex: 'tag'
    }
  ];

  const getFormData = (): FormDataType[] => [
    {
      key: 'tag',
      label: '标签',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            whitespace: true,
            message: '请选择tag'
          }
        ]
      },
      node: <CommonSelect dataSource={props?.data || []}/>
    },
    {
      key: 'benchmarkSuiteName',
      label: '组件',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            whitespace: true,
            message: '请选择组件'
          }
        ]
      },
      node: <CommonSelect dataSource={props?.suiteList || []}/>
    },
  ];

  return (
    <Modal
      title={props?.btnText}
      width={560}
      visible={props.visible}
      onCancel={() => {
        props.setVisible(false);
        setSelectedKeys([]);
      }}
      onOk={() => handleConfirm()}
    >
        <Fragment>
          <div style={{ marginTop: 12 }}>
          <CommonForm
            getForm={form => setState({ form })}
            formData={getFormData()}
            btnProps={{
              isResetBtn: false,
              isSubmitBtn: false
            }}
            rowNum={1}
            formItemProps={{ labelCol: { span: 6 }, wrapperCol: { span: 14 } }}
          />
          {/* <Table
            key={'tag'}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedKeys,
              onChange: (selectedRowKeys) => { handleChangeKeys(selectedRowKeys); }
            }}
            
            pagination={false}
            columns={columns}
            dataSource={props?.data || []}
          /> */}
          </div>
        </Fragment>
    </Modal>
  );
};
export default TagDepolyModal;
