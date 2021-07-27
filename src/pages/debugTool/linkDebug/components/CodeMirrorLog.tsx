import { Col, Divider, message, Popover, Row } from 'antd';
import React, { Fragment, useEffect } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import styles from './../index.less';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/sql/sql.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/shell/shell.js');
require('codemirror/addon/display/placeholder.js');

interface Props {
  value?: any;
  onChange?: (value: any) => void;
  mode?: string;
  theme?: string;
  placeholder?: string;
}
const CodeMirrorLog: React.FC<Props> = props => {
  const { placeholder, value, theme, mode, onChange, ...restProps } = props;

  return (
    <div className={styles.codeMirrorLog}>
      <CodeMirror
        className={styles.codeMirror}
        value={value}
        onBeforeChange={() => true}
        {...restProps}
        options={{
          // theme: theme || null,
          mode: mode || 'xml',
          lineNumbers: true,
          lineWrapping: 'wrap',
          placeholder: placeholder || null,
          focus: false
        }}
      />
    </div>
  );
};
export default CodeMirrorLog;
