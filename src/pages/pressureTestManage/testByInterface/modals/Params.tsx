import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  createAsyncFormActions,
  FormEffectHooks,
  ISchemaFieldComponentProps,
} from '@formily/antd';
import { Input, ArrayTable, FormTab } from '@formily/antd-components';
import { Drawer, Button, Modal, Spin, message, Tooltip, Icon } from 'antd';
import FilesTable from '../components/FilesTable';
import downdloadFile from 'src/utils/downloadFile';
import service from '../service';
import styles from '../index.less';
import copy from 'copy-to-clipboard';
import { SenceContext } from '../indexPage';

interface Props {
  detail: any;
  okCallback: () => void;
  cancelCallback: () => void;
}

const Params: React.FC<Props> = (props) => {
  const { detail, okCallback, cancelCallback } = props;
  const { detailRefreshKey, setDetailRefreshKey } = useContext(SenceContext);
  const actions = useMemo(() => createAsyncFormActions(), []);
  const [paramsDetail, setParamsDetail] = useState({ id: detail.id });
  const [formChanged, setFormChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { onFieldValueChange$, onFieldInputChange$, onFormMount$ } =
    FormEffectHooks;

  const getParamsDetail = async () => {
    setLoading(true);
    const {
      data: { success, data },
    } = await service
      .getDataSource({
        configId: detail.id,
      })
      .finally(() => {
        setLoading(false);
      });
    if (success) {
      setParamsDetail({
        ...data,
        relatedFiles: data.relatedFiles || [],
        paramList: data.paramList || [],
      });
    }
  };

  const getTableColumns = (mutators, editable) => {
    const deleteFile = async (file, index) => {
      if (file.uploadId) {
        // 删除已上传的临时文件
        const msg = message.loading('正在删除...', 0);
        const {
          data: { data, success },
        } = await service.deleteFile(file).finally(() => {
          msg();
        });
        if (success) {
          mutators.remove(index);
        }
      } else {
        mutators.remove(index);
      }
    };

    return [
      {
        title: '文件名称',
        dataIndex: 'fileName',
      },
      {
        title: '类型',
        dataIndex: 'fileType',
        render: (text) => {
          return {
            1: '数据文件',
            2: '附件',
          }[text];
        },
      },
      {
        title: '条数',
        dataIndex: 'uploadedData',
      },
      {
        title: '最后更新时间',
        dataIndex: 'uploadTime',
      },
      {
        title: '操作',
        render: (text, record, index) => {
          return (
            <span>
              <a
                style={{ marginRight: 8 }}
                onClick={() =>
                  downdloadFile(record.downloadUrl, record.fileName)
                }
              >
                下载
              </a>
              {editable && (
                <a onClick={() => deleteFile(record, index)}>删除</a>
              )}
            </span>
          );
        },
      },
    ];
  };

  const handleCancel = () => {
    if (formChanged) {
      Modal.confirm({
        title: '提示',
        content: '您有未保存内容，是否保存修改后退出？',
        okText: '保存并退出',
        onCancel: cancelCallback,
        onOk: saveParams,
      });
    } else {
      cancelCallback();
    }
  };

  const saveParams = async () => {
    const { values } = await actions.submit();
    setSaving(true);
    const {
      data: { success, data },
    } = await service
      .saveFileParams({
        ...paramsDetail,
        ...values,
      })
      .finally(() => {
        setSaving(false);
      });
    if (success) {
      message.success('操作成功');
      setFormChanged(false);
      setDetailRefreshKey(detailRefreshKey + 1);
      okCallback();
    }
  };

  const formEffects = () => {
    onFieldInputChange$().subscribe((fieldState) => {
      setFormChanged(true);
    });
    onFieldValueChange$('.relatedFiles').subscribe(async (fieldState) => {
      actions.setFieldState('paramList', (state) => (state.loading = true));
      const {
        data: { success, data },
      } = await service
        .getDataFromFile({
          configId: detail.id,
          relatedFiles: fieldState.value,
        })
        .finally(() => {
          actions.setFieldState(
            'paramList',
            (state) => (state.loading = false)
          );
        });
      if (success) {
        actions.setFieldValue('paramList', data.paramList);
        // 刷新详情
        setDetailRefreshKey(detailRefreshKey + 1);
      }
    });
  };

  useEffect(() => {
    getParamsDetail();
  }, [detail.id]);

  return (
    <Drawer
      visible
      title="参数管理"
      width={'60vw'}
      bodyStyle={{
        position: 'relative',
        padding: 0,
        paddingBottom: 60,
        height: `calc(100% - 60px)`,
        overflow: 'hidden',
      }}
      onClose={handleCancel}
    >
      <Spin spinning={loading} wrapperClassName="spin-full">
        <div
          style={{
            height: '100%',
            overflow: 'auto',
            padding: 24,
          }}
        >
          <SchemaForm
            actions={actions}
            initialValues={paramsDetail}
            components={{
              FilesTable,
              ArrayTable,
              Input,
            }}
            effects={formEffects}
          >
            <FormTab defaultActiveKey={'tab-1'}>
              <FormTab.TabPane tab="数据源参数" name="tab-1">
                <Field
                  name="relatedFiles"
                  title="上传文件"
                  // required
                  x-component="FilesTable"
                  x-component-props={{
                    getTableColumns,
                    acceptExts: ['csv'],
                    maxSize: 200 * 1024 * 1024,
                    otherUploadProps: {
                      style: {
                        display: 'block',
                        marginBottom: 16,
                      },
                    },
                  }}
                  // x-rules={[{ required: true, message: '请上传文件' }]}
                />
                <Field
                  name="paramList"
                  type="array"
                  title="参数"
                  x-component="ArrayTable"
                  x-component-props={{
                    size: 'small',
                    className: styles['tight-table'],
                  }}
                  editable={false}
                  // minItems={1}
                  // required
                  // x-rules={[
                  //   { required: true, message: '请先上传有数据的文件' },
                  // ]}
                >
                  <Field type="object">
                    <Field
                      name="fileColumnIndex"
                      type="number"
                      title="索引列"
                      x-component="Input"
                      editable={false}
                    />
                    <Field
                      name="paramValue"
                      type="string"
                      title="数据来源"
                      x-component="Input"
                      editable={false}
                    />
                    <Field
                      name="paramName"
                      type="string"
                      title={<span>参数名(取自列表第一行数据)</span>}
                      x-component="Input"
                      editable={false}
                      x-render={(prop: ISchemaFieldComponentProps) => {
                        // tooltip加复制成${}格式
                        if (!prop.value) {
                          return '-';
                        }
                        return (
                          <span>
                            <Tooltip title={prop.value}>
                              <div
                                className="truncate"
                                style={{
                                  maxWidth: 200,
                                  display: 'inline-block',
                                  verticalAlign: 'middle',
                                }}
                              >
                                {prop.value}
                              </div>
                            </Tooltip>
                            <Icon
                              type="copy"
                              style={{
                                marginLeft: 8,
                                cursor: 'pointer',
                                color: '#11BBD5',
                              }}
                              onClick={() => {
                                copy(`\${${prop.value}\}`);
                                message.success('复制成功');
                              }}
                            />
                          </span>
                        );
                      }}
                    />
                  </Field>
                </Field>
              </FormTab.TabPane>
            </FormTab>
          </SchemaForm>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: 0,
            right: 0,
            textAlign: 'right',
            padding: '12px 24px',
            borderTop: '1px solid #e8e8e8',
          }}
        >
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button
            type="primary"
            ghost
            onClick={saveParams}
            loading={saving}
            disabled={![0, undefined].includes(detail.pressureStatus)}
          >
            保存
          </Button>
        </div>
      </Spin>
    </Drawer>
  );
};

export default Params;
