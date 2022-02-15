import { Col, Row, Input } from 'antd';
import { CommonSelect, useStateReducer } from 'racc';
import React, { useEffect } from 'react';

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

  return (
    <>
      {pluginList.map((item, index) => (
        <PluginSelectItem
          key={index}
          value={value[index]}
          onChange={(val) => handleChange(val, index)}
          {...item}
          versions={item.version}
        />
      ))}
    </>
  );
};
export default RelatePlugin;

interface PluginSelectItemProps {
  id: number;
  type: string;
  name: string;
  versions: string[];
  onChange?: (value: any) => void;
  value?: any;
}
const PluginSelectItem: React.FC<PluginSelectItemProps> = (props) => {
  const { value, onChange, id, type, name, versions = [] } = props;
  return (
    <Row type="flex" className="mg-b1x">
      <Col span={9}>
        <Input value={name} readOnly style={{ background: '#f7f8f9' }} />
      </Col>
      <Col span={9} push={1}>
        <CommonSelect
          onChange={(val) => onChange({ id, type,  name, version: val })}
          value={value?.version}
          placeholder="请选择版本"
          dataSource={versions.map(x => ({ label: x, value: x }))}
          optionFilterProp="children"
          showSearch
          allowClear={false}
        />
      </Col>
    </Row>
  );
};
