/**
 * @name
 * @author MingShined
 */
import { CommonSelect } from 'racc';
import { CommonSelectProps } from 'racc/dist/common-select/type';
import React, { useEffect, useState } from 'react';
import { httpGet } from 'src/utils/request';

interface Props extends CommonSelectProps {
  url?: string;
  labelKey?: string;
  valueKey?: string;
  // onChange?: (
  //   value: any,
  //   option: React.ReactElement<any> | React.ReactElement<any>[]
  // ) => void;
  params?: any;
  onLoad?: () => void;
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
    } = await httpGet(props.url, props.params || {});
    if (success) {
      const { labelKey, valueKey } = props;
      const result = props.labelKey
        ? data.map(item => ({
          label: item[labelKey],
          value: item[valueKey]
        }))
        : data;
      setDataSource(result);
      if (props.onLoad) {
        props.onLoad();
      }
    }
  };
  if (props.url) {
    return <CommonSelect {...props} dataSource={dataSource} />;
  }
  return null;
};
export default BusinessSelect;
