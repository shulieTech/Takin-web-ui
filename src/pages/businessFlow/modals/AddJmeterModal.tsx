import React, { Fragment, useEffect } from 'react';
import { CommonForm, CommonModal, ImportFile, useStateReducer } from 'racc';
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
  businessActivityId?: string;
  action?: string;
  fileList?: any[];
  id?: string;
}

interface State {
  fileList: any;
  form: any;
  loading: boolean;
}
const AddJmeterModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    fileList: null,
    form: null as WrappedFormUtils,
    loading: false
  });

  const handleClick = () => {
    if (props.action === 'edit') {
      setState({
        fileList: [props.fileList]
      });
    }
  };

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '文件名',
        dataIndex: 'fileName',
        width: 250
      },
      {
        ...customColumnProps,
        title: '类型',
        dataIndex: 'fileType',
        width: 100,
        render: text => {
          return <span>{fileTypeMap[text]}</span>;
        }
      },
      {
        ...customColumnProps,
        title: '最后更新时间',
        dataIndex: 'uploadTime'
      },
      {
        ...customColumnProps,
        title: '操作',
        dataIndex: 'action',
        render: (text, row) => {
          return (
            <EditJmeterModal
              id={props.id}
              btnText="编辑"
              fileId={row.downloadUrl}
              fileData={row}
              state={state}
            />
          );
        }
      }
    ];
  };

  /**
   * @name 上传jmeter文件
   */
  const handleImport = async file => {
    setState({
      loading: true
    });
    const {
      data: { data, success }
    } = await BusinessFlowService.uploadJmeter(file);

    if (success) {
      setState({
        loading: false
      });
      message.success('上传文件成功!');
      setState({
        fileList: data
      });
      return;
    }
    setState({
      loading: false
    });
  };

  const getFormData = (): FormDataType[] => {
    return [
      {
        key: 'appName',
        label: '上传文件',
        node: (
          <ImportFile
            accept={['jmx']}
            onImport={handleImport}
            UploadProps={{
              type: 'drag',
              multiple: false
            }}
          >
            <p>
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">点击或者拖拽到此上传文件</p>
            <p>支持格式：.jmx</p>
          </ImportFile>
        ),
        extra: (
          <div style={{ marginTop: 20 }}>
            <CustomTable
              columns={getColumns()}
              dataSource={state.fileList || []}
            />
          </div>
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
   * @name 保存并解析jmeter脚本，跳转到详情
   */
  const handleSubmit = async () => {
    return await new Promise(resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }

        if (!state.fileList) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }
        const {
          data: { data, success }
        } = await BusinessFlowService.saveAndAnalysis({
          id: props.action === 'edit' ? props.id : null,
          scriptFile: {
            ...(state.fileList && state.fileList[0]),
            id: state.fileList && state.fileList[0] && state.fileList[0].id
          }
        });
        if (success) {
          message.success('保存成功!');
          props.onSuccess();
          router.push(`/businessFlow/details?id=${data.id}&isAuto=true`);
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
        title: 'Jmeter脚本解析',
        maskClosable: false,
        okText: '保存并解析'
      }}
      btnProps={{
        type: props.action === 'edit' ? 'primary' : 'link'
      }}
      btnText={props.btnText}
      onClick={handleClick}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
    >
      <div style={{ position: 'relative', height: 500, overflowY: 'scroll' }}>
        {state.loading && (
          <span
            style={{
              position: 'absolute',
              top: 50,
              left: 270,
              zIndex: 100
            }}
          >
            <Spin />
          </span>
        )}
        <Row type="flex" className={styles.modalInfo}>
          <Col span={1}>
            <Icon
              style={{ fontSize: '16px', marginTop: 4, color: '#000000' }}
              type="info-circle"
            />
          </Col>
          <Col span={23}>
            <p
              style={{
                fontSize: '16px',
                color: '#424242',
                fontWeight: 600,
                height: '26px'
              }}
            >
              说明
            </p>
            <div>
              1、上传脚本将自动解析出业务流程结构，自动匹配API所对应的业务活动，未匹配上的数据请自行添加
              <br />
              2、匹配规则：API请求Path与入口Path完全一致，方法完全一致
              <br />
              3、重新编辑/替换JMeter脚本将覆盖已有流程的编排
              <br />
            </div>
          </Col>
        </Row>
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
export default AddJmeterModal;
