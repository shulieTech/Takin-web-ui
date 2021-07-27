import { Col, Modal, Row } from 'antd';
import { useStateReducer } from 'racc';
import React, { Fragment, useEffect, useState } from 'react';
import SearchTable from 'src/components/search-table';
import BusinessFlowService from '../businessFlow/service';
import LinkMarkService from '../linkMark/service';
import _ from 'lodash';
import getScriptManageFormData from './components/ScriptManageSearch';
import getScriptManageColumns from './components/ScriptManageTable';
import ScriptManageTableAction from './components/ScriptManageTableAction';
import ScriptManageService from './service';
import styles from './index.less';
import { Controlled as CodeMirror } from 'react-codemirror2';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');

interface ScriptManageProps {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
  location?: any;
}

export interface ScriptManageState {
  switchStatus: string;
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
  searchParamss?: any;
  tagList: any[];
  debugStatus: number;
  scriptDebugId: number;
  errorInfo: any;
  timeOn: any;
  visible: boolean;
  code: any;
  timer3: any;
  scroll: any;
  row: any;
}

const ScriptManage: React.FC<ScriptManageProps> = props => {
  const [newdata, setData] = useState([]);
  const [state, setState] = useStateReducer<ScriptManageState>({
    isReload: false,
    switchStatus: null,
    searchParams: {
      current: 0,
      pageSize: 10
    },
    searchParamss: props.location.query,
    tagList: [],
    timeOn: false,
    scriptDebugId: undefined, // 脚本调试id
    debugStatus: 0, // 调试状态，0：未开始, 1：通过第二阶段， 2，3：通过第三阶段，4：通过第四阶段,
    errorInfo: null,
    visible: false,
    code: '',
    timer3: '',
    scroll: {
      x: 0,
      y: 0
    },
    row: {},
  });

  useEffect(() => {
    queryTagList();
  }, []);

  useEffect(() => {
    queryList();
  }, [state.timeOn]);

  const queryList = () => {
    setTimeout(async () => {
      const {
        data: { data, success }
      } = await ScriptManageService.addScript({
        current: 0,
        pageSize: 10
      });
      if (success) {
        if (!_.isEqual(newdata, data)) {
          setData(data);
          setState({
            isReload: !state.isReload
          });
        }
      }
      setState({
        timeOn: !state.timeOn
      });
    }, 10000);
  };

  /**
   * @name 获取所有标签列表
   */
  const queryTagList = async () => {
    const {
      data: { success, data }
    } = await ScriptManageService.queryScriptTagList({});
    if (success) {
      const dataList = [];
      data.map(item => {
        dataList.push({ label: item.valueName, value: item.valueCode });
      });
      setState({
        tagList: dataList
      });
    }
  };

  const handleCancel = () => {
    clearTimeout(state.timer3);
    setState({
      visible: false,
      code: '',
    });
  };
  return (
    <Fragment>
      <SearchTable
        key="id"
        commonTableProps={{
          columns: getScriptManageColumns(state, setState)
        }}
        commonFormProps={{
          formData: getScriptManageFormData(state, setState),
          rowNum: 6
        }}
        ajaxProps={{ url: '/opsScriptManage/page', method: 'GET' }}
        searchParams={state.searchParamss}
        toggleRoload={state.isReload}
        tableAction={
          <ScriptManageTableAction state={state} setState={setState} />}
      />
      <Modal
        title={`脚本执行 - ${{
          1: '影子库表创建脚本',
          2: '基础数据准备脚本',
          3: '铺底数据脚本',
          4: '影子库表清理脚本',
          5: '缓存预热脚本',
        }[state.row.scriptType]}（${state.row.name}）`}
        width={1100}
        visible={state.visible}
        footer={null}
        onCancel={() => handleCancel()}
        style={{ top: 60 }}
      >
        <div style={{ height: '600px' }}>
          <CodeMirror
            className={styles.codeMirror}
            value={state.code}
            options={{
              mode: 'xml',
              theme: 'material',
              lineNumbers: true,
              readOnly: true
            }}
            scroll={state.scroll}
          />
        </div>
      </Modal>
    </Fragment>
  );
};
export default ScriptManage;
