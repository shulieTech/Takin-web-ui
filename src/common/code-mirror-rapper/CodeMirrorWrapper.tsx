import React, { Fragment, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import styles from './index.less';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/theme/eclipse.css');
require('codemirror/theme/monokai.css');
require('codemirror/theme/idea.css');

// 多语言支持？
import 'codemirror/addon/mode/overlay';
import 'codemirror/addon/mode/multiplex';
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/sql/sql.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/shell/shell.js');
require('codemirror/mode/nginx/nginx.js');
require('codemirror/mode/solr/solr.js');
require('codemirror/mode/jsx/jsx.js');

require('codemirror/addon/display/placeholder.js');
require('codemirror/keymap/sublime');

interface Props {
  value?: any;
  onChange?: (value: any) => void;
  mode?: string;
  theme?: string;
  placeholder?: string;
  restProps?: any;
}
const CodeMirrorWrapper: React.FC<Props> = props => {
  const { placeholder, value, theme, mode, onChange, ...restProps } = props;

  const handleChange = (editor, data, values) => {
    props.onChange(values);
  };

  return (
    <CodeMirror
      className={styles.codeMirror}
      value={value}
      onBeforeChange={handleChange}
      options={{
        mode: mode || 'xml',
        lineNumbers: true,
        lineWrapping: 'wrap',
        placeholder: placeholder || null,
        ...restProps
      }}
    />
  );
};
export default CodeMirrorWrapper;
