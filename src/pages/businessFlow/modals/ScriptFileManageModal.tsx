import React, { Fragment, useEffect, useState } from 'react';
import { CommonForm, CommonModal, ImportFile, useStateReducer } from 'racc';
import { Icon, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormDataType } from 'racc/dist/common-form/type';
import CustomTable from 'src/components/custom-table';
import BusinessFlowService from '../service';
import { router } from 'umi';
import getScriptFileColumns from '../components/ScriptFileColumns';
import PressureTestSceneService from 'src/pages/pressureTestManage/pressureTestScene/service';
import ScriptManageService from 'src/pages/scriptManage/service';

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
const ScriptFileManageModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    form: null as WrappedFormUtils,
    fileList: [],
    attachmentList: [],
    uploadFileNum: 0
  });
  const [uploading, setUploading] = useState(false);

  const handleClick = () => {
    setState({
      fileList: props.fileList
    });
  };

  const handleChange = info => {
    /**
     * @name 已上传的文件列表名
     */
    const fileListName =
      state.fileList &&
      state.fileList.map(item => {
        return item.fileName;
      });

    /**
     * @name 准备上传的文件列表名
     */
    const readyToUploadFileName =
      info.fileList &&
      info.fileList.slice(state.uploadFileNum).map(item => {
        return item.name;
      });

    /**
     * @name 准备上传的文件列表
     */
    const readyToUploadFileList =
      info.fileList && info.fileList.slice(state.uploadFileNum);

    /**
     * @name 判断是否是可接受类型
     */
    // function isAcceptType(ext) {
    //   return ['jar', 'csv', 'bmp', 'png', 'jpg', 'jpeg', 'gif', 'xls', 'xlsx'].indexOf(ext.toLowerCase()) !== -1;
    // }

    setState({
      uploadFileNum: info.fileList.length
    });

    /**
     * @name 待上传的元素含有不可接受类型
     */
    // if (
    //   readyToUploadFileName.find(item => {
    //     return !isAcceptType(item.substr(item.lastIndexOf('.') + 1));
    //   })
    // ) {
    //   message.error('上传的文件含有不可接受类型，请检查后上传');
    //   return;
    // }

    /**
     * @name 待上传的元素超过200M大小
     */
    if (
      readyToUploadFileList.find(item => {
        return item.size / 1024 / 1024 > 200;
      })
    ) {
      message.error('上传的文件大小超过200M，请检查后上传');
      return;
    }

    /**
     * @name 待上传的元素含有重名文件列表
     */
    const equalList =
      readyToUploadFileName &&
      readyToUploadFileName.filter((item, index) => {
        if (
          fileListName &&
          fileListName
            .filter(item2 => {
              if (item2.isDeleted) {
                return item2;
              }
            })
            .includes(item)
        ) {
          return item;
        }
      });

    if (equalList.length) {
      if (info.file.uid === info.fileList.slice(-1)[0].uid) {
        message.error('不能重复上传文件');
      }
      return;
    }

    const newUploadFileList = info.fileList.slice(state.uploadFileNum);

    const formData = new FormData();
    info.fileList.slice(state.uploadFileNum).map(item => {
      formData.append('file', item.originFileObj);
    });

    setState({
      fileList: state.fileList && state.fileList.concat(newUploadFileList)
    });

    if (info.file.uid === info.fileList.slice(-1)[0].uid && formData) {
      uploadFiles(formData);
    }
  };

  /**
   * @name 上传文件
   */
  const uploadFiles = async files => {
    setUploading(true);
    const msg = message.loading('上传中', 0);
    try {
      const {
        data: { data, success }
      } = await PressureTestSceneService.uploadFiles(files);
      if (success) {
        setState({
          fileList: state.fileList ? state.fileList.concat(data) : data
        });
      }
    } finally {
      setUploading(false);
      msg();
    }
  };

  /**
   * @name 删除新上传文件
   */
  const handleDeleteFiles = async uploadId => {
    const {
      data: { data, success }
    } = await PressureTestSceneService.deleteFiles({ uploadId });
    if (success) {
      message.success('删除文件成功！');
      setState({
        fileList:
          state.fileList &&
          state.fileList.filter(item => {
            return uploadId !== item.uploadId;
          })
      });
    }
  };

  /**
   * @name 删除上传文件
   */
  const handleDelete = async item => {
    if (item.id) {
      setState({
        fileList: state.fileList.map(item2 => {
          if (item.id === item2.id) {
            return { ...item2, isDeleted: 1 };
          }
          return { ...item2 };
        })
      });
    } else {
      handleDeleteFiles(item.uploadId);
    }
  };

  const handleUpload = async file => {
    const {
      data: { success, data }
    } = await ScriptManageService.uploadAttachments(file);
    if (success) {
      message.success('上传成功');
      setState({ attachmentList: [...state.attachmentList, ...data] });
    }
  };

  const getFormData = (): FormDataType[] => {
    return [
      {
        key: 'uploadFiles',
        label: '上传文件',
        formItemProps: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        options: {
          initialValue: '',
          rules: [{ required: false, message: '请上传文件' }]
        },
        node: (
          <ImportFile
            style={{ marginLeft: 100 }}
            UploadProps={{
              type: 'drag',
              multiple: true,
              onChange: info => handleChange(info),
              disabled: uploading,
            }}
            accept={null}
            fileName="file"
            onImport={file => true}
          >
            <Icon type="inbox" />
            <p
              style={{
                display: 'flex',
                padding: '0px 10px',
                justifyContent: 'center'
              }}
            >
              <span>
                <span
                  style={{
                    color: '#474C50',
                    display: 'block',
                    fontSize: '16px'
                  }}
                >
                  点击新增或者拖拽到此上传文件
                  
                </span>
              </span>
            </p>
            {/* <p>支持数据文件格式：.csv <br/>
              支持jar格式：.jar <br/>
              支持其他附件格式：图片、Excel等</p> */}
          </ImportFile>
        ),
        extra: (
          <div style={{ marginTop: 8 }}>
            <CustomTable
              columns={getScriptFileColumns(state, setState)}
              dataSource={
                state.fileList
                  ? state.fileList.filter(item => {
                    return item.isDeleted !== 1;
                  })
                  : []
              }
            />
          </div>
        )
      }
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
    return await new Promise(resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }
        const {
          data: { data, success }
        } = await BusinessFlowService.saveUploadDataFile({
          id: props.id,
          uploadFiles: state.fileList
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
          disabled: uploading
        },
        bodyStyle: {
          maxHeight: 400,
          overflow: 'auto',
        },
      }}
      btnProps={{
        type: 'default'
      }}
      btnText={props.btnText}
      onClick={handleClick}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
      
    >
      <div
        style={{ position: 'relative' }}
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
export default ScriptFileManageModal;
