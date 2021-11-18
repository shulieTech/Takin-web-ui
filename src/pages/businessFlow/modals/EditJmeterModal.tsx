import React, { Fragment, useEffect } from 'react';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import BusinessFlowService from '../service';
import { message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Controlled as CodeMirror } from 'react-codemirror2';
import styles from './../index.less';
import { router } from 'umi';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');

interface Props {
  btnText?: string | React.ReactNode;
  fileId?: number | string;
  state?: any;
  setState?: (value) => void;
  fileData: any;
  id?: string;
}

interface State {
  isReload?: boolean;
  scriptCode: any;
}
const EditJmeterModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    scriptCode: null
  });

  const { fileId, fileData } = props;

  const handleClick = () => {
    queryScriptCode();
  };

  const handleCancle = () => {
    setState({
      scriptCode: null
    });
  };

  /**
   * @name 获取文件脚本代码
   */
  const queryScriptCode = async () => {
    const {
      data: { success, data }
    } = await BusinessFlowService.queryScriptCode({
      scriptFileUploadPath: fileId
    });
    if (success) {
      setState({
        scriptCode: data.content
      });
    }
  };

  /**
   * @name 修改文件脚本代码
   */
  const handleChangeCode = value => {
    setState({
      scriptCode: value
    });
  };

  /**
   * @name 保存并解析jmeter脚本，跳转到详情
   */

  const handleSubmit = async () => {
    return await new Promise(resolve => {
      props.state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }
        const {
          data: { data, success }
        } = await BusinessFlowService.saveAndAnalysis({
          id: props.id,
          scriptFile: {
            ...fileData,
            scriptContent: state.scriptCode
          }
        });
        if (success) {
          message.success('保存成功!');
          props.setState({
            isReload: !props.state.isReload
          });
          router.push(`/businessFlow/details?id=${data.id}&isAuto=true`);

          resolve(true);
          return;
        }
        resolve(false);
      });
    });
  };

  return (
    <CommonModal
      modalProps={{
        width: 'calc(100% - 40px)',
        title: '编辑代码',
        centered: true,
        okText: '保存并解析'
      }}
      btnProps={{ type: 'link' }}
      btnText={props.btnText}
      onClick={() => handleClick()}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
    >
      <div style={{ height: 700 }}>
        <CodeMirror
          className={styles.codeMirror}
          value={state.scriptCode}
          options={{
            mode: 'xml',
            theme: 'material',
            lineNumbers: true
          }}
          onBeforeChange={(editor, data, value) => {
            handleChangeCode(value);
          }}
          onChange={(editor, data, value) => {
            handleChangeCode(value);
          }}
        />
      </div>
    </CommonModal>
  );
};
export default EditJmeterModal;
