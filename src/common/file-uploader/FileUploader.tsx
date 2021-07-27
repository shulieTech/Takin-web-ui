/**
 * @name
 * @author MingShined
 */
import React, { useEffect, useState } from 'react';
import { ImportFile } from 'racc';
import AppService from 'src/services/app';
import { message } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';

interface Props {
  onChange?: (value: Partial<UploadFile>) => void;
  value?: UploadFile[] | any;
}

const FileUploader: React.FC<Props> = props => {
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    if (props.value && props.value.length) {
      setFileList(props.value);
    }
  }, [props.value]);
  const handleImport = async file => {
    const {
      data: { data, success }
    } = await AppService.uploadSingleFile(file);
    if (success) {
      message.success('上传成功');
      if (props.onChange) {
        props.onChange(data);
      }
    }
  };
  const handleRemove = file => {
    const index = fileList.findIndex(item => item.uid === file.uid);
    const newFileList = [...fileList];
    newFileList.splice(index, 1);
    setFileList(newFileList);
    if (props.onChange) {
      props.onChange(null);
    }
  };
  return (
    <ImportFile
      UploadProps={{
        fileList,
        showUploadList: true,
        onRemove: handleRemove
      }}
      accept={['jpg', 'jpeg', 'JPG', 'JPEG', 'PNG', 'png', 'pdf', 'xls', 'xlsx', 'jar']}
      onImport={handleImport}
      size={5120}
    >
      {props.children}
    </ImportFile>
  );
};
export default FileUploader;
