import React, { Fragment, useEffect } from 'react';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import { Col, message, Row } from 'antd';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import ShellManageService from '../service';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/shell/shell.js');

interface Props {
  btnText?: string | React.ReactNode;
  currentShellCode: any;
  version: number;
  scriptId: string;
  versionsList: any;
}

interface State {
  version: number;
  shellScriptCode: any;
}
const ShellVersionModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    version: null,
    shellScriptCode: null
  });

  const handleClick = () => {
    setState({
      version: props.version
    });
    queryShellScriptCode(props.version);
  };

  /**
   * @name 获取shell脚本代码
   */
  const queryShellScriptCode = async version => {
    const {
      data: { success, data }
    } = await ShellManageService.queryShellScriptCode({
      version,
      scriptId: props.scriptId
    });
    if (success) {
      setState({
        shellScriptCode: data.content
      });
    }
  };

  const handleChangeVersion = value => {
    setState({
      version: value
    });
    queryShellScriptCode(value);
  };

  return (
    <CommonModal
      modalProps={{
        width: '100%',
        title: '版本脚本对比'
      }}
      btnProps={{ type: 'link' }}
      btnText={props.btnText}
      onClick={() => handleClick()}
    >
      <Row>
        <Col span={12} style={{ padding: 8 }}>
          <div style={{ height: 40, lineHeight: '40px' }}>提交内容：</div>
          <CodeMirror
            value={props.currentShellCode}
            options={{
              mode: 'shell',
              theme: 'material',
              lineNumbers: true,
              readOnly: true
            }}
            onBeforeChange={(editor, data, value) => {
              //   handleChangeCode(value);
            }}
            onChange={(editor, data, value) => {
              //   handleChangeCode(value);
            }}
          />
        </Col>
        <Col span={12} style={{ padding: 8 }}>
          <div style={{ height: 40 }}>
            对比版本：
            <CommonSelect
              value={state.version}
              style={{ width: 150 }}
              allowClear={false}
              onChange={handleChangeVersion}
              dataSource={props.versionsList ? props.versionsList : []}
              onRender={item => (
                <CommonSelect.Option key={item.value} value={item.value}>
                  {item.label}
                </CommonSelect.Option>
              )}
            />
          </div>
          <CodeMirror
            value={state.shellScriptCode}
            options={{
              mode: 'shell',
              theme: 'material',
              lineNumbers: true,
              readOnly: true
            }}
            onBeforeChange={(editor, data, value) => {
              //   handleChangeCode(value);
            }}
            onChange={(editor, data, value) => {
              //   handleChangeCode(value);
            }}
          />
        </Col>
      </Row>
    </CommonModal>
  );
};
export default ShellVersionModal;
