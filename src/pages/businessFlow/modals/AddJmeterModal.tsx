import React, { Fragment, useEffect, useState } from 'react';
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
import RelatePlugin from '../components/RelatePlugin';
import { ButtonProps } from 'antd/lib/button';

interface Props {
  btnText?: string | React.ReactNode;
  onSuccess?: () => void;
  businessActivityId?: string;
  action?: string;
  fileList?: any[];
  id?: string;
  detailData: {
    scriptFile?: {};
    pluginConfigs?: any[];
  };
}

interface State {
  fileList: any;
  form: any;
  loading: boolean;
  required: boolean;
  okBtnProps?: ButtonProps;
}
const AddJmeterModal: React.FC<Props> = (props) => {
  const { detailData = {} } = props;
  const [state, setState] = useStateReducer<State>({
    fileList: null,
    form: null as WrappedFormUtils,
    loading: false,
    required: false,
    okBtnProps: undefined,
  });

  const [scriptFileInfo, setScriptFileInfo] = useState(
    detailData?.scriptFile || {}
  );

  const [pluginList, setPluginList] = useState([]);

  const handleClick = () => {
    if (props.action === 'edit') {
      setState({
        fileList: [props.fileList],
      });
    }
  };

  const queryPluginList = async () => {
    const {
      data: { data, success },
    } = await BusinessFlowService.queryPluginList(scriptFileInfo);
    if (success) {
      setPluginList(data || []);
    }
  };

  useEffect(() => {
    setScriptFileInfo(detailData.scriptFile || {});
  }, [JSON.stringify(detailData.scriptFile)]);

  useEffect(() => {
    if (scriptFileInfo.id || scriptFileInfo.uploadId) {
      queryPluginList();
    }
  }, [scriptFileInfo.id, scriptFileInfo.uploadId]);

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '?????????',
        dataIndex: 'fileName',
        width: 250,
      },
      {
        ...customColumnProps,
        title: '??????',
        dataIndex: 'fileType',
        width: 100,
        render: (text) => {
          return <span>{fileTypeMap[text]}</span>;
        },
      },
      {
        ...customColumnProps,
        title: '??????????????????',
        dataIndex: 'uploadTime',
      },
      {
        ...customColumnProps,
        title: '??????',
        dataIndex: 'action',
        render: (text, row) => {
          return (
            <EditJmeterModal
              id={props.id}
              btnText="??????"
              fileId={row.downloadUrl}
              fileData={row}
              state={state}
              onSuccess={() => {
                setState({
                  okBtnProps: {
                    loading: true,
                  },
                });
                props.onSuccess();
              }}
            />
          );
        },
      },
    ];
  };

  /**
   * @name ??????jmeter??????
   */
  const handleImport = async (file) => {
    setState({
      loading: true,
    });
    const {
      data: { data, success },
    } = await BusinessFlowService.uploadJmeter(file);

    if (success) {
      setScriptFileInfo(data?.[0] || {});
      state.form.setFieldsValue({
        pluginConfigs: [],
      });
      setState({
        loading: false,
      });
      message.success('??????????????????!');
      setState({
        fileList: data,
      });
      return;
    }
    setState({
      loading: false,
    });
  };

  const getFormData = (): FormDataType[] => {
    const fieldsArr = [
      {
        key: 'appName',
        label: '????????????',
        node: (
          <ImportFile
            accept={['jmx']}
            onImport={handleImport}
            UploadProps={{
              type: 'drag',
              multiple: false,
            }}
          >
            <p>
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">????????????????????????????????????</p>
            <p>???????????????.jmx</p>
          </ImportFile>
        ),
        extra: (
          <div style={{ marginTop: 20 }}>
            <CustomTable
              columns={getColumns()}
              dataSource={state.fileList || []}
            />
          </div>
        ),
      },
    ];

    if (pluginList.length > 0) {
      fieldsArr.push({
        key: 'pluginConfigs',
        label: '????????????',
        options: {
          initialValue: detailData?.pluginConfigs || [],
          rules: [
            // {
            //   required: pluginList?.length > 0,
            //   message: '??????????????????????????????',
            // },
          ],
        },
        node: <RelatePlugin pluginList={pluginList} />,
      });
    }

    return fieldsArr;
  };

  const handleCancle = () => {
    setState({
      fileList: null,
    });
  };

  /**
   * @name ???????????????jmeter????????????????????????
   */
  const handleSubmit = async () => {
    return await new Promise((resolve) => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('????????????????????????');
          resolve(false);
          return false;
        }
        if (
          !state.fileList
          // || (pluginList?.length > 0 && (values.pluginConfigs || [])?.length === 0)
        ) {
          message.error('????????????????????????');
          resolve(false);
          return false;
        }
        const {
          data: { data, success },
        } = await BusinessFlowService.saveAndAnalysis({
          ...values,
          id: props.action === 'edit' ? props.id : null,
          scriptFile: {
            ...(state.fileList && state.fileList[0]),
            id: state.fileList && state.fileList[0] && state.fileList[0].id,
          },
          pluginConfigs: values.pluginConfigs || [],
        });
        if (success) {
          message.success('????????????!');
          router.push(`/businessFlow/details?id=${data.id}&isAuto=true`);
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
        width: 700,
        title: 'Jmeter????????????',
        maskClosable: false,
        okText: '???????????????',
        bodyStyle: {
          height: 500,
          overflow: 'auto',
        },
        okButtonProps: state.okBtnProps,
      }}
      btnProps={{
        type: props.action === 'edit' ? 'primary' : 'link',
      }}
      btnText={props.btnText}
      onClick={handleClick}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
    >
      <div style={{ position: 'relative' }}>
        {state.loading && (
          <span
            style={{
              position: 'absolute',
              top: 50,
              left: 270,
              zIndex: 100,
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
                height: '26px',
              }}
            >
              ??????
            </p>
            <div>
              1??????????????????????????????????????????????????????????????????API???????????????????????????????????????????????????????????????
              <br />
              2??????????????????API??????Path?????????Path?????????????????????????????????
              <br />
              3???????????????/??????JMeter????????????????????????????????????
              <br />
            </div>
          </Col>
        </Row>
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
export default AddJmeterModal;
