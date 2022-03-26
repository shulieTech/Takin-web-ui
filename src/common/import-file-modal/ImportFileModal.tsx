import { Button, Icon, Modal, Row } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import React, { Fragment } from 'react';
import styles from './index.less';
interface Props extends ModalProps {
  fileTitle?: string | React.ReactNode;
  status: 'loading' | 'success' | 'fail';
  fileName: string;
  footerTxt?: string | React.ReactNode;
  onBtnClick?: () => void;
  footerBtnTxt?: string;
  extraNode?: React.ReactNode;
}
const ImportFileModal: React.FC<Props> = props => {
  const {
    fileName,
    fileTitle,
    extraNode,
    status,
    footerTxt,
    footerBtnTxt,
    onBtnClick
  } = props;
  return (
    <Modal {...props} footer={null} width={480}>
      <div className={styles.fileTitle}>{fileTitle}</div>
      <div className={styles.fileNameWrap}>
        {status === 'loading' && (
          <img
            className={styles.spinloading}
            style={{ width: 15, marginRight: 4 }}
            src={require('./../../assets/loading_icon.png')}
          />
        )}
        {status === 'success' && (
          <Icon type="check" className={styles.iconSuccess} />
        )}
        {status === 'fail' && <Icon type="close" className={styles.iconFail} />}
        <span className={styles.fileName}>{fileName}</span>
        {extraNode}
      </div>
      <Row
        type="flex"
        align="middle"
        className={`${styles.footer} ${
          {
            loading: styles.loadingFooter,
            success: styles.successFooter,
            fail: styles.failFooter,
          }[status]
        }`}
      >
        <span>{footerTxt}</span>
        {footerBtnTxt && (
          <span className={styles.btn} onClick={onBtnClick}>
            {footerBtnTxt}
          </span>
        )}
      </Row>
    </Modal>
  );
};
export default ImportFileModal;
