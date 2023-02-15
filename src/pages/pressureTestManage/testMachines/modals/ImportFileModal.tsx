import { Button, message, Modal } from 'antd';
import { ImportFile } from 'racc';
import React, { Fragment } from 'react';
import service from '../service';
interface Props {
  btnText?: string;
  id?: any;
  onSuccess?: () => void;
  visible?: boolean;
  setVisible?: (value) => void;
}

/**
 * @name 导入机器列表
 */
const ImportFileModal: React.FC<Props> = props => {
  const handleChange = async info => {
    const formData = new FormData();
    info.fileList.map(item => {
      formData.set('file', item.originFileObj);
    });
    const {
      data: { data, success, error }
    } = await service.importMachineFile(formData);
    if (success) {
      message.success('导入成功');
      props.setVisible(false);
      props.onSuccess();
      return;
    }
    message.error(error?.msg || '导入失败');
 
  };

  return (
    <Modal
      // title={props?.btnText}
      title={<span>导入机器列表 
      <Button 
        style={{ marginLeft: 8 }}
        type="link" 
        onClick={() => {window.location.href = 'https://shulie-daily.oss-cn-hangzhou.aliyuncs.com/yidongyun-hy/%E5%AF%BC%E5%85%A5%E6%9C%BA%E5%99%A8%E5%88%97%E8%A1%A8.xlsx';
        }}> 模版下载
      </Button>
      </span>}
      width={560}
      footer={null}
      visible={props.visible}
      onCancel={() => {
        props.setVisible(false);
      }}
    >
        <Fragment>
          <div style={{ marginTop: 12 }}>
            <ImportFile
              accept={['xlsx']}
              UploadProps={{
                type: 'drag',
                multiple: false,
                onChange: info => handleChange(info)
              }}
              fileName="file"
              onImport={file => true}
            >
              {/* <img
                src={require('./../../../assets/box.png')}
                style={{ width: 48 }}
              /> */}
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
                      marginTop: 8
                    }}
                  >
                    点击或将文件拖拽到此处上传
                  </span>
                  <span
                    className={`ant-upload-hint ft-12`}
                    style={{
                      color: 'rgba(0,0,0,0.43)',
                      display: 'block',
                      marginBottom: 40,
                      marginTop: 8
                    }}
                  >
                    支持格式：.xlsx
                  </span>
                </span>
              </p>
            </ImportFile>
          </div>
        </Fragment>
    </Modal>
  );
};
export default ImportFileModal;
