/**
 * @author chuxu
 */
import { Select, Spin } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import { httpGet, httpPost } from 'src/utils/request';
interface Props extends SelectProps {
  value?: any;
  ajaxProps: { method: 'GET' | 'POST'; url: string };
  paramsKey: string; // 请求列表的入参key
  placeholder?: string;
  labelAndValue?: [string, string]; // 返回列表的label\value值
  onChange: (value) => void;
  onSelect: (value) => void;
  isArray: boolean;
}
const { Option } = Select;
const RemoteSelect: React.FC<Props> = props => {
  let timeout;
  let currentValue;
  const [state, setState] = useStateReducer({
    dataSource: [],
    value: undefined
  });
  useEffect(() => {
    setState({
      value: props.value
    });
  }, [props.value]);

  const fetch = async value => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;
    timeout = setTimeout(() => query(value), 300);
  };

  const query = async value => {
    const { method, url } = props.ajaxProps;
    const ajaxEvent =
      method === 'GET'
        ? httpGet(url, { [props.paramsKey]: value })
        : httpPost(url, { [props.paramsKey]: value });
    const {
      data: { data, success },
      total
    } = await ajaxEvent;
    if (success) {
      if (currentValue === value) {
        if (props.isArray) {
          setState({
            dataSource:
              data &&
              data.map((item, k) => {
                return {
                  label: item,
                  value: item
                };
              })
          });
          return;
        }
        setState({
          dataSource:
            data &&
            data.map((item, k) => {
              return {
                label: item[props.labelAndValue[0]],
                value: item[props.labelAndValue[1]]
              };
            })
        });
      }
    }
  };

  const handleSearch = value => {
    if (value) {
      fetch(value);
    } else {
      setState({ dataSource: [] });
    }
  };

  const handleChange = value => {
    props.onChange(value);
  };

  const handleSelect = value => {
    props.onSelect(value);
  };
  return (
    <Select
      {...props}
      allowClear={true}
      showSearch
      value={state.value}
      placeholder={props.placeholder || '请输入'}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      onSelect={handleSelect}
      notFoundContent={null}
      style={{ width: '100%' }}
    >
      {state.dataSource &&
        state.dataSource.map(item => (
          <Option key={item.value}>{item.label}</Option>
        ))}
    </Select>
  );
};
export default RemoteSelect;
