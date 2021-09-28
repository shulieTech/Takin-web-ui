import { AutoComplete, Button, Card, Select } from 'antd';
import React, { Fragment, useContext, useEffect } from 'react';
import { AppAccessContext } from '../indexPage';
import AppAccessService from '../service';
import CardTitle from './CardTitle';
import debounce from 'lodash/debounce';
import AgentVersionWrap from './AgentVersionWrap';
import SelectVersionModal from '../modals/SelectVersionModal';
interface Props {
  state: any;
  setState: (value: any) => void;
}

const FirstContent: React.FC<Props> = props => {
  const { state, setState } = props;
  const handleChange = value => {
    setState({
      appName: value
    });
  };

  const onSearch = searchText => {
    if (!searchText) {
      setState({
        appList: []
      });
      return;
    }
    queryAppList({ keyword: searchText });
  };

  /**
   * @name 获取应用列表
   */
  const queryAppList = async value => {
    const {
      data: { success, data }
    } = await AppAccessService.queryAppList({
      ...value
    });
    if (success) {
      setState({
        appList: data
      });
      return;
    }
  };

  /**
   * @name 获取探针版本列表
   */
  const queryVersionList = async value => {
    const {
      data: { success, data }
    } = await AppAccessService.queryVersionList({
      ...value
    });
    if (success) {
      setState({
        agentVersionInfo: data && data.length > 0 ? data[0] : null
      });
      return;
    }
  };

  return (
    <Fragment>
      <Card
        title={
          <CardTitle
            title="填写应用"
            describe="请填写正确的应用名称，用于后续启动参数的生成"
          />
        }
        size="small"
      >
        <AutoComplete
          value={state.appName}
          dataSource={state.appList}
          style={{ width: '100%', lineHeight: '50px' }}
          onChange={handleChange}
          onSearch={debounce(onSearch, 300)}
          placeholder="请输入待接入应用名称"
        />
      </Card>
      <Card
        style={{ marginTop: 16 }}
        title={<CardTitle title="选择探针版本" />}
        size="small"
      >
        <SelectVersionModal
          state={state}
          setState={setState}
          btnText="重新选择"
          agentId={
            state.agentVersionInfo &&
            state.agentVersionInfo.id &&
            String(state.agentVersionInfo.id)
          }
          selectedVersionInfo={state.agentVersionInfo}
        />
        <div style={{ marginTop: 10 }}>
          {state.agentVersionInfo ? (
            <AgentVersionWrap
              time={state.agentVersionInfo.gmtUpdate}
              version={state.agentVersionInfo.version}
              feature={state.agentVersionInfo.versionFeatures}
            />
          ) : (
            <div>暂无探针版本，请先至后台管理-探针版本页面新增探针版本</div>
          )}
        </div>
      </Card>
    </Fragment>
  );
};

export default FirstContent;
