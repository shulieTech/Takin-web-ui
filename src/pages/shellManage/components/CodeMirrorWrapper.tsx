import { Col, Divider, message, Popover, Row } from 'antd';
import React, { Fragment, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import ShellVersionModal from '../modals/ShellVersionModal';
import styles from './../index.less';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/shell/shell.js');

interface Props {
  value?: any;
  onChange?: (value: any) => void;
  version?: number;
  scriptId?: string;
  action: string;
  versionsList?: any;
}
const CodeMirrorWrapper: React.FC<Props> = props => {
  const { action, versionsList, value, onChange, ...restProps } = props;

  const handleChange = (editor, data, values) => {
    props.onChange(values);
  };

  return (
    <Fragment>
      {action === 'edit' && (
        <ShellVersionModal
          versionsList={props.versionsList}
          scriptId={props.scriptId}
          version={props.version}
          currentShellCode={value}
          btnText="版本对比"
        />
      )}
      <CodeMirror
        className={styles.codeMirror}
        value={value}
        onBeforeChange={handleChange}
        {...restProps}
        options={{
          mode: 'shell',
          // theme: 'material',
          lineNumbers: true
        }}
      />
    </Fragment>
  );
};
export default CodeMirrorWrapper;
