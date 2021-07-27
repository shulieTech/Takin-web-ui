import React, { Fragment, useEffect, useState } from 'react';
import SearchTable from 'src/components/search-table';
import getShellManageColumns from './components/ShellManageTable';
import getShellManageFormData from './components/ShellManageSearch';
import { useStateReducer } from 'racc';
import ShellManageService from './service';
import ShellManageTableAction from './components/ShellManageTableAction';
import { Modal, Spin } from 'antd';

interface ShellManageProps {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
  location?: any;
}

export interface ShellManageState {
  switchStatus: string;
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
  searchParamss?: any;
  tagList: any[];
  showModal: boolean;
  loading: boolean;
  executeResult: any;
  resultStatus: boolean;
  scriptDeployId: number;
}

const ShellManage: React.FC<ShellManageProps> = props => {
  const [state, setState] = useStateReducer<ShellManageState>({
    isReload: false,
    switchStatus: null,
    searchParams: {
      current: 0,
      pageSize: 10
    },
    searchParamss: props.location.query,
    tagList: null,
    showModal: false,
    loading: false,
    executeResult: null,
    resultStatus: null,
    scriptDeployId: null // 执行脚本id
  });

  useEffect(() => {
    queryTagList();
  }, []);

  useEffect(() => {
    let timer = null;
    if (state.showModal) {
      timer = setInterval(() => {
        queryScriptResult(state.scriptDeployId);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.showModal]);

  /**
   * @name 获取所有标签列表
   */
  const queryTagList = async () => {
    const {
      data: { success, data }
    } = await ShellManageService.queryScriptTagList({});
    if (success) {
      setState({
        tagList:
          data &&
          data.map(item => {
            return { label: item.tagName, value: item.id };
          })
      });
    }
  };

  /**
   * @name 查询执行脚本过程
   */
  const queryScriptResult = async value => {
    const {
      data: { data, success }
    } = await ShellManageService.queryShellResultList({
      scriptDeployId: value,
      type: 0
    });
    if (success) {
      if (data && data.length > 0 && data[0] && data[0].isStop === true) {
        setState({
          executeResult: data[0].result,
          loading: false,
          resultStatus: data[0].success
        });
        return;
      }
      setState({
        loading: true
      });
    }
  };

  return (
    <Fragment>
      <Modal
        title="运行shell脚本"
        visible={state.showModal}
        footer={null}
        onCancel={() => {
          setState({
            showModal: false,
            isReload: !state.isReload,
            scriptDeployId: null
          });
        }}
      >
        {state.loading || state.resultStatus === null ? (
          <div style={{ minHeight: 200, textAlign: 'center', marginTop: 40 }}>
            <Spin tip="脚本执行中..." />
          </div>
        ) : (
          state.executeResult && (
            <div style={{ minHeight: 200 }}>
              <div>
                {state.resultStatus
                  ? 'shell脚本执行成功！'
                  : 'shell脚本执行失败！'}
              </div>
              <div>执行记录：{state.executeResult}</div>
            </div>
          )
        )}
      </Modal>
      <SearchTable
        key="id"
        commonTableProps={{
          columns: getShellManageColumns(state, setState)
          // rowClassName: () => 'show-row'
        }}
        commonFormProps={{
          formData: getShellManageFormData(state, setState),
          rowNum: 6
        }}
        ajaxProps={{ url: '/shellScriptManage/list', method: 'POST' }}
        searchParams={state.searchParamss}
        toggleRoload={state.isReload}
        tableAction={
          <ShellManageTableAction state={state} setState={setState} />}
      />
    </Fragment>
  );
};
export default ShellManage;
function getShellManageColumns(
  state: ShellManageState,
  setState: (state: Partial<ShellManageState>) => void
) {
  throw new Error('Function not implemented.');
}
