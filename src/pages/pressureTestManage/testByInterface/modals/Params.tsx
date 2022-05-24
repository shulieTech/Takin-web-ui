import React, { useState, useEffect, useMemo } from 'react';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  createAsyncFormActions,
  FormPath,
} from '@formily/antd';
import {
  Input,
  Select,
  ArrayTable,
  FormTab,
  FormMegaLayout,
  FormSlot,
} from '@formily/antd-components';
import { Modal, Tooltip } from 'antd';
import FilesTable from '../components/FilesTable';
import downdloadFile from 'src/utils/downloadFile';

interface Props {
  detail: any;
  okCallback: () => void;
  cancelCallback: () => void;
}

const Params: React.FC<Props> = (props) => {
  const { okCallback, cancelCallback } = props;
  const actions = useMemo(() => createAsyncFormActions(), []);

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

  const saveParams = async () => {
    return null;
  };
  return (
    <Modal
      visible
      title={
        <div>
          参数管理
          <Tooltip title="xxxxx">
            <a style={{ fontSize: 12, fontWeight: 'normal', marginLeft: 24 }}>
              参数使用方法
            </a>
          </Tooltip>
        </div>
      }
      width={'60vw'}
      bodyStyle={{
        maxHeight: '80vh',
        overflow: 'auto',
      }}
      onOk={saveParams}
      onCancel={cancelCallback}
    >
      <SchemaForm
        actions={actions}
        components={{
          FilesTable,
        }}
      >
        <FormTab defaultActiveKey={'tab-1'}>
          <FormTab.TabPane tab="数据源参数" name="tab-1">
            <Field
              name="files"
              title="上传文件"
              required
              x-component="FilesTable"
              x-component-props={{
                getTableColumns,
                acceptExts: ['csv', 'xslx', 'xls'],
                maxSize: 100 * 1024,
                otherUploadProps: {
                  style: {
                    display: 'block',
                    marginBottom: 16,
                  },
                },
              }}
            />
          </FormTab.TabPane>
        </FormTab>
      </SchemaForm>
    </Modal>
  );
};

export default Params;
