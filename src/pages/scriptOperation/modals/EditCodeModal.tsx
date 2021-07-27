import React, { Fragment, useEffect } from 'react';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import ScriptManageService from '../service';
import { message, Alert } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Controlled as CodeMirror } from 'react-codemirror2';
import styles from './../index.less';
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
  type?: any;
  name?: string;
}

interface State {
  isReload?: boolean;
  tags: any;
  form: any;
  scriptCode: any;
  timer3: any;
  scroll: any;
}
const EditCodeModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    tags: undefined,
    form: null as WrappedFormUtils,
    scriptCode: null,
    timer3: null,
    scroll: {
      x: 0,
      y: 0
    },
  });

  const { fileId } = props;

  const handleClick = async () => {
    if (props.btnText === '编辑') {
      const {
        data: { success, data }
      } = await ScriptManageService.addScriptTags({
        path: fileId
      });
      if (success) {
        setState({
          scriptCode: data
        });
      }
    } else if (props.btnText === '查看结果') {
      const {
        data: { success, data }
      } = await ScriptManageService.queryScriptCode({
        id: fileId
      });
      if (success) {
        setState({
          scriptCode: data
        });
      }
    } else {
      distribution(fileId);
    }
  };

  const distribution = async id => {
    let timer3;
    clearTimeout(timer3);
    const {
      data: { success, data }
    } = await ScriptManageService.startDebug({ id });
    if (success) {
      if (data.end === false) {
        timer3 = setTimeout(() => distribution(id), 5000);
        setState({ timer3, scriptCode: data.content });
      } else {
        setState({
          scriptCode: data.content, scroll: {
            x: 0,
            y: 10000000000000000
          }
        });
      }
    }
  };

  const handleCancle = () => {
    clearTimeout(state.timer3);
    setState({
      tags: undefined,
      scriptCode: null
    });
  };

  /**
   * @name 修改文件脚本代码
   */
  const handleChangeCode = value => {
    setState({
      scriptCode: value
    });
    props.setState({
      scriptCode: value
    });
  };

  /**
   * @name 保存文件
   */

  const handleSubmit = async () => {
    props.setState({
      scriptCode: state.scriptCode
    });
    return await new Promise(async resolve => {
      props.setState({
        uploadFiles: props.state.uploadFiles.map((item, k) => {
          item.content = state.scriptCode;
          return item;
        })
      });
      resolve(true);
    });
  };
  let modalProps = {};
  let readonly = true;
  if (props.btnText !== '编辑') {
    modalProps = {
      width: '1100px',
      title: `脚本执行 - ${{
        1: '影子库表创建脚本',
        2: '基础数据准备脚本',
        3: '铺底数据脚本',
        4: '影子库表清理脚本',
        5: '缓存预热脚本',
      }[props.type]}（${props.name}）`,
      centered: true,
      footer: null
    };
    readonly = true;
  } else {
    modalProps = {
      width: '1100px',
      title: `脚本执行 - ${{
        1: '影子库表创建脚本',
        2: '基础数据准备脚本',
        3: '铺底数据脚本',
        4: '影子库表清理脚本',
        5: '缓存预热脚本',
      }[props.type]}（${props.name}）`,
      centered: true,
    };
    readonly = false;
  }
  return (
    <CommonModal
      modalProps={modalProps}
      btnProps={{ type: 'link' }}
      btnText={props.btnText}
      onClick={handleClick}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
    >
      <div style={{ height: 600 }} className={styles.alert}>
        {
          props.btnText === '查看结果' ? <Alert
            message="脚本执行中，执行记录仅保存最近一次。若关闭后执行未结束，您可再次打开查看"
            type="info"
            showIcon
          /> : null
        }
        <div style={{ marginBottom: 10 }} />
        <CodeMirror
          className={styles.codeMirror}
          value={state.scriptCode}
          options={{
            mode: 'xml',
            theme: 'material',
            lineNumbers: true,
            readOnly: readonly
          }}
          scroll={state.scroll}
          onBeforeChange={(editor, data, value) => {
            // this.setState({value});
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
export default EditCodeModal;
