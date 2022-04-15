import React, { Fragment, useEffect, useState } from 'react';
import { CommonForm, CommonModal, useStateReducer } from 'racc';
import { Icon, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormDataType } from 'racc/dist/common-form/type';
import CustomTable from 'src/components/custom-table';
import BusinessFlowService from '../service';
import { router } from 'umi';
import getScriptFileColumns from '../components/ScriptFileColumns';
import PressureTestSceneService from 'src/pages/pressureTestManage/pressureTestScene/service';
import ScriptManageService from 'src/pages/scriptManage/service';
import UploadFile from 'src/components/upload-file';

interface Props {
  btnText?: string | React.ReactNode;
  onSuccess?: () => void;
  businessActivityId?: string;
  action?: string;
  fileList?: any[];
  id?: string;
}

interface State {
  fileList: any;
  form: any;
  attachmentList: any;
  uploadFileNum: number;
}
const ScriptFileManageModal: React.FC<Props> = (props) => {
  const [state, setState] = useStateReducer<State>({
    form: null as WrappedFormUtils,
    fileList: [],
    attachmentList: [],
    uploadFileNum: 0,
  });
  const [uploading, setUploading] = useState(false);

  const handleClick = () => {
    setState({
      fileList: props.fileList,
    });
  };

  const getFormData = (): FormDataType[] => {
    return [
      {
        key: 'uploadFiles',
        label: '上传文件',
        formItemProps: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        options: {
          initialValue: '',
          rules: [{ required: false, message: '请上传文件' }],
        },
        node: (
          <UploadFile
            type="drag"
            multiple
            disabled={uploading}
            acceptExts={[
              'jar',
              'csv',
              'bmp',
              'png',
              'jpg',
              'jpeg',
              'gif',
              'xls',
              'xlsx',
            ]}
            maxSize={200}
            initialFileList={state.fileList}
            service={PressureTestSceneService.uploadFiles}
            afterUpload={(data) => {
              setState({
                fileList: state.fileList ? state.fileList.concat(data) : data,
              });
            }}
          >
            <Icon type="inbox" />
            <p
              style={{
                display: 'flex',
                padding: '0px 10px',
                justifyContent: 'center',
              }}
            >
              <span>
                <span
                  style={{
                    color: '#474C50',
                    display: 'block',
                    fontSize: '16px',
                  }}
                >
                  点击新增或者拖拽到此上传文件
                </span>
              </span>
            </p>
            <p>
              支持数据文件格式：.csv <br />
              支持jar格式：.jar <br />
              支持其他附件格式：图片、Excel等
            </p>
          </UploadFile>
        ),
        extra: (
          <div style={{ marginTop: 8 }}>
            <CustomTable
              columns={getScriptFileColumns(state, setState)}
              dataSource={
                state.fileList
                  ? state.fileList.filter((item) => {
                    return item.isDeleted !== 1;
                  })
                  : []
              }
            />
          </div>
        ),
      },
    ];
  };

  const handleCancle = () => {
    setState({
      fileList: null,
      uploadFileNum: 0,
    });
  };

  /**
   * @name 保存文件
   */
  const handleSubmit = async () => {
    return await new Promise((resolve) => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }
        const {
          data: { data, success },
        } = await BusinessFlowService.saveUploadDataFile({
          id: props.id,
          uploadFiles: state.fileList,
        });
        if (success) {
          message.success('保存成功!');
          props.onSuccess();

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
        width: 'calc(100% - 192px)',
        title: '脚本文件',
        maskClosable: false,
        okText: '保存修改',
        okButtonProps: {
          disabled: uploading,
        },
        bodyStyle: {
          maxHeight: 400,
          overflow: 'auto',
        },
      }}
      btnProps={{
        type: 'default',
      }}
      btnText={props.btnText}
      onClick={handleClick}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
    >
      <div style={{ position: 'relative' }}>
        <CommonForm
          getForm={(form) => setState({ form })}
          formData={getFormData()}
          btnProps={{
            isResetBtn: false,
            isSubmitBtn: false,
          }}
          rowNum={1}
        />
      </div>
    </CommonModal>
  );
};
export default ScriptFileManageModal;
