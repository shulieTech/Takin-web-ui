/**
 * @name
 * @author MingShined
 */
import { Button, Col, Icon, message, Modal, Row } from 'antd';
import { ImportFile, useStateReducer } from 'racc';
import React, { Fragment } from 'react';
import styles from '../index.less';
import AuthorityConfigService from '../service';
declare var serverUrl: string;
interface Props {
  onSuccess: () => void;
}
const ImportAccountModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    visible: false
  });
  const title: React.ReactNode = (
    <Fragment>
      <Icon
        className={styles.ModalIcon}
        type="import"
        style={{
          color: 'var(--BrandPrimary-500)',
          transform: 'translateY(4px)',
          marginRight: 8
        }}
      />
      <span style={{ fontWeight: 600, fontSize: 16, color: '#434343' }}>
        导入
      </span>
    </Fragment>
  );
  const handleImport = async file => {
    const {
      data: { data }
    } = await AuthorityConfigService.importAccount(file);
    const key = 'upload';
    message.loading({ key, content: '文件解析中，请稍等' });
    if (data) {
      if (data.writeBack) {
        message.error({ key, content: data.errorMsg });
        location.href = `${serverUrl}/user/download?path=${data.filePath}`;
        // const {
        //   data: { success }
        // } = await AuthorityConfigService.downloadErrotFile({
        //   path: data.filePath
        // });
        // if (success) {
        setState({ visible: false });
        // }
        return;
      }
      message.success({ key, content: '导入成功' });
      setState({ visible: false });
      props.onSuccess();
    }
  };
  return (
    <Fragment>
      <Button onClick={() => setState({ visible: true })}>导入账号</Button>
      <Modal
        visible={state.visible}
        maskClosable
        onCancel={() => setState({ visible: false })}
        title={title}
        footer={null}
      >
        <Row
          type="flex"
          justify="space-between"
          style={{
            padding: 12,
            background: '#F2F2F2',
            border: '1px solid #D9D9D9',
            boxShadow: '0px 2px 20px 0px rgba(92, 80, 133, 0.15)',
            borderRadius: 4,
            marginBottom: 12
          }}
        >
          <Col>
            <Icon
              type="info-circle"
              style={{ color: '#595959' }}
              theme="filled"
            />
            <span style={{ color: '#666666', fontSize: 13, marginLeft: 12 }}>
              导入部门账号可实现批量创建部门和账号
            </span>
          </Col>
          <Col>
            <Button
              type="link"
              onClick={() => {
                // httpGet('/user/example/download');
                location.href = `${serverUrl}/user/example/download`;
              }}
            >
              下载模板
            </Button>
          </Col>
        </Row>
        <ImportFile
          UploadProps={{
            style: { width: '100%' },
            className: styles.importAccount,
            type: 'drag'
          }}
          accept={['csv']}
          fileName="file"
          onImport={handleImport}
        >
          <Row
            justify="center"
            align="middle"
            style={{
              flexDirection: 'column',
              // border: '1px dashed #979797',
              background: '#FAFBFD',
              cursor: 'pointer',
              borderRadius: 4,
              textAlign: 'center',
              padding: '50px 0'
            }}
          >
            <Col>
              <Icon type="upload" className={styles.ModalIcon} />
            </Col>
            <Col style={{ margin: '16px 0 8px' }}>
              <span style={{ color: '#474C50', fontSize: 16, fontWeight: 500 }}>
                点击或拖拽文件至此处上传
              </span>
            </Col>
            <Col>
              <span style-={{ color: '#A2A6B1' }}>支持扩展名：.csv</span>
            </Col>
          </Row>
        </ImportFile>
      </Modal>
    </Fragment>
  );
};
export default ImportAccountModal;
