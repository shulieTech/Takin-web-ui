import React, { Fragment, useEffect } from 'react';
import { ImportFile, useStateReducer } from 'racc';
import {
  Modal, Card, Form, message, Icon, Tooltip,
  Input, Button, Divider
} from 'antd';
import { FormItemProps } from 'antd/lib/form';
import DeployModal from './DeployModal';
import CustomTable from 'src/components/custom-table';
import _ from 'lodash';
import styles from '../index.less';
import agentService from '../service';

const { TextArea } = Input;
interface Props {
  state: any;
  setState: any;
  form: any;
}

interface State {
  uploadFiles: any;
  extra: boolean;
  status: string;
}
const AgentVersin: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    uploadFiles: null,
    extra: false,
    status: 'inbox',
  });

  const handleOk = e => {
    if (state.extra) {
      Modal.info({
        title: '探针版本新增确认',
        okText: '确认发布',
        content: (
          <div>
            <p>该版本已存在，继续发布将覆盖老版本。</p>
            <p>您确认覆盖老版本吗？</p>
          </div>
        ),
        onOk() {
          onSubmit();
        },
      });
    } else {
      onSubmit();
    }

  };

  const onSubmit = () => {
    props.form.validateFields(async (err, values) => {
      if (err) {
        message.info('请检查表单必填项');
        return;
      }
      if (!state.uploadFiles) {
        message.info('请上传文件');
        return;
      }
      const {
        data: { data, success }
      } = await agentService.release({
        configList: props.state.deployList,
        exist: state.uploadFiles.exist,
        filePath: state.uploadFiles.filePath,
        version: state.uploadFiles.version,
        versionFeatures: values.versionFeatures
      });
      if (success) {
        message.success('发布成功');
        props.form.resetFields();
        setState({
          uploadFiles: null,
        });
        props.setState({
          versinVisible: false,
          deployList: []
        });
      }
    });
  };

  const handleCancel = e => {
    props.setState({
      versinVisible: false,
      deployList: []
    });
    setState({
      uploadFiles: null,
    });
    props.form.resetFields();
  };

  const handleChange = info => {

    const fileLists = [...info.fileList];
    const readyToUploadFileName = [info.file.name];
    /**
     * @name 判断是否是可接受类型
     */
    function isAcceptType(ext) {
      return ['zip'].indexOf(ext.toLowerCase()) !== -1;
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

    const formData = new FormData();
    formData.append('file', fileLists[fileLists.length - 1].originFileObj);

    if (formData) {
      uploadFiles(formData);
      setState({
        status: 'loading'
      });
    }
  };

  /**
   * @name 上传文件
   */
  const uploadFiles = async files => {
    const {
      data: { data, success }
    } = await agentService.upload(files);
    if (success) {
      message.success('上传成功');
      setState({
        uploadFiles: data,
        status: 'inbox',
        extra: data.extra
      });
      props.setState({
        version: data.version
      });
    }
  };

  const formItemProps: FormItemProps = {
    labelCol: { span: 3 },
    wrapperCol: { span: 9 },
  };

  const edit = record => {
    props.setState({
      deployVisible: true,
      value: record
    });
  };

  const del = record => {
    const dataList = _.cloneDeep(props.state.deployList);
    props.setState({
      deployList: dataList.filter(item => item.key !== record.key),
    });
  };

  const columns = [
    {
      title: '配置项中文名',
      dataIndex: 'zhKey',
      width: '40%'
    },
    {
      title: '配置项英文名',
      dataIndex: 'enKey',
      width: '40%'
    },
    {
      title: '操作',
      width: '200px',
      render: (text, record) => (
        <span>
          <a onClick={() => edit(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => del(record)}>删除</a>
        </span>
      ),
    },
  ];

  const extra = (
    <p style={{ color: '#ED6047' }}>
      <Icon type="exclamation-circle" style={{ color: '#ED6047' }} />
                  该版本已存在，发布新版本时将覆盖已有版本
    </p>
  );

  return (
    <Modal
      title="新增探针版本"
      visible={props.state.versinVisible}
      bodyStyle={{ background: '#F5F7F9' }}
      style={{ top: 40 }}
      width={1000}
      onOk={handleOk}
      okText="确认发布"
      onCancel={handleCancel}
      destroyOnClose
    >
      <div
        style={{
          height: '550px',
          overflow: 'auto',
        }}
      >
        <Form onSubmit={onSubmit} {...formItemProps}>
          <Card title="基础信息">
            <Form.Item
              label={
                <span>
                  上传探针包&nbsp;
                {/* <Tooltip title="What do you want others to call you?">
                  <Icon type="question-circle-o" />
                </Tooltip> */}
                </span>
              }
              required
            >
              {props.form.getFieldDecorator('uploadFiles', {
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
                  <Icon type={state.status} style={{ fontSize: '30px' }} />
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
                          fontSize: '16px',
                        }}
                      >
                        点击或将文件拖拽到此处上传
                      </span>
                      <span
                        className={`ant-upload-hint ft-12`}
                        style={{ color: 'rgba(0,0,0,0.43)', marginTop: '10px', display: 'inline-block' }}
                      >
                        请上传新版本的探针包文件(仅支持.zip)
                      <p>可联系移动云人员获取</p>
                      </span>
                    </span>
                  </p>
                </ImportFile>
              )}
            </Form.Item>
            <Form.Item
              label="版本号"
              extra={state.extra ? extra : ''}
            >
              {props.form.getFieldDecorator('version', {
                initialValue: state.uploadFiles ? state.uploadFiles.version : '版本号',
                rules: [{ required: true, whitespace: true, message: `请输入版本号` }],
              })(
                <Input placeholder="版本号" disabled />
              )}
            </Form.Item>
            <Form.Item
              label="版本特性"
            >
              {props.form.getFieldDecorator('versionFeatures', {
                initialValue: '',
                rules: [{ required: true, whitespace: true, message: `请输入版本特性` }],
              })(
                <TextArea
                  rows={4}
                  maxLength={1000}
                  placeholder={
                    `1.新增中间件支持：kafuka1.0、pika1.1;
2.完善了数据兜底方案;
3.修复了******BUG;
限1000字以内`}
                />
              )}
            </Form.Item>
          </Card>
          <div style={{ marginTop: 20 }} />
          <Card title="配置编辑">
            <Button
              type="primary"
              onClick={() => props.setState({ deployVisible: true, value: {} })}
            >新增配置
            </Button>
            <div style={{ marginTop: 20 }} />
            <CustomTable columns={columns} dataSource={props.state.deployList} />
          </Card>
        </Form>
      </div>
      <DeployModal state={props.state} setState={props.setState} />
    </Modal>
  );
};
export default Form.create()(AgentVersin);
