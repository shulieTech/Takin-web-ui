import React, { useState, useEffect, useMemo } from 'react';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  createAsyncFormActions,
  FormEffectHooks,
} from '@formily/antd';
import { Input, ArrayTable, FormTab } from '@formily/antd-components';
import { Drawer, Button, Modal, Spin } from 'antd';
import FilesTable from '../components/FilesTable';
import downdloadFile from 'src/utils/downloadFile';
import service from '../service';
import styles from '../index.less';

interface Props {
  detail: any;
  okCallback: () => void;
  cancelCallback: () => void;
}

const Params: React.FC<Props> = (props) => {
  const { detail, okCallback, cancelCallback } = props;
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
        id: detail.id,
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
              {editable && <a onClick={() => mutators.remove(index)}>删除</a>}
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
      setFormChanged(false);
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
                  required
                  x-component="FilesTable"
                  x-component-props={{
                    getTableColumns,
                    acceptExts: ['csv', 'xlsx', 'xls'],
                    maxSize: 100 * 1024,
                    otherUploadProps: {
                      style: {
                        display: 'block',
                        marginBottom: 16,
                      },
                    },
                  }}
                  x-rules={[{ required: true, message: '请上传文件' }]}
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
                  minItems={1}
                  editable={false}
                  required
                  x-rules={[
                    { required: true, message: '请先上传有数据的文件' },
                  ]}
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
                      title="参数名"
                      x-component="Input"
                      editable={false}
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
          <Button type="primary" ghost onClick={saveParams} loading={saving}>
            保存
          </Button>
        </div>
      </Spin>
    </Drawer>
  );
};

export default Params;
