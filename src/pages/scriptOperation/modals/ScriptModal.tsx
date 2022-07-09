import React, { Fragment, useEffect } from 'react';
import { ImportFile, CommonModal, CommonSelect, useStateReducer } from 'racc';
import { message, Card, Form, Input, Radio, Icon, Row, Col } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormItemProps } from 'antd/lib/form';
import CustomTable from 'src/components/custom-table';
import {
  default as PressureTestSceneService,
  default as ScriptManageService
} from '../service';
import UploadAdjunctColumn from '../components/UploadAdjunctColumn';
import getUploadFileColumns from '../components/UploadFileColumn';
import styles from './../index.less';

interface Props {
  btnText?: string | React.ReactNode;
  id?: number | string;
  state?: any;
  type?: string;
  setState?: (value) => void;
  form: any;
}

interface State {
  isReload?: boolean;
  detail: any;
  form: any;
  uploadFiles: any[];
  uploadAttachments: any[];
}
const ScriptModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    detail: {},
    form: null as WrappedFormUtils,
    uploadFiles: [],
    uploadAttachments: []
  });

  const beforeSubmit = async () => {
    props.form.resetFields();
    setState({
      uploadFiles: [],
      uploadAttachments: [],
    });
    if (props.id) {
      const {
        data: { data, success }
      } = await ScriptManageService.queryScript({ id: props.id });
      if (success) {
        setState({
          detail: data,
          uploadFiles: data.files,
          uploadAttachments: data.attachmentfiles,
        });
      }
    }
  };

  /**
   * @name 保存文件
   */

  const handleSubmit = async () => {
    return await new Promise(async resolve => {
      props.form.validateFields(async (err, values) => {
        if (err) {
          message.info('请检查表单必填项');
          resolve(false);
          return;
        }
        if (state.uploadFiles.length === 0) {
          message.info('请上传脚本文件');
          resolve(false);
          return;
        }
        if (props.id) {
          const {
            data: { success }
          } = await ScriptManageService.editScript({
            ...values,
            uploadFiles: state.uploadFiles.filter(item => {
              return item.isDeleted !== 1;
            }),
            uploadAttachments: state.uploadAttachments.filter(item => {
              return item.isDeleted !== 1;
            }),
            id: props.id
          });
          if (success) {
            resolve(true);
            message.success('编辑成功');
            props.setState({ isReload: !props.state.isReload });
            return;
          }
        } else {
          const {
            data: { success }
          } = await ScriptManageService.write({
            ...values,
            uploadFiles: state.uploadFiles,
            uploadAttachments: state.uploadAttachments,
          });
          if (success) {
            resolve(true);
            message.success('保存成功');
            props.setState({ isReload: !props.state.isReload });
            return;
          }
        }

        resolve(false);
      });
    });
  };

  const formItemProps: FormItemProps = {
    labelCol: { span: 2 },
    wrapperCol: { span: 8 },
  };

  const handleChange = info => {
    const fileLists = [...info.fileList];
    const readyToUploadFileName = [info.file.name];
    /**
     * @name 判断是否是可接受类型
     */
    function isAcceptType(ext) {
      return ['sh'].indexOf(ext.toLowerCase()) !== -1;
    }

    /**
     * @name 待上传的元素含有不可接受类型
     */
    if (
      readyToUploadFileName.find(item => {
        return !isAcceptType(item.substr(item.lastIndexOf('.') + 1));
      })
    ) {
      message.error('上传的文件含有不可接受类型，请检查后上传');
      return;
    }
    /**
     * @name 待上传的元素超过200M大小
     */
    if (
      [fileLists[fileLists.length - 1]].find(item => {
        return item.size / 1024 / 1024 > 200;
      })
    ) {
      message.error('上传的文件大小超过200M，请检查后上传');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileLists[fileLists.length - 1].originFileObj);

    if (formData) {
      uploadFiles(formData);
    }
  };

  const Upload = info => {
    const fileLists = [...info.fileList];

    if (
      fileLists.find(item => {
        return item.size / 1024 / 1024 > 200;
      })
    ) {
      message.error('上传的文件大小超过200M，请检查后上传');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileLists[fileLists.length - 1].originFileObj);

    if (formData) {
      handleUpload(formData);
    }
  };

  /**
   * @name 上传文件
   */
  const uploadFiles = async files => {
    const {
      data: { data, success }
    } = await ScriptManageService.uploadFiles(files);
    if (success) {
      setState({
        uploadFiles: data
      });
    }
  };

  const handleUpload = async file => {
    const {
      data: { success, data }
    } = await ScriptManageService.uploadAttachments(file);
    if (success) {
      message.success('上传成功');
      setState({ uploadAttachments: [...state.uploadAttachments, ...data] });
    }
  };

  return (
    <CommonModal
      modalProps={{
        width: '1100px',
        title: `运维脚本${props.type === 'primary' ? '新增' : '编辑'}`,
        bodyStyle: { background: '#F5F7F9' },
        style: { top: 60 }
      }}
      onClick={beforeSubmit}
      btnProps={{ type: `${props.type}` }}
      btnText={props.btnText}
      beforeOk={handleSubmit}
    >
      <div style={{ height: '500px', overflow: 'auto' }}>
        <Form onSubmit={handleSubmit} {...formItemProps}>
          <Card title="基础信息" bordered={false}>
            <Form.Item
              label="脚本名称"
            >
              {props.form.getFieldDecorator('name', {
                initialValue: state.detail.name ? state.detail.name : '',
                rules: [{ required: true, whitespace: true, message: `请输入脚本名称` }],
              })(
                <Input placeholder="脚本名称" />
              )}
            </Form.Item>
            <Form.Item
              label="类型"
            >
              {props.form.getFieldDecorator('scriptType', {
                initialValue: state.detail.scriptType ? `${state.detail.scriptType}` : [],
                rules: [{ required: true, message: `请输入脚本名称` }],
              })(
                <CommonSelect
                  placeholder="类型"
                  dataSource={props.state.tagList ? props.state.tagList : []}
                  dropdownMatchSelectWidth={false}
                />
              )}
            </Form.Item>
          </Card>
          <Card title="文件" bordered={false} style={{ marginTop: 20 }}>
            <Form.Item label="文件类型" required>
              <Radio defaultChecked>Shell</Radio>
            </Form.Item>
            <Form.Item
              label="脚本文件"
              required
            >
              {props.form.getFieldDecorator('uploadFiles', {
                initialValue: state.detail ? state.detail.files : [],
                rules: [{ required: false, message: `请输入脚本名称` }],
              })(
                <ImportFile
                  style={{ marginLeft: 100 }}
                  UploadProps={{
                    type: 'drag',
                    multiple: false,
                    onChange: info => handleChange(info)
                  }}
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
                        点击或将文件拖拽到此处上传
                      </span>
                      <span
                        className={`ant-upload-hint ft-12`}
                        style={{ color: 'rgba(0,0,0,0.43)', marginTop: '10px', display: 'inline-block' }}
                      >
                        支持格式：.shell
                        <span style={{ color: '#26CDC3' }}>
                          （有且仅有一个shell脚本）
                </span>
                      </span>
                    </span>
                  </p>
                </ImportFile>
              )}
            </Form.Item>
            <Row style={{ marginBottom: 20 }}>
              <Col span={2} />
              <Col span={12} style={{ marginTop: 8, width: '90%' }}>
                <CustomTable
                  columns={getUploadFileColumns(state, setState)}
                  dataSource={
                    state.uploadFiles
                      ? state.uploadFiles.filter(item => {
                        return item.isDeleted !== 1;
                      })
                      : []
                  }
                />
              </Col>
            </Row>
            <Form.Item
              label="脚本附件"
            >
              {props.form.getFieldDecorator('uploadAttachments', {
                initialValue: state.detail ? state.detail.attachmentfiles : [],
                rules: [{ required: false, message: `请输入脚本名称` }],
              })(
                <ImportFile
                  style={{ marginLeft: 100 }}
                  UploadProps={{
                    type: 'drag',
                    multiple: true,
                    onChange: info => Upload(info)
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
                        shell脚本中使用的文件，请上传至此处
                      </span>
                      <span
                        className={`ant-upload-hint ft-12`}
                        style={{ color: 'rgba(0,0,0,0.43)', display: 'block' }}
                      >
                        文件将与shell脚本存储在同一目录下，
                      </span>
                      <span style={{ color: 'rgba(0,0,0,0.43)', display: 'block' }}>
                        所以shell脚本中的文件调用路径仅使用文件名即可
                </span>
                    </span>
                  </p>
                </ImportFile>
              )}
            </Form.Item>
            <Row style={{ marginBottom: 20 }}>
              <Col span={2} />
              <Col span={12} style={{ marginTop: 8, width: '90%' }}>
                <CustomTable
                  columns={UploadAdjunctColumn(state, setState)}
                  dataSource={
                    state.uploadAttachments
                      ? state.uploadAttachments.filter(item => {
                        return item.isDeleted !== 1;
                      })
                      : []
                  }
                />
              </Col>
            </Row>
          </Card>
        </Form>
      </div>
    </CommonModal>
  );
};
export default Form.create()(ScriptModal);
