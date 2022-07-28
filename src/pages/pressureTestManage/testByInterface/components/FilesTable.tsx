import React from 'react';
import { Upload, Table, message, Icon, Button } from 'antd';
import { IFieldMergeState } from '@formily/antd';
import { debounce } from 'lodash';
import service from '../service';

const FilesTable = (props: IFieldMergeState) => {
  const { value = [], schema, editable, path, mutators } = props;
  const componentProps = schema.getExtendsComponentProps() || {};
  const {
    uploadAction = service.uploadFile,
    uploadChildren,
    uploadTip,
    fileFiledName = 'file',
    acceptExts,
    maxSize,
    getTableColumns,
    otherUploadProps,
    othterTableProps,
  } = componentProps;

  const columns = getTableColumns(mutators, editable);

  const beforeUpload = debounce(async (file, fileList) => {
    const passed = fileList.every((x) => {
      if (
        acceptExts.indexOf(
          x.name.substr(x.name.lastIndexOf('.') + 1).toLowerCase()
        ) === -1
      ) {
        message.error('上传的文件含有不可接受类型，请检查后上传');
        return false;
      }
      if (maxSize > 0 && x.size > 1024 * 1024 * maxSize) {
        message.error(`上传的文件大小不能超过${maxSize}M`);
        return false;
      }
      if (value.some((y) => y.fileName === x.name)) {
        message.error('不能重复上传文件');
        return false;
      }
      return true;
    });
    if (passed) {
      const formData = new FormData();
      fileList.forEach((z) => {
        formData.append(fileFiledName, z, z.name);
      });
      const msg = message.loading('文件上传中...', 0);
      const {
        data: { data, success },
      } = await uploadAction(formData).finally(() => {
        msg();
      });
      if (success) {
        mutators.push(data);
        return Promise.resolve(data);
      }
    }
    return Promise.reject(false);
  }, 500);

  const getSizeStr = (size) => {
    if (size > 1024 * 1024 * 1024) {
      return `${(size / 1024 / 1024 / 1024).toFixed(2)}GB`;
    }
    if (size > 1024 * 1024) {
      return `${(size / 1024 / 1024).toFixed(2)}M`;
    }
    if (size > 1024) {
      return `${(size / 1024).toFixed(2)}KB`;
    }
    return `${size.toFixed(2)}B`;
  };
  return (
    <>
      <Upload
        type="drag"
        multiple
        beforeUpload={beforeUpload}
        accept={acceptExts?.length > 0 ? `.${acceptExts.join(',.')}` : undefined}
        {...otherUploadProps}
        disabled={!editable}
        customRequest={(options) => 0}
        showUploadList={false}
      >
        {uploadChildren || (
          <div
            style={{
              padding: 20,
              textAlign: 'center',
            }}
          >
            <Icon
              type="cloud-upload"
              style={{
                fontSize: 24,
                marginBottom: 8,
              }}
            />
            <br />
            <Button size="small" style={{ fontSize: 12 }}>
              点击新增
            </Button>
            <br />
            <span
              style={{
                display: 'inline-block',
                color: '#90959A',
                fontSize: 12,
                marginTop: 8,
                marginBottom: 8,
              }}
            >
              或者拖拽到此上传文件
            </span>
            <br />
            <span>
              {acceptExts?.length > 0 && (
                <span>支持格式：{acceptExts.join('、')} </span>
              )}
            </span>
            {maxSize > 0 && <span>（不超过{getSizeStr(maxSize)}）</span>}
            <br />
            {uploadTip && <div>{uploadTip}</div>}
          </div>
        )}
      </Upload>
      <Table
        size="small"
        columns={columns}
        dataSource={value}
        pagination={false}
        {...othterTableProps}
      />
    </>
  );
};

FilesTable.isFieldComponent = true;

export default FilesTable;
