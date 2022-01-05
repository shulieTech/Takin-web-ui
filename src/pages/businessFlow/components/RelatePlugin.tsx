/**
 * @name
 * @author MingShined
 */
import { Col, Row } from 'antd';
import { CommonSelect, useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import ScriptManageService from '../service';

interface Props {
  value?: any[];
  onChange?: (value: any[] | any) => void;
  pluginList: any[];
}

const RelatePlugin: React.FC<Props> = (props) => {
  const { value = [], onChange, pluginList = [] } = props;

  const handleChange = (val, index) => {
    const result = [...value];
    result[index] = val;
    const isEmpty = !result.length || result.find((item) => !item);
    if (isEmpty) {
      onChange([]);
      return;
    }
    onChange(result);
  };

  // if (!state.pluginList.length) {
  //   return <Fragment>暂无插件列表</Fragment>;
  // }
  return (
    <>
      {pluginList.map((item, index) => (
        <PluginSelectItem
          key={index}
          value={value[index]}
          onChange={(val) => handleChange(val, index)}
          {...item}
        />
      ))}
    </>
  );
};
export default RelatePlugin;

interface PluginSelectItemProps {
  type: string;
  singlePluginRenderResponseList: any[];
  onChange?: (value: any) => void;
  value?: any;
}
const PluginSelectItem: React.FC<PluginSelectItemProps> = (props) => {
  const [state, setState] = useStateReducer({
    name: undefined,
    version: undefined,
    versionList: [],
  });
  useEffect(() => {
    if (state.name) {
      queryVersionList();
    }
  }, [state.name]);
  useEffect(() => {
    if (props.value) {
      setState({ name: props.value.name, version: props.value.version });
      return;
    }
    setState({ name: undefined, version: undefined, versionList: [] });
  }, [props.value]);
  const queryVersionList = async () => {
    const {
      data: { data, success },
    } = await ScriptManageService.queryPluginVersionList({
      pluginId: state.name,
    });
    if (success) {
      setState({
        versionList: data.versionList.map((item) => ({
          label: item,
          value: item,
        })),
      });
    }
  };
  useEffect(() => {
    if (state.version) {
      handleChange();
    }
  }, [state.version]);
  const handleChange = () => {
    let result = null;
    if (state.name && state.version) {
      result = {
        name: state.name,
        version: state.version,
        type: props.type,
      };
    }
    props.onChange(result);
  };
  return (
    <Row type="flex" className="mg-b1x">
      <Col span={9}>
        <CommonSelect
          placeholder="请选择类型"
          onChange={(name) => setState({ name, version: undefined })}
          value={state.name}
          dataSource={props.singlePluginRenderResponseList}
          optionFilterProp="children"
          showSearch
          allowClear={false}
        />
      </Col>
      <Col span={9} push={1}>
        <CommonSelect
          onChange={(version) => setState({ version })}
          value={state.version}
          placeholder="请选择版本"
          dataSource={state.versionList}
          optionFilterProp="children"
          showSearch
          allowClear={false}
        />
      </Col>
    </Row>
  );
};
