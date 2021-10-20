import React, { Fragment } from 'react';
import { CommonModal } from 'racc';
import CodeMirrorWrapper from 'src/common/code-mirror-rapper/CodeMirrorWrapper';

interface Props {
  btnText?: string | React.ReactNode;
  errorInfo: string;
}

const ErrorInfoModal: React.FC<Props> = props => {
  const { errorInfo } = props;

  return (
    <CommonModal
      modalProps={{
        width: 800,
        title: '异常日志',
        footer: null
      }}
      btnProps={{ type: 'link' }}
      btnText={props.btnText}
    >
      <CodeMirrorWrapper
        onChange={() => true}
        value={errorInfo}
        restProps={{ readOnly: 'nocursor' }}
      />
    </CommonModal>
  );
};
export default ErrorInfoModal;
