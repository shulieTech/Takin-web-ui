import React from 'react';
import { Upload, message } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import { debounce } from 'lodash';

interface Props extends UploadProps {
  maxSize?: number;
  fileFiledName?: string;
  acceptExts?: string[];
  initailFileList?: any[];
  service: (formData: FormData) => Promise<any>;
  afterUpload?: (data: any) => any;
}

const UploadFile: React.FC<Props> = (props) => {
  const {
    service,
    acceptExts = [],
    fileFiledName = 'file',
    maxSize = 0,
    initailFileList = [],
    afterUpload,
    ...rest
  } = props;

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
      if (initailFileList.some((y) => y.fileName === x.name)) {
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
      } = await service(formData).finally(() => {
        msg();
      });
      if (success) {
        if (afterUpload) {
          afterUpload(data);
        }
        return Promise.resolve(data);
      }
    }
    return Promise.reject(false);
  }, 500);

  return (
    <Upload
      beforeUpload={beforeUpload}
      customRequest={(options) => 0}
      showUploadList={false}
      {...rest}
    />
  );
};

export default UploadFile;
