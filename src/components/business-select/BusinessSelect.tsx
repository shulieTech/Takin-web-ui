/**
 * @name
 * @author MingShined
 */
import { connect } from 'dva';
import { CommonSelect } from 'racc';
import React, { useEffect, useState } from 'react';
import { CommonModelState } from 'src/models/common';
import { httpGet } from 'src/utils/request';

type BusinessType = '';

interface Props extends CommonModelState {
  type: BusinessType;
  url?: string;
  labelKey?: string;
  valueKey?: string;
}
const BusinessSelect: React.FC<Props> = props => {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    if (!props.url) {
      return;
    }
    queryDataSource();
  }, []);
  const queryDataSource = async () => {
    const {
      data: { data, success }
    } = await httpGet(props.url);
    if (success) {
      const { labelKey, valueKey } = props;
      const result = props.labelKey
        ? data.map(item => ({
          label: item[labelKey],
          value: item[valueKey]
        }))
        : data;
      setDataSource(result);
    }
  };
  if (props.url) {
    return <CommonSelect {...props} dataSource={dataSource} />;
  }
  return (
    <CommonSelect
      {...props}
      notFoundContent="加载中"
      dataSource={
        props.dictionaryMap[props.type] &&
        props.dictionaryMap[props.type].filter(item => item.value)
      }
    />
  );
};
export default connect(({ common }) => ({ ...common }))(BusinessSelect);
